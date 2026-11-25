<script setup>
import { onMounted, onUnmounted } from 'vue'
import Doodles from './Doodles.vue'

const emit = defineEmits(['register', 'demo'])

const FEATURES = [
  { icon: 'feather', text: 'Брось в мешок всё, что откладываешь, и забудь. Мешок всё помнит за тебя.' },
  { icon: 'bag', text: 'Вытаскивай случайное дело — мешок спросит, на что ты сегодня настроен.' },
  { icon: 'battery', text: 'Одновременно — максимум два дела. Лёгкое не откладывается, серьёзное можно перенести с комментарием.' },
  { icon: 'squiggle', text: 'Отказаться можно один раз: дело уйдёт в кулдаун до завтра, чтобы не спорить со случайностью.' },
]

function onKeydown(e) {
  // Esc просто скрывает окно на сессию — выбор всегда остаётся за пользователем
  if (e.key === 'Escape') emit('close')
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onUnmounted(() => window.removeEventListener('keydown', onKeydown))
</script>

<template>
  <div class="overlay" role="dialog" aria-modal="true" aria-label="Добро пожаловать в Ленивые дела">
    <div class="overlay__backdrop"></div>

    <div class="overlay__panel onboarding sticker pop-in">
      <Doodles name="bag" :size="84" />
      <h2>Ленивые дела</h2>
      <p class="onboarding__lead">
        Приложение для тех, кто откладывает. Собери все дела в мешок —
        и пусть случайность решает, с чего начать. Тебе останется только сделать.
      </p>

      <ul class="onboarding__features">
        <li v-for="f in FEATURES" :key="f.icon">
          <Doodles :name="f.icon" :size="40" />
          <span>{{ f.text }}</span>
        </li>
      </ul>

      <div class="onboarding__actions">
        <button type="button" class="btn btn--primary" @click="emit('register')">
          Завести профиль
        </button>
        <button type="button" class="btn" @click="emit('demo')">
          Просто посмотреть
        </button>
      </div>
      <p class="onboarding__note">
        Профилю нужно только имя. Всё хранится в твоём браузере — мешок никому ничего не сообщает.
      </p>
      <button type="button" class="btn btn--ghost onboarding__later" @click="emit('close')">
        Закрыть и подумать
      </button>
    </div>
  </div>
</template>
