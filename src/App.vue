<script setup>
import { ref, computed } from 'vue'
import {
  store,
  bagTasks,
  inProgress,
  pullBlockReason,
  addTask,
  toast,
} from './store'
import AddTaskForm from './components/AddTaskForm.vue'
import BagList from './components/BagList.vue'
import ActiveList from './components/ActiveList.vue'
import DrawOverlay from './components/DrawOverlay.vue'
import Doodles from './components/Doodles.vue'

// Первый запуск — наполняем мешок примерами, чтобы было что трогать.
if (!store.tasks.length && store.doneTotal === 0) {
  const seed = [
    ['Ответить на старое письмо', 'easy'],
    ['Почистить клавиатуру', 'easy'],
    ['Разобрать ящик с проводами', 'medium'],
    ['Выставить на продажу ненужные вещи', 'medium'],
    ['Сделать резервную копию фото', 'hard'],
    ['Записаться к стоматологу', 'hard'],
  ]
  seed.forEach(([t, d]) => addTask(t, d))
}

const drawing = ref(false)
const blockReason = computed(() => pullBlockReason())

function openDraw() {
  if (blockReason.value) {
    toast(blockReason.value)
    return
  }
  if (!bagTasks.value.length) {
    toast('Мешок пуст. Сначала брось в него дело.')
    return
  }
  drawing.value = true
}

function clearAll() {
  if (!store.tasks.length) return
  if (window.confirm('Выкинуть все дела из мешка? Это не отменить.')) {
    store.tasks.splice(0, store.tasks.length)
    toast('Мешок опустошён. Начинаем с чистого листа.')
  }
}
</script>

<template>
  <div class="decor decor--1"><Doodles name="star" :size="72" /></div>
  <div class="decor decor--2"><Doodles name="zzz" :size="80" /></div>
  <div class="decor decor--3"><Doodles name="squiggle" :size="110" /></div>
  <div class="decor decor--4"><Doodles name="cloud" :size="86" /></div>

  <header class="site-header">
    <div class="site-header__brand">
      <Doodles name="bag" :size="64" />
      <div>
        <h1>Ленивые дела</h1>
        <p class="site-header__tagline">Вытащи дело из мешка — и лень сама решит, чем заняться</p>
      </div>
    </div>
    <div class="site-header__stats" aria-label="Статистика">
      <span class="stat">
        В мешке <strong>{{ bagTasks.length }}</strong>
      </span>
      <span class="stat">
        В работе <strong>{{ inProgress.length }}/2</strong>
      </span>
      <span class="stat">
        Сделано <strong>{{ store.doneTotal }}</strong>
      </span>
    </div>
  </header>

  <main class="main">
    <nav class="tabs" aria-label="Разделы">
      <button
        type="button"
        class="tabs__btn"
        :class="{ 'tabs__btn--on': store.ui.tab === 'bag' }"
        @click="store.ui.tab = 'bag'"
      >
        Мешок
      </button>
      <button
        type="button"
        class="tabs__btn"
        :class="{ 'tabs__btn--on': store.ui.tab === 'active' }"
        @click="store.ui.tab = 'active'"
      >
        В работе
        <span v-if="inProgress.length" class="tabs__badge">{{ inProgress.length }}</span>
      </button>
    </nav>

    <section v-if="store.ui.tab === 'bag'" class="view">
      <div class="pull-row">
        <button type="button" class="btn btn--primary btn--big" @click="openDraw">
          Вытащить дело из мешка
        </button>
        <p v-if="blockReason" class="pull-row__reason">{{ blockReason }}</p>
        <button
          v-if="store.tasks.length"
          type="button"
          class="btn btn--danger-ghost pull-row__clear"
          @click="clearAll"
        >
          Очистить мешок
        </button>
      </div>

      <AddTaskForm />
      <BagList />
    </section>

    <section v-else class="view">
      <div class="pull-row">
        <button type="button" class="btn btn--primary btn--big" @click="openDraw">
          Вытащить ещё одно дело
        </button>
        <p v-if="blockReason" class="pull-row__reason">{{ blockReason }}</p>
      </div>
      <ActiveList />
    </section>
  </main>

  <footer class="site-footer">
    <p>Данные хранятся только в этом браузере. Мешок никому ничего не сообщает.</p>
  </footer>

  <DrawOverlay v-if="drawing" @close="drawing = false" />

  <div v-if="store.ui.toast" class="toast" role="status">{{ store.ui.toast }}</div>
</template>

