<script setup>
import { ref, computed, onUnmounted } from 'vue'
import {
  DIFFICULTY,
  poolForMood,
  pickRandom,
  takeTask,
  randomQuote,
  toast,
} from '../store'
import Doodles from './Doodles.vue'

const emit = defineEmits(['close'])

const step = ref('mood') // mood | shaking | reveal | none
const mood = ref(null) // light | heavy
const drawn = ref(null)
const quote = ref('')
let shakeTimer = null

const counts = computed(() => ({
  light: poolForMood('light').length,
  heavy: poolForMood('heavy').length,
}))

const diffLabel = computed(() => (drawn.value ? DIFFICULTY[drawn.value.difficulty].label : ''))

function chooseMood(m) {
  mood.value = m
  const pool = poolForMood(m)
  if (!pool.length) return // кнопка в таком случае неактивна, страховка
  step.value = 'shaking'
  shakeTimer = setTimeout(() => {
    drawn.value = pickRandom(pool)
    quote.value = randomQuote()
    step.value = 'reveal'
  }, 1100)
}

function redraw() {
  const pool = poolForMood(mood.value)
  if (pool.length <= 1) {
    // перетянуть то же самое неинтересно, но и выбор один
    drawn.value = pool[0] || drawn.value
    quote.value = randomQuote()
    return
  }
  let next = drawn.value
  while (next && next.id === drawn.value.id) {
    next = pickRandom(pool)
  }
  drawn.value = next
  quote.value = randomQuote()
}

function accept() {
  takeTask(drawn.value.id)
  toast(`«${drawn.value.title}» — твоё. Мешок верит в тебя.`)
  close()
}

function refuse() {
  close()
}

function close() {
  clearTimeout(shakeTimer)
  emit('close')
}

function onKeydown(e) {
  if (e.key === 'Escape') close()
}

window.addEventListener('keydown', onKeydown)
onUnmounted(() => {
  window.removeEventListener('keydown', onKeydown)
  clearTimeout(shakeTimer)
})
</script>

<template>
  <div class="overlay" role="dialog" aria-modal="true" aria-label="Вытащить дело из мешка">
    <div class="overlay__backdrop" @click="close"></div>

    <div class="overlay__panel sticker pop-in">
      <!-- Шаг 1: настроение -->
      <template v-if="step === 'mood'">
        <Doodles name="bag" :size="90" />
        <h2>На что ты сегодня настроен?</h2>
        <p class="overlay__sub">
          Мешок подстроится. Лёгкое дело отделается быстро, серьёзное — зато с почестями.
        </p>
        <div class="mood-row">
          <button type="button" class="mood-card" @click="chooseMood('light')">
            <Doodles name="feather" :size="54" />
            <span class="mood-card__title">Полениться правильно</span>
            <span class="mood-card__sub">
              Лёгкое дело · {{ counts.light ? `в мешке: ${counts.light}` : 'пусто' }}
            </span>
          </button>
          <button
            type="button"
            class="mood-card"
            :disabled="!counts.heavy"
            @click="chooseMood('heavy')"
          >
            <Doodles name="mountain" :size="54" />
            <span class="mood-card__title">Рвануть серьёзное</span>
            <span class="mood-card__sub">
              Среднее или сложное · {{ counts.heavy ? `в мешке: ${counts.heavy}` : 'пусто' }}
            </span>
          </button>
        </div>
        <p v-if="!counts.light" class="overlay__hint">
          Лёгких дел в мешке нет — добавь пару, чтобы было с чего начинать ленивый день.
        </p>
        <button type="button" class="btn btn--ghost" @click="close">Закрыть</button>
      </template>

      <!-- Шаг 2: тряска -->
      <template v-else-if="step === 'shaking'">
        <div class="bag-shaking">
          <Doodles name="bag" :size="130" />
        </div>
        <h2>Мешок думает…</h2>
        <p class="overlay__sub">Он перебирает дела лапками внутри.</p>
      </template>

      <!-- Шаг 3: дело -->
      <template v-else-if="step === 'reveal' && drawn">
        <span class="chip" :class="`chip--${drawn.difficulty}`">{{ diffLabel }}</span>
        <h2 class="reveal-title">{{ drawn.title }}</h2>
        <blockquote class="reveal-quote">«{{ quote }}»</blockquote>
        <div class="reveal-actions">
          <button type="button" class="btn btn--primary" @click="accept">Взять в работу</button>
          <button type="button" class="btn" @click="redraw">Вытащить другое</button>
          <button type="button" class="btn btn--ghost" @click="refuse">Вернуть и закрыть</button>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped lang="scss">
.overlay {
  position: fixed;
  inset: 0;
  z-index: 50;
  display: grid;
  place-items: center;
  padding: 20px;

  &__backdrop {
    position: absolute;
    inset: 0;
    background: rgba(30, 30, 30, 0.45);
    backdrop-filter: blur(3px);
  }

  &__panel {
    position: relative;
    width: min(560px, 100%);
    max-height: calc(100dvh - 40px);
    overflow-y: auto;
    padding: 36px 32px 30px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 14px;
    text-align: center;
    transform: rotate(-1.2deg);
  }

  &__sub {
    color: var(--ink-soft);
    max-width: 40ch;
  }

  &__hint {
    font-size: 14px;
    color: var(--accent-deep);
    font-weight: 700;
    max-width: 42ch;
  }

  h2 {
    font-size: clamp(26px, 4vw, 34px);
  }
}

.mood-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
  width: 100%;
  margin-top: 8px;
}

.mood-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  min-height: 44px;
  padding: 22px 14px 18px;
  border: var(--stroke) solid var(--line);
  border-radius: var(--r-sticker);
  background: var(--paper);
  box-shadow: 0 3px 0 var(--line);
  transition: transform 0.16s ease, box-shadow 0.16s ease, background-color 0.16s ease;

  &:hover:not(:disabled) {
    transform: translateY(-3px) rotate(-0.6deg);
    box-shadow: 0 6px 0 var(--line);
    background: var(--cream);
  }

  &:active:not(:disabled) {
    transform: translateY(1px);
    box-shadow: 0 1px 0 var(--line);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &__title {
    font-family: var(--font-display);
    font-weight: 700;
    font-size: 18px;
    line-height: 1.25;
  }

  &__sub {
    font-size: 13px;
    color: var(--ink-soft);
  }
}

.reveal-title {
  font-size: clamp(24px, 4vw, 32px);
  max-width: 22ch;
  overflow-wrap: anywhere;
}

.reveal-quote {
  margin: 0;
  font-style: italic;
  color: var(--ink-soft);
  max-width: 40ch;
  position: relative;
  padding-top: 12px;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 56px;
    height: 3px;
    background: var(--accent);
    border-radius: 2px;
  }
}

.reveal-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px;
  margin-top: 8px;
}

.chip {
  padding: 4px 16px;
  border: 2px solid var(--line);
  border-radius: 999px;
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 14px;

  &--easy { background: var(--sage); color: var(--cream); }
  &--medium { background: #ffd98e; color: var(--ink); }
  &--hard { background: var(--brick); color: var(--cream); }
}

@media (max-width: 520px) {
  .mood-row {
    grid-template-columns: 1fr;
  }

  .overlay__panel {
    padding: 28px 20px 24px;
  }
}
</style>
