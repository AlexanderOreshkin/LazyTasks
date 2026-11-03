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

<style scoped lang="scss">
.add-form {
  padding: 26px 26px 28px;
  display: flex;
  flex-direction: column;
  gap: 16px;

  &__label {
    font-family: var(--font-display);
    font-weight: 800;
    font-size: 24px;
  }

  &__input {
    width: 100%;
    min-height: 56px;
    padding: 12px 18px;
    border: var(--stroke) solid var(--line);
    border-radius: 14px;
    background: var(--paper);
    font-family: var(--font-body);
    font-size: 17px;
    color: var(--ink);

    &::placeholder {
      color: rgba(74, 70, 60, 0.55);
    }
  }

  &__diff {
    border: 0;
    padding: 0;
    margin: 0;
  }

  &__legend {
    font-weight: 800;
    font-size: 15px;
    letter-spacing: 0.02em;
    color: var(--ink-soft);
    margin-bottom: 10px;
  }

  &__error {
    color: var(--brick);
    font-weight: 700;
    font-size: 15px;
  }

  &__submit {
    align-self: flex-start;
  }
}

.diff-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.diff-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 14px 10px 12px;
  min-height: 44px;
  border: var(--stroke) solid var(--line);
  border-radius: 14px;
  background: var(--paper);
  text-align: center;
  transition:
    transform 0.16s ease,
    background-color 0.16s ease,
    box-shadow 0.16s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 3px 0 var(--line);
  }

  &__label {
    font-family: var(--font-display);
    font-weight: 700;
    font-size: 16px;
  }

  &__hint {
    font-size: 12.5px;
    line-height: 1.4;
    color: var(--ink-soft);
  }

  &--on {
    background: var(--cream);
    box-shadow: 0 3px 0 var(--line);
    transform: translateY(-2px);
  }

  &--easy.diff-option--on { outline: 3px solid var(--sage); outline-offset: 2px; }
  &--medium.diff-option--on { outline: 3px solid var(--accent); outline-offset: 2px; }
  &--hard.diff-option--on { outline: 3px solid var(--brick); outline-offset: 2px; }
}

@media (max-width: 640px) {
  .diff-row {
    grid-template-columns: 1fr;
  }

  .diff-option {
    flex-direction: row;
    text-align: left;
    padding: 12px 16px;

    &__hint {
      display: none;
    }
  }
}
</style>
