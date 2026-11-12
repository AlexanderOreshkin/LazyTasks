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

