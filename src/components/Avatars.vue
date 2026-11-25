<script setup>
// Шутливые аватарки-животные в едином стиле дудлов приложения.
defineProps({
  name: { type: String, required: true },
  size: { type: [Number, String], default: 96 },
})
</script>

<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 120 120"
    fill="none"
    aria-hidden="true"
    class="avatar-doodle"
  >
    <!-- Ленивец -->
    <template v-if="name === 'sloth'">
      <circle cx="34" cy="34" r="12" fill="#b08d63" stroke="#1e1e1e" stroke-width="4" />
      <circle cx="86" cy="34" r="12" fill="#b08d63" stroke="#1e1e1e" stroke-width="4" />
      <circle cx="60" cy="62" r="38" fill="#e8d9c0" stroke="#1e1e1e" stroke-width="4" />
      <ellipse cx="43" cy="56" rx="13" ry="15" fill="#8a6b45" />
      <ellipse cx="77" cy="56" rx="13" ry="15" fill="#8a6b45" />
      <path d="M38 56c3 4 8 4 11 0M71 56c3 4 8 4 11 0" stroke="#fffdf4" stroke-width="3.5" stroke-linecap="round" />
      <ellipse cx="60" cy="80" rx="10" ry="8" fill="#fffdf4" stroke="#1e1e1e" stroke-width="4" />
      <circle cx="60" cy="79" r="3.5" fill="#1e1e1e" />
    </template>

    <!-- Улитка -->
    <template v-else-if="name === 'snail'">
      <circle cx="46" cy="62" r="30" fill="#f3a53c" stroke="#1e1e1e" stroke-width="4" />
      <path d="M46 62m0-16a16 16 0 1 1-14 24" stroke="#1e1e1e" stroke-width="4" stroke-linecap="round" />
      <path d="M70 84c14-2 22-10 22-22" stroke="#1e1e1e" stroke-width="4" stroke-linecap="round" />
      <path d="M84 62c0-12 4-20 10-24M92 70c2-10 8-16 14-18" stroke="#1e1e1e" stroke-width="4" stroke-linecap="round" />
      <circle cx="94" cy="38" r="4" fill="#1e1e1e" />
      <circle cx="106" cy="52" r="4" fill="#1e1e1e" />
      <path d="M88 88c4 3 9 3 13 0" stroke="#1e1e1e" stroke-width="3.5" stroke-linecap="round" />
    </template>

    <!-- Коала -->
    <template v-else-if="name === 'koala'">
      <circle cx="28" cy="40" r="16" fill="#b9c0c4" stroke="#1e1e1e" stroke-width="4" />
      <circle cx="92" cy="40" r="16" fill="#b9c0c4" stroke="#1e1e1e" stroke-width="4" />
      <circle cx="60" cy="64" r="38" fill="#d6dbde" stroke="#1e1e1e" stroke-width="4" />
      <circle cx="45" cy="58" r="5" fill="#1e1e1e" />
      <circle cx="75" cy="58" r="5" fill="#1e1e1e" />
      <ellipse cx="60" cy="74" rx="10" ry="13" fill="#1e1e1e" />
      <path d="M52 94c5 4 11 4 16 0" stroke="#1e1e1e" stroke-width="3.5" stroke-linecap="round" />
    </template>

    <!-- Капибара -->
    <template v-else-if="name === 'capybara'">
      <rect x="18" y="40" width="84" height="56" rx="26" fill="#c08552" stroke="#1e1e1e" stroke-width="4" />
      <circle cx="38" cy="36" r="9" fill="#c08552" stroke="#1e1e1e" stroke-width="4" />
      <circle cx="82" cy="36" r="9" fill="#c08552" stroke="#1e1e1e" stroke-width="4" />
      <circle cx="44" cy="64" r="4.5" fill="#1e1e1e" />
      <circle cx="76" cy="64" r="4.5" fill="#1e1e1e" />
      <ellipse cx="60" cy="82" rx="14" ry="9" fill="#e0b58a" stroke="#1e1e1e" stroke-width="3.5" />
      <circle cx="55" cy="80" r="2.5" fill="#1e1e1e" />
      <circle cx="65" cy="80" r="2.5" fill="#1e1e1e" />
      <path d="M56 89c3 2 6 2 9 0" stroke="#1e1e1e" stroke-width="3" stroke-linecap="round" />
    </template>

    <!-- Панда -->
    <template v-else-if="name === 'panda'">
      <circle cx="32" cy="34" r="14" fill="#1e1e1e" />
      <circle cx="88" cy="34" r="14" fill="#1e1e1e" />
      <circle cx="60" cy="64" r="38" fill="#fffdf4" stroke="#1e1e1e" stroke-width="4" />
      <ellipse cx="44" cy="58" rx="11" ry="14" fill="#1e1e1e" transform="rotate(-18 44 58)" />
      <ellipse cx="76" cy="58" rx="11" ry="14" fill="#1e1e1e" transform="rotate(18 76 58)" />
      <circle cx="46" cy="56" r="3.5" fill="#fffdf4" />
      <circle cx="74" cy="56" r="3.5" fill="#fffdf4" />
      <ellipse cx="60" cy="78" rx="8" ry="6" fill="#1e1e1e" />
      <path d="M54 90c4 3 8 3 12 0" stroke="#1e1e1e" stroke-width="3.5" stroke-linecap="round" />
    </template>

    <!-- Сова -->
    <template v-else-if="name === 'owl'">
      <path d="M26 34l14 8-16 6ZM94 34l-14 8 16 6Z" fill="#8a6b45" stroke="#1e1e1e" stroke-width="4" stroke-linejoin="round" />
      <circle cx="60" cy="64" r="38" fill="#a9825a" stroke="#1e1e1e" stroke-width="4" />
      <circle cx="45" cy="58" r="14" fill="#fffdf4" stroke="#1e1e1e" stroke-width="3.5" />
      <circle cx="75" cy="58" r="14" fill="#fffdf4" stroke="#1e1e1e" stroke-width="3.5" />
      <circle cx="45" cy="58" r="5" fill="#1e1e1e" />
      <circle cx="75" cy="58" r="5" fill="#1e1e1e" />
      <path d="M60 68l-7 10h14l-7-10Z" fill="#f3a53c" stroke="#1e1e1e" stroke-width="3.5" stroke-linejoin="round" />
      <path d="M48 92c8 5 16 5 24 0" stroke="#1e1e1e" stroke-width="3.5" stroke-linecap="round" />
    </template>

    <!-- Жираф -->
    <template v-else-if="name === 'giraffe'">
      <path d="M50 30v-8M70 30v-8" stroke="#1e1e1e" stroke-width="5" stroke-linecap="round" />
      <circle cx="50" cy="18" r="6" fill="#e8c26a" stroke="#1e1e1e" stroke-width="3.5" />
      <circle cx="70" cy="18" r="6" fill="#e8c26a" stroke="#1e1e1e" stroke-width="3.5" />
      <circle cx="60" cy="66" r="36" fill="#f3d489" stroke="#1e1e1e" stroke-width="4" />
      <circle cx="38" cy="52" r="5" fill="#c08552" />
      <circle cx="84" cy="50" r="6" fill="#c08552" />
      <circle cx="60" cy="42" r="4.5" fill="#c08552" />
      <circle cx="46" cy="62" r="4" fill="#1e1e1e" />
      <circle cx="74" cy="62" r="4" fill="#1e1e1e" />
      <ellipse cx="60" cy="84" rx="18" ry="12" fill="#fff3d6" stroke="#1e1e1e" stroke-width="3.5" />
      <circle cx="53" cy="83" r="2.5" fill="#1e1e1e" />
      <circle cx="67" cy="83" r="2.5" fill="#1e1e1e" />
      <path d="M55 91c3 2 7 2 10 0" stroke="#1e1e1e" stroke-width="3" stroke-linecap="round" />
    </template>

    <!-- Гепард -->
    <template v-else-if="name === 'cheetah'">
      <circle cx="34" cy="32" r="11" fill="#f3b53c" stroke="#1e1e1e" stroke-width="4" />
      <circle cx="86" cy="32" r="11" fill="#f3b53c" stroke="#1e1e1e" stroke-width="4" />
      <circle cx="60" cy="64" r="38" fill="#f7c95c" stroke="#1e1e1e" stroke-width="4" />
      <circle cx="34" cy="30" r="4" fill="#e8a03c" />
      <circle cx="86" cy="30" r="4" fill="#e8a03c" />
      <circle cx="44" cy="46" r="3" fill="#1e1e1e" />
      <circle cx="60" cy="42" r="3" fill="#1e1e1e" />
      <circle cx="76" cy="46" r="3" fill="#1e1e1e" />
      <circle cx="45" cy="60" r="5" fill="#1e1e1e" />
      <circle cx="75" cy="60" r="5" fill="#1e1e1e" />
      <path d="M39 55l-6-6M81 55l6-6" stroke="#1e1e1e" stroke-width="3.5" stroke-linecap="round" />
      <ellipse cx="60" cy="80" rx="11" ry="8" fill="#fff3d6" stroke="#1e1e1e" stroke-width="3.5" />
      <circle cx="60" cy="77" r="3.5" fill="#1e1e1e" />
      <path d="M54 88c4 3 8 3 12 0" stroke="#1e1e1e" stroke-width="3" stroke-linecap="round" />
    </template>
  </svg>
</template>
