<script setup>
import { onMounted, onUnmounted } from 'vue'
import Doodles from './Doodles.vue'

const emit = defineEmits(['close'])

const TECHNIQUES = [
  {
    icon: 'feather',
    title: 'Правило двух минут',
    text: 'Если дело занимает меньше двух минут — сделай сразу, не бросая в мешок. Мешок уважает лёгкие жертвы.',
  },
  {
    icon: 'battery',
    title: 'Правило пяти минут',
    text: 'Договорись с собой поработать всего пять минут. Самое тяжёлое — начать, а дальше лень обычно сдаётся.',
  },
  {
    icon: 'coffee',
    title: 'Помидор',
    text: '25 минут работы — 5 минут отдыха. После четырёх «помидоров» — большой перерыв. Любимый приём сов.',
  },
  {
    icon: 'squiggle',
    title: 'Сделай криво',
    text: 'Разреши себе плохой результат. Черновик лучше идеального плана в голове — его хотя бы можно править.',
  },
  {
    icon: 'bag',
    title: 'Разбей на шаги',
    text: 'Страшное дело — это три-четыре вполне сносных. Разбивка прячется в карточке дела в работе.',
  },
  {
    icon: 'star',
    title: 'Мини-награда',
    text: 'После дела — чай, серия или пять минут ленты без чувства вины. Мешок одобряет и даже немного завидует.',
  },
]

function onKeydown(e) {
  if (e.key === 'Escape') emit('close')
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onUnmounted(() => window.removeEventListener('keydown', onKeydown))
</script>

<template>
  <div class="overlay" role="dialog" aria-modal="true" aria-label="Приёмы против лени">
    <div class="overlay__backdrop" @click="emit('close')"></div>

    <div class="overlay__panel techniques sticker pop-in">
      <Doodles name="zzz" :size="64" />
      <h2>Приёмы против лени</h2>
      <p class="techniques__sub">Проверенные способы заставить себя начать. Мешок использует их все.</p>

      <ul class="techniques__list">
        <li v-for="t in TECHNIQUES" :key="t.title" class="techniques__item">
          <Doodles :name="t.icon" :size="40" />
          <div>
            <h3>{{ t.title }}</h3>
            <p>{{ t.text }}</p>
          </div>
        </li>
      </ul>

      <button type="button" class="btn btn--ghost" @click="emit('close')">Закрыть</button>
    </div>
  </div>
</template>
