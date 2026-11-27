<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import {
  store,
  bagTasks,
  inProgress,
  pullBlockReason,
  toast,
  switchToDemo,
  seedDemoTasks,
  isRegistered,
} from './store'
import AddTaskForm from './components/AddTaskForm.vue'
import BagList from './components/BagList.vue'
import ActiveList from './components/ActiveList.vue'
import DrawOverlay from './components/DrawOverlay.vue'
import Doodles from './components/Doodles.vue'
import Avatars from './components/Avatars.vue'
import OnboardingModal from './components/OnboardingModal.vue'
import RegisterModal from './components/RegisterModal.vue'
import ProfileView from './components/ProfileView.vue'
import DoneModal from './components/DoneModal.vue'
import TechniquesModal from './components/TechniquesModal.vue'

const drawing = ref(false)
const doneOpen = ref(false)
const techniquesOpen = ref(false)
const blockReason = computed(() => pullBlockReason())

// Онбординг показываем всем незарегистрированным при каждом новом входе
// (флаг onboardingSeen живёт только в рамках сессии и сбрасывается перезагрузкой).
const showOnboarding = computed(() => !isRegistered.value && !store.ui.onboardingSeen)

// Демо-режим: при загрузке приложения возвращаем в мешок шесть стандартных
// примеров, если пользователь успел их удалить или выполнить.
if (store.user?.mode === 'demo') {
  seedDemoTasks()
}

// Окно похвалы открывается само, когда счётчик сделанных дел растёт.
watch(
  () => store.doneTotal,
  (n, old) => {
    if (n > old && store.lastDone) doneOpen.value = true
  }
)

function openRegister() {
  store.ui.registerOpen = true
}

function onRegistered(name) {
  const bagNote =
    store.tasks.length > 0
      ? 'Твои дела уже в мешке.'
      : 'Мешок пуст — наполняй.'
  toast(`Профиль создан. Добро пожаловать, ${name}! ${bagNote}`)
}

function greeting() {
  const h = new Date().getHours()
  const part = h < 5 ? 'Доброй ночи' : h < 12 ? 'Доброе утро' : h < 18 ? 'Добрый день' : 'Добрый вечер'
  return `${part}, ${store.user.name}!`
}

onMounted(() => {
  if (isRegistered.value) toast(greeting())
})

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

function onDoneNext() {
  doneOpen.value = false
  openDraw()
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
      <Doodles name="bag" :size="128" />
      <div>
        <h1>Ленивые дела</h1>
        <p class="site-header__tagline">Вытащи дело из мешка — и лень сама решит, чем заняться</p>
      </div>
    </div>
    <div class="site-header__right">
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
      <button
        v-if="isRegistered"
        type="button"
        class="profile-btn"
        aria-label="Открыть профиль"
        @click="store.ui.view = 'profile'"
      >
        <Avatars :name="store.user.avatar" :size="44" />
        <span class="profile-btn__name">{{ store.user.name }}</span>
      </button>
      <button v-else type="button" class="btn btn--primary btn--header" @click="openRegister">
        Завести профиль
      </button>
      <button
        type="button"
        class="btn btn--ghost btn--header"
        aria-label="Открыть приёмы против лени"
        @click="techniquesOpen = true"
      >
        Приёмы
      </button>
    </div>
  </header>

  <main v-if="store.ui.view === 'main'" class="main">
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

  <footer v-if="store.ui.view === 'main'" class="site-footer">
    <p>Данные хранятся только в этом браузере. Мешок никому ничего не сообщает.</p>
  </footer>

  <ProfileView v-if="store.ui.view === 'profile'" @close="store.ui.view = 'main'" />

  <OnboardingModal
    v-if="showOnboarding"
    @register="openRegister"
    @demo="switchToDemo"
    @close="store.ui.onboardingSeen = true"
  />
  <RegisterModal
    v-if="store.ui.registerOpen"
    :has-tasks="store.tasks.length > 0"
    @close="store.ui.registerOpen = false"
    @registered="onRegistered"
  />

  <DrawOverlay v-if="drawing" @close="drawing = false" />
  <DoneModal v-if="doneOpen" @close="doneOpen = false" @next="onDoneNext" />
  <TechniquesModal v-if="techniquesOpen" @close="techniquesOpen = false" />

  <div v-if="store.ui.toast" class="toast" role="status">{{ store.ui.toast }}</div>
</template>
