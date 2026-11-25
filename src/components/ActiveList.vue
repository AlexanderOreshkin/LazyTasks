<script setup>
import { ref } from 'vue'
import { DIFFICULTY, inProgress, completeTask, returnToBag, postponeTask, splitTask, toast } from '../store'
import Doodles from './Doodles.vue'

const diffMeta = DIFFICULTY
const postponeFor = ref(null) // id дела, для которого открыта форма переноса
const postponeComment = ref('')
const commentError = ref('')
const splitFor = ref(null) // id дела, для которого открыта форма разбивки
const steps = ref(['', '', ''])
const splitError = ref('')

function onComplete(task) {
  // Похвалу и цитату показывает окно «Сделано» — оно открывается само
  // при росте счётчика doneTotal (смотри App.vue).
  completeTask(task.id)
}

function onReturn(task) {
  returnToBag(task.id)
  toast(`«${task.title}» вернулось в мешок.`)
}

function openPostpone(task) {
  splitFor.value = null
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

function openSplit(task) {
  postponeFor.value = null
  splitFor.value = task.id
  steps.value = ['', '', '']
  splitError.value = ''
}

function confirmSplit(task) {
  const err = splitTask(task.id, steps.value)
  if (err) {
    splitError.value = err
    return
  }
  splitFor.value = null
  toast(`«${task.title}» разбито на шаги — они уже ждут в работе. Мелкие дела не так страшны.`)
}

function canPostpone(task) {
  return diffMeta[task.difficulty].postpone
}

function canSplit(task) {
  return task.difficulty !== 'easy'
}
</script>

<template>
  <section aria-label="Дела в работе">
    <p class="active-note">
      Одновременно — максимум два дела. Лёгкое не переносится: его можно только
      сделать или вернуть в мешок. Среднее и сложное можно отложить с комментарием
      или разбить на шаги.
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

        <div v-if="postponeFor !== task.id && splitFor !== task.id" class="active-card__actions">
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
          <button
            v-if="canSplit(task)"
            type="button"
            class="btn btn--sm"
            @click="openSplit(task)"
          >
            Разбить на шаги
          </button>
          <button type="button" class="btn btn--ghost btn--sm" @click="onReturn(task)">
            В мешок
          </button>
        </div>

        <form v-else-if="postponeFor === task.id" class="postpone-form" @submit.prevent="confirmPostpone(task)">
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

        <form v-else class="split-form" @submit.prevent="confirmSplit(task)">
          <label>Разбить на шаги — минимум два:</label>
          <input
            v-for="(s, i) in steps"
            :key="i"
            v-model="steps[i]"
            type="text"
            maxlength="80"
            :placeholder="`Шаг ${i + 1}: например, найти коробку`"
          />
          <p v-if="splitError" class="split-form__error" role="alert">{{ splitError }}</p>
          <div class="split-form__row">
            <button type="submit" class="btn btn--sm">Разбить</button>
            <button type="button" class="btn btn--ghost btn--sm" @click="splitFor = null">
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
