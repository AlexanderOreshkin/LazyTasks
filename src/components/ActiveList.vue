<script setup>
import { ref } from 'vue'
import { DIFFICULTY, inProgress, completeTask, returnToBag, postponeTask, toast, randomQuote } from '../store'
import Doodles from './Doodles.vue'

const diffMeta = DIFFICULTY
const postponeFor = ref(null) // id дела, для которого открыта форма переноса
const postponeComment = ref('')
const commentError = ref('')

function onComplete(task) {
  completeTask(task.id)
  toast(`Сделано: «${task.title}». ${randomQuote()}`)
}

function onReturn(task) {
  returnToBag(task.id)
  toast(`«${task.title}» вернулось в мешок.`)
}

function openPostpone(task) {
  postponeFor.value = task.id
  postponeComment.value = task.comment || ''
  commentError.value = ''
}

function confirmPostpone(task) {
  const c = postponeComment.value.trim()
  if (!c) {
    commentError.value = 'Напиши пару слов, из-за чего задержка — мешок любит справедливость.'
    return
  }
  postponeTask(task.id, c)
  postponeFor.value = null
  toast(`«${task.title}» отложено. Мешок всё понимает.`)
}

function canPostpone(task) {
  return diffMeta[task.difficulty].postpone
}
</script>

<template>
  <section aria-label="Дела в работе">
    <p class="active-note">
      Одновременно — максимум два дела. Лёгкое не переносится: его можно только
      сделать или вернуть в мешок. Среднее и сложное можно отложить с комментарием.
    </p>

    <div v-if="inProgress.length" class="active-list">
      <article
        v-for="task in inProgress"
        :key="task.id"
        class="active-card sticker"
        :class="task.status === 'paused' ? 'active-card--paused' : ''"
      >
        <div class="active-card__head">
          <span class="chip" :class="`chip--${task.difficulty}`">
            {{ diffMeta[task.difficulty].label }}
          </span>
          <span v-if="task.status === 'paused'" class="paused-mark">Перенесено</span>
        </div>

        <h3 class="active-card__title">{{ task.title }}</h3>
        <p v-if="task.comment" class="active-card__comment">Почему задержка: {{ task.comment }}</p>

        <div v-if="postponeFor !== task.id" class="active-card__actions">
          <button type="button" class="btn btn--primary btn--sm" @click="onComplete(task)">
            Сделано
          </button>
          <button
            v-if="canPostpone(task)"
            type="button"
            class="btn btn--sm"
            @click="openPostpone(task)"
          >
            Перенести
          </button>
          <span v-else class="no-postpone">Лёгкое дело не переносится</span>
          <button type="button" class="btn btn--ghost btn--sm" @click="onReturn(task)">
            В мешок
          </button>
        </div>

        <form v-else class="postpone-form" @submit.prevent="confirmPostpone(task)">
          <label :for="`comment-${task.id}`">Из-за чего задержка?</label>
          <input
            :id="`comment-${task.id}`"
            v-model="postponeComment"
            type="text"
            maxlength="140"
            placeholder="Например: жду ответа от мастера"
          />
          <p v-if="commentError" class="postpone-form__error" role="alert">{{ commentError }}</p>
          <div class="postpone-form__row">
            <button type="submit" class="btn btn--sm">Отложить</button>
            <button type="button" class="btn btn--ghost btn--sm" @click="postponeFor = null">
              Отмена
            </button>
          </div>
        </form>
      </article>
    </div>

    <div v-else class="active-empty sticker sticker--tilt-r">
      <Doodles name="coffee" :size="100" />
      <h3>Ничего не в работе</h3>
      <p>
        Идеальное время вытащить что-нибудь из мешка. Он уже потянулся к завязке.
      </p>
    </div>
  </section>
</template>

<style scoped lang="scss">
.active-note {
  max-width: 62ch;
  color: var(--ink-soft);
  font-size: 15px;
  margin: 0 0 22px;
}

.active-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 18px;
}

.active-card {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;

  &--paused {
    opacity: 0.85;
    background: var(--paper-deep);
  }

  &__head {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  &__title {
    font-family: var(--font-body);
    font-weight: 800;
    font-size: 19px;
    line-height: 1.4;
    overflow-wrap: anywhere;
  }

  &__comment {
    font-size: 14px;
    color: var(--ink-soft);
    border-left: 3px solid var(--accent);
    padding-left: 10px;
  }

  &__actions {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 10px;
    margin-top: 4px;
  }
}

.no-postpone {
  font-size: 13px;
  color: var(--ink-soft);
  max-width: 12ch;
  line-height: 1.35;
}

.btn--sm {
  min-height: 44px;
  padding: 8px 18px;
  font-size: 15px;
}

.chip {
  padding: 3px 12px;
  border: 2px solid var(--line);
  border-radius: 999px;
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 13px;

  &--easy { background: var(--sage); color: var(--cream); }
  &--medium { background: #ffd98e; color: var(--ink); }
  &--hard { background: var(--brick); color: var(--cream); }
}

.paused-mark {
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--accent-deep);
}

.postpone-form {
  display: flex;
  flex-direction: column;
  gap: 10px;

  label {
    font-weight: 800;
    font-size: 14px;
  }

  input {
    min-height: 48px;
    padding: 10px 14px;
    border: var(--stroke) solid var(--line);
    border-radius: 12px;
    background: var(--paper);
    font-family: var(--font-body);
    font-size: 16px;
    color: var(--ink);
  }

  &__error {
    color: var(--brick);
    font-weight: 700;
    font-size: 14px;
  }

  &__row {
    display: flex;
    gap: 8px;
  }
}

.active-empty {
  padding: 40px 30px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  max-width: 480px;
  margin: 30px auto;

  h3 {
    font-size: 26px;
  }

  p {
    color: var(--ink-soft);
    max-width: 34ch;
  }
}
</style>
