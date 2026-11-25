<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { AVATARS, registerUser } from '../store'
import Avatars from './Avatars.vue'
import Doodles from './Doodles.vue'

const props = defineProps({
  // есть ли дела, ради которых стоит спросить про перенос
  hasTasks: { type: Boolean, default: false },
})
const emit = defineEmits(['close', 'registered'])

const name = ref('')
const avatar = ref(AVATARS[0].key)
const migrate = ref(true)
const error = ref('')

const activeAvatar = (key) => avatar.value === key

function pickAvatar(key) {
  avatar.value = key
}

function submit() {
  const err = registerUser(name.value, avatar.value, migrate.value)
  if (err) {
    error.value = err
    return
  }
  error.value = ''
  emit('registered', name.value.trim())
}

function onKeydown(e) {
  if (e.key === 'Escape') emit('close')
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onUnmounted(() => window.removeEventListener('keydown', onKeydown))
</script>

<template>
  <div class="overlay" role="dialog" aria-modal="true" aria-label="Регистрация профиля">
    <div class="overlay__backdrop" @click="emit('close')"></div>

    <div class="overlay__panel register sticker pop-in">
      <Doodles name="bag" :size="64" />
      <h2>Заводим профиль</h2>
      <p class="register__sub">Мешку важно знать, кто тянет дела. Имя — и всё.</p>

      <label class="register__label" for="reg-name">Твоё имя</label>
      <input
        id="reg-name"
        v-model="name"
        class="register__input"
        type="text"
        maxlength="30"
      />
      <p v-if="error" class="register__error" role="alert">{{ error }}</p>

      <fieldset class="register__avatars">
        <legend class="register__legend">Выбери духовное животное</legend>
        <div class="avatar-grid">
          <button
            v-for="a in AVATARS"
            :key="a.key"
            type="button"
            class="avatar-option"
            :class="{ 'avatar-option--on': activeAvatar(a.key) }"
            :aria-pressed="activeAvatar(a.key)"
            @click="pickAvatar(a.key)"
          >
            <Avatars :name="a.key" :size="56" />
            <span class="avatar-option__name">{{ a.name }}</span>
          </button>
        </div>
      </fieldset>

      <fieldset v-if="hasTasks" class="register__migrate">
        <legend class="register__legend">А что с делами, которые уже в мешке?</legend>
        <label class="radio-row">
          <input v-model="migrate" type="radio" :value="true" />
          <span>Перенести в профиль — мешок останется как есть</span>
        </label>
        <label class="radio-row">
          <input v-model="migrate" type="radio" :value="false" />
          <span>Начать с чистого мешка</span>
        </label>
      </fieldset>

      <div class="register__actions">
        <button type="button" class="btn btn--primary" @click="submit">
          Создать профиль
        </button>
        <button type="button" class="btn btn--ghost" @click="emit('close')">Отмена</button>
      </div>
    </div>
  </div>
</template>
