<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import {
  DIFFICULTY,
  poolForMood,
  pickRandom,
  takeTask,
  refuseTask,
  randomQuote,
  toast,
} from '../store'
import Doodles from './Doodles.vue'

const emit = defineEmits(['close'])

const step = ref('mood') // mood | shaking | reveal
const mood = ref(null) // light | heavy
const drawn = ref(null)
const quote = ref('')
let shakeTimer = null

const counts = computed(() => ({
  light: poolForMood('light').length,
  heavy: poolForMood('heavy').length,
}))

/** Сколько дел в пуле текущего настроения — для кнопки «перетянуть». */
const poolSize = computed(() =>
  mood.value ? poolForMood(mood.value).length : 0
)

const canRedraw = computed(() => poolSize.value > 1)

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
  if (!canRedraw.value) return
  const pool = poolForMood(mood.value)
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

/** Отказ одноразовый: дело уходит в кулдаун до конца дня и больше не попадётся сегодня. */
function refuse() {
  refuseTask(drawn.value.id)
  toast(
    `Отказ засчитан: «${drawn.value.title}» сегодня больше не попадётся. ` +
      `Завтра мешок его простит.`
  )
  close()
}

function close() {
  clearTimeout(shakeTimer)
  emit('close')
}

function onKeydown(e) {
  if (e.key === 'Escape') close()
}

onMounted(() => window.addEventListener('keydown', onKeydown))
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
          <button
            type="button"
            class="mood-card"
            :disabled="!counts.light"
            @click="chooseMood('light')"
          >
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
        <p v-if="!counts.light || !counts.heavy" class="overlay__hint">
          <template v-if="!counts.light">
            Лёгких дел в мешке нет — добавь пару, чтобы было с чего начинать ленивый день.
          </template>
          <template v-else>Серьёзных дел не осталось — только лёгкие.</template>
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
          <button v-if="canRedraw" type="button" class="btn" @click="redraw">
            Вытащить другое
          </button>
          <p v-else class="reveal-single">
            В этой категории только одно дело — перетягивать нечего.
          </p>
          <button type="button" class="btn btn--ghost" @click="refuse">
            Отказаться (одноразово)
          </button>
        </div>
      </template>
    </div>
  </div>
</template>
