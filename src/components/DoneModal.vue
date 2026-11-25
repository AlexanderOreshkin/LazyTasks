<script setup>
import { computed, onMounted, onUnmounted } from 'vue'
import { store, PRAISES, randomQuote, pickRandom, streak, bagTasks, pullBlockReason } from '../store'
import Doodles from './Doodles.vue'

const emit = defineEmits(['close', 'next'])

const praise = pickRandom(PRAISES)
const quote = randomQuote()
const task = computed(() => store.lastDone)

const canNext = computed(() => bagTasks.value.length > 0 && !pullBlockReason())

function onKeydown(e) {
  if (e.key === 'Escape') emit('close')
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onUnmounted(() => window.removeEventListener('keydown', onKeydown))
</script>

<template>
  <div class="overlay" role="dialog" aria-modal="true" aria-label="Дело сделано">
    <div class="overlay__backdrop" @click="emit('close')"></div>

    <div class="overlay__panel done sticker sticker--tilt-l pop-in">
      <Doodles name="star" :size="72" />
      <h2 class="done__title">Дело сделано!</h2>
      <p v-if="task" class="done__task">«{{ task.title }}»</p>
      <p class="done__praise">{{ praise }}</p>

      <blockquote class="done__quote">«{{ quote }}»</blockquote>

      <p class="done__stats">
        Сделано всего: <strong>{{ store.doneTotal }}</strong>
        <template v-if="streak > 0"> · серия: <strong>{{ streak }}</strong> {{ streak === 1 ? 'день' : streak < 5 ? 'дня' : 'дней' }}</template>
      </p>

      <div class="done__actions">
        <button v-if="canNext" type="button" class="btn btn--primary" @click="emit('next')">
          Вытащить следующее дело
        </button>
        <button type="button" class="btn btn--ghost" @click="emit('close')">
          Продолжить
        </button>
      </div>
    </div>
  </div>
</template>
