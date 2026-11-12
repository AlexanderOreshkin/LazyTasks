<script setup>
import { ref, computed } from 'vue'
import { DIFFICULTY, addTask, toast } from '../store'
import Doodles from './Doodles.vue'

const title = ref('')
const difficulty = ref('easy')
const error = ref('')

const options = computed(() => Object.values(DIFFICULTY))

function submit() {
  const t = title.value.trim()
  if (!t) {
    error.value = 'Опиши дело хотя бы парой слов.'
    return
  }
  if (t.length > 140) {
    error.value = 'Мешок переваривает дела не длиннее 140 символов.'
    return
  }
  error.value = ''
  addTask(t, difficulty.value)
  title.value = ''
  toast('Дело упало в мешок. Оно подождёт.')
}
</script>

<template>
  <form class="add-form sticker sticker--tilt-l" @submit.prevent="submit">
    <label class="add-form__label" for="task-title">Что откладываем?</label>
    <input
      id="task-title"
      v-model="title"
      class="add-form__input"
      type="text"
      maxlength="140"
      placeholder="Например: разобрать ящик с проводами"
    />

    <fieldset class="add-form__diff">
      <legend class="add-form__legend">Насколько оно страшное?</legend>
      <div class="diff-row">
        <button
          v-for="opt in options"
          :key="opt.key"
          type="button"
          class="diff-option"
          :class="[`diff-option--${opt.key}`, { 'diff-option--on': difficulty === opt.key }]"
          :aria-pressed="difficulty === opt.key"
          @click="difficulty = opt.key"
        >
          <Doodles
            :name="opt.key === 'easy' ? 'feather' : opt.key === 'medium' ? 'battery' : 'mountain'"
            :size="44"
          />
          <span class="diff-option__label">{{ opt.label }}</span>
          <span class="diff-option__hint">{{ opt.hint }}</span>
        </button>
      </div>
    </fieldset>

    <p v-if="error" class="add-form__error" role="alert">{{ error }}</p>

    <button type="submit" class="btn btn--primary add-form__submit">Бросить в мешок</button>
  </form>
</template>

