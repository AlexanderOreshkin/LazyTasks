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

<style scoped lang="scss">
.site-header {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: 18px;
  padding: 28px clamp(20px, 5vw, 64px) 18px;

  &__brand {
    display: flex;
    align-items: center;
    gap: 16px;

    h1 {
      font-size: clamp(30px, 4.5vw, 42px);
      font-weight: 800;
      letter-spacing: -0.01em;
    }
  }

  &__tagline {
    color: var(--ink-soft);
    font-size: 15px;
    max-width: 42ch;
  }

  &__stats {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
  }
}

.stat {
  padding: 8px 16px;
  border: var(--stroke) solid var(--line);
  border-radius: 999px;
  background: var(--cream);
  box-shadow: 0 2px 0 var(--line);
  font-size: 14px;
  color: var(--ink-soft);

  strong {
    font-family: var(--font-display);
    font-size: 17px;
    color: var(--ink);
    margin-left: 2px;
  }
}

.main {
  flex: 1;
  width: min(1060px, 100%);
  margin: 0 auto;
  padding: 10px clamp(20px, 5vw, 64px) 60px;
}

.tabs {
  display: inline-flex;
  gap: 8px;
  padding: 6px;
  margin-bottom: 26px;
  border: var(--stroke) solid var(--line);
  border-radius: 999px;
  background: var(--paper-deep);

  &__btn {
    position: relative;
    min-height: 44px;
    padding: 8px 22px;
    border: none;
    border-radius: 999px;
    background: transparent;
    font-family: var(--font-display);
    font-weight: 700;
    font-size: 16px;
    color: var(--ink-soft);
    transition: background-color 0.16s ease, color 0.16s ease, box-shadow 0.16s ease;

    &:hover {
      color: var(--ink);
    }

    &--on {
      background: var(--cream);
      color: var(--ink);
      box-shadow: 0 2px 0 var(--line);
    }
  }

  &__badge {
    display: inline-grid;
    place-items: center;
    min-width: 22px;
    height: 22px;
    margin-left: 6px;
    padding: 0 5px;
    border-radius: 999px;
    background: var(--accent);
    color: var(--cream);
    font-size: 12.5px;
    font-weight: 800;
  }
}

.view {
  display: flex;
  flex-direction: column;
  gap: 26px;
}

.pull-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 16px;

  &__reason {
    flex-basis: 100%;
    margin: 0;
    color: var(--accent-deep);
    font-weight: 700;
    font-size: 15px;
    max-width: 60ch;
  }

  &__clear {
    margin-left: auto;
  }
}

.btn--big {
  min-height: 60px;
  padding: 14px 34px;
  font-size: 21px;
}

.site-footer {
  padding: 22px clamp(20px, 5vw, 64px) 30px;
  color: var(--ink-soft);
  font-size: 13.5px;
  text-align: center;
}

.toast {
  position: fixed;
  left: 50%;
  bottom: 26px;
  transform: translateX(-50%);
  z-index: 80;
  max-width: min(520px, calc(100vw - 40px));
  padding: 14px 24px;
  border: var(--stroke) solid var(--line);
  border-radius: 14px;
  background: var(--ink);
  color: var(--cream);
  font-weight: 600;
  font-size: 15px;
  text-align: center;
  box-shadow: 0 12px 28px rgba(30, 30, 30, 0.3);
  animation: toast-in 0.28s ease-out both;
}

.decor {
  position: fixed;
  z-index: -1;
  opacity: 0.9;
  pointer-events: none;

  &--1 { top: 16%; right: 4%; transform: rotate(14deg); }
  &--2 { top: 42%; left: 2.5%; transform: rotate(-10deg); }
  &--3 { bottom: 14%; right: 7%; transform: rotate(6deg); }
  &--4 { top: 8%; left: 38%; transform: rotate(-4deg); opacity: 0.7; }
}

@media (max-width: 900px) {
  .decor--3, .decor--4 { display: none; }
}

@media (max-width: 560px) {
  .decor { display: none; }

  .pull-row__clear {
    margin-left: 0;
  }

  .btn--big {
    width: 100%;
  }
}
</style>
