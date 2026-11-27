<script setup>
import { ref, computed } from 'vue'
import {
  store,
  AVATARS,
  bagTasks,
  inProgress,
  daysWithUs,
  lazyTitle,
  streak,
  heatmap,
  bagLevel,
  renameUser,
  setAvatar,
  deleteProfile,
  toast,
} from '../store'
import Avatars from './Avatars.vue'

const emit = defineEmits(['close'])

const avatarPickerOpen = ref(false)
const nameEditing = ref(false)
const nameDraft = ref('')
const nameError = ref('')
const confirmDelete = ref(false)

const user = computed(() => store.user)
const avatarMeta = computed(() => AVATARS.find((a) => a.key === user.value.avatar) || AVATARS[0])
const title = computed(() => lazyTitle(store.doneTotal))

const stats = computed(() => [
  { label: 'Серия дней', value: streak.value },
  { label: 'Дней с нами', value: daysWithUs.value },
  { label: 'Сделано дел', value: store.doneTotal },
  { label: 'Отказов', value: store.refusedTotal },
  { label: 'В мешке', value: bagTasks.value.length },
  { label: 'В работе', value: inProgress.value.length },
])

const TROPHY_LIMIT = 20
const trophies = computed(() => store.archive.slice(0, TROPHY_LIMIT))
const trophiesHidden = computed(() => Math.max(0, store.archive.length - TROPHY_LIMIT))

function doneDate(ts) {
  return new Date(ts).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })
}

function togglePicker() {
  avatarPickerOpen.value = !avatarPickerOpen.value
}

function pick(key) {
  setAvatar(key)
  avatarPickerOpen.value = false
  toast(`Теперь ты — ${AVATARS.find((a) => a.key === key).name}. Отличный выбор.`)
}

function startRename() {
  nameDraft.value = user.value.name
  nameError.value = ''
  nameEditing.value = true
}

function saveRename() {
  const err = renameUser(nameDraft.value)
  if (err) {
    nameError.value = err
    return
  }
  nameEditing.value = false
  toast('Имя обновлено. Мешок запомнит.')
}

function askDelete() {
  confirmDelete.value = true
}

function confirmDeleteProfile() {
  deleteProfile()
  emit('close')
}

function cancelDelete() {
  confirmDelete.value = false
}
</script>

<template>
  <div class="profile" role="dialog" aria-modal="true" aria-label="Профиль">
    <header class="profile__top">
      <button type="button" class="btn btn--ghost" @click="emit('close')">
        <svg width="18" height="18" viewBox="0 0 20 20" aria-hidden="true">
          <path d="M12 4l-6 6 6 6" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        Назад
      </button>
      <h2 class="profile__heading">Профиль</h2>
    </header>

    <div class="profile__body">
      <section class="profile__card sticker sticker--tilt-l" aria-label="Личная информация">
        <button
          type="button"
          class="profile__avatar"
          :aria-label="'Сменить аватарку. Сейчас: ' + avatarMeta.name"
          @click="togglePicker"
        >
          <Avatars :name="avatarMeta.key" :size="120" />
          <span class="profile__avatar-hint">сменить</span>
        </button>

        <div class="profile__name-row">
          <template v-if="!nameEditing">
            <h3 class="profile__name">{{ user.name }}</h3>
            <button type="button" class="btn btn--ghost btn--xs btn--profile" @click="startRename">
              Переименовать
            </button>
          </template>
          <form v-else class="profile__rename" @submit.prevent="saveRename">
            <input
              v-model="nameDraft"
              type="text"
              maxlength="30"
              aria-label="Новое имя"
            />
            <button type="submit" class="btn btn--sm">Сохранить</button>
            <button type="button" class="btn btn--ghost btn--sm" @click="nameEditing = false">
              Отмена
            </button>
          </form>
        </div>
        <p v-if="nameError" class="profile__error" role="alert">{{ nameError }}</p>

        <p class="profile__title">{{ title }}</p>
        <p class="profile__caption">
          {{ avatarMeta.name }}: «{{ avatarMeta.caption }}»
        </p>
        <p class="profile__baglevel">
          Мешок: <strong>{{ bagLevel.name }}</strong> — {{ bagLevel.note }}
        </p>

        <div v-if="avatarPickerOpen" class="avatar-grid profile__picker">
          <button
            v-for="a in AVATARS"
            :key="a.key"
            type="button"
            class="avatar-option"
            :class="{ 'avatar-option--on': a.key === user.avatar }"
            @click="pick(a.key)"
          >
            <Avatars :name="a.key" :size="52" />
            <span class="avatar-option__name">{{ a.name }}</span>
          </button>
        </div>
      </section>

      <section class="profile__card sticker sticker--tilt-r" aria-label="Статистика">
        <h3 class="profile__card-title">Статистика лентяя</h3>
        <dl class="profile__stats">
          <div v-for="s in stats" :key="s.label" class="profile__stat">
            <dt>{{ s.label }}</dt>
            <dd>{{ s.value }}</dd>
          </div>
        </dl>
      </section>

      <section class="profile__card sticker sticker--tilt-l" aria-label="Грядка лени">
        <h3 class="profile__card-title">Грядка лени</h3>
        <p class="profile__card-note">Каждое сделанное дело — новый росток. Поливай регулярно.</p>
        <div class="heatmap" role="img" aria-label="Календарь активности за последние 10 недель">
          <div v-for="(week, wi) in heatmap" :key="wi" class="heatmap__week">
            <span
              v-for="day in week"
              :key="day.key"
              class="heatmap__cell"
              :class="{
                'heatmap__cell--0': day.count === 0,
                'heatmap__cell--1': day.count === 1,
                'heatmap__cell--2': day.count >= 2 && day.count <= 3,
                'heatmap__cell--3': day.count >= 4,
                'heatmap__cell--future': day.future,
              }"
              :title="day.title"
            ></span>
          </div>
        </div>
        <p class="profile__card-note">Серия гаснет постепенно: один пропущенный день — минус единица, а не обнуление.</p>
      </section>

      <section class="profile__card sticker sticker--tilt-r" aria-label="Трофейная полка">
        <h3 class="profile__card-title">Трофейная полка</h3>
        <p class="profile__card-note">Всего сделано: {{ store.doneTotal }}</p>
        <ul v-if="trophies.length" class="trophy-list">
          <li v-for="(t, i) in trophies" :key="i">
            <span class="chip chip--done" :class="`chip--${t.difficulty}`">{{ doneDate(t.doneAt) }}</span>
            <span class="trophy-list__title">{{ t.title }}</span>
          </li>
        </ul>
        <p v-else class="profile__card-note">Пока пусто. Сделай первое дело — полка ждёт.</p>
        <p v-if="trophiesHidden" class="profile__card-note">…и ещё {{ trophiesHidden }} дел в архиве.</p>
      </section>

      <section class="profile__danger" aria-label="Опасная зона">
        <template v-if="!confirmDelete">
          <button type="button" class="btn btn--danger" @click="askDelete">
            Удалить профиль
          </button>
        </template>
        <div v-else class="profile__confirm sticker">
          <p>
            Точно удалить профиль? Дела, статистика и аватарка испарятся безвозвратно.
          </p>
          <div class="profile__confirm-row">
            <button type="button" class="btn btn--danger" @click="confirmDeleteProfile">
              Да, удалить всё
            </button>
            <button type="button" class="btn btn--ghost" @click="cancelDelete">
              Оставить как есть
            </button>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>
