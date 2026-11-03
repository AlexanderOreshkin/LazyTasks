<script setup>
import { DIFFICULTY, bagTasks, removeTask, toast } from '../store'
import Doodles from './Doodles.vue'

const diffMeta = DIFFICULTY

function onRemove(task) {
  removeTask(task.id)
  toast(`«${task.title}» выброшено из мешка.`)
}
</script>

<template>
  <section aria-label="Дела в мешке">
    <div v-if="bagTasks.length" class="bag-list">
      <article
        v-for="(task, i) in bagTasks"
        :key="task.id"
        class="task-card sticker"
        :class="i % 2 ? 'sticker--tilt-r' : 'sticker--tilt-l'"
      >
        <div class="task-card__main">
          <span class="chip" :class="`chip--${task.difficulty}`">
            {{ diffMeta[task.difficulty].label }}
          </span>
          <h3 class="task-card__title">{{ task.title }}</h3>
          <p v-if="task.comment" class="task-card__comment">
            Отложено, потому что: {{ task.comment }}
          </p>
        </div>
        <button
          class="task-card__remove"
          type="button"
          :aria-label="`Удалить дело «${task.title}»`"
          @click="onRemove(task)"
        >
          <svg width="18" height="18" viewBox="0 0 20 20" aria-hidden="true">
            <path d="M4 4l12 12M16 4L4 16" stroke="currentColor" stroke-width="3" stroke-linecap="round" />
          </svg>
        </button>
      </article>
    </div>

    <div v-else class="bag-empty sticker sticker--tilt-l">
      <Doodles name="bag" :size="110" />
      <h3>Мешок пуст</h3>
      <p>
        Мешок дремлет: дел не осталось. Добавь что-нибудь, что давно откладываешь, —
        он с радостью это подержит.
      </p>
    </div>
  </section>
</template>

<style scoped lang="scss">
.bag-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 18px;
}

.task-card {
  padding: 18px 18px 16px;
  display: flex;
  gap: 12px;
  justify-content: space-between;
  transition: transform 0.16s ease, box-shadow 0.16s ease;

  &:hover {
    transform: rotate(0deg) translateY(-3px);
    box-shadow: var(--shadow-lift);
  }

  &__main {
    display: flex;
    flex-direction: column;
    gap: 8px;
    min-width: 0;
  }

  &__title {
    font-family: var(--font-body);
    font-weight: 700;
    font-size: 17px;
    line-height: 1.45;
    overflow-wrap: anywhere;
  }

  &__comment {
    font-size: 14px;
    color: var(--ink-soft);
    border-left: 3px solid var(--paper-deep);
    padding-left: 10px;
  }

  &__remove {
    flex: 0 0 auto;
    align-self: flex-start;
    width: 40px;
    height: 40px;
    display: grid;
    place-items: center;
    border: none;
    border-radius: 12px;
    background: transparent;
    color: var(--ink-soft);
    transition: background-color 0.16s ease, color 0.16s ease;

    &:hover {
      background: rgba(179, 64, 15, 0.1);
      color: var(--brick);
    }
  }
}

.chip {
  align-self: flex-start;
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

.bag-empty {
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
