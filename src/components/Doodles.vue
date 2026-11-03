<script setup>
// Рисованные дудлы-стикеры в едином стиле: кремовая заливка,
// жирная «ручная» обводка, слегка неровные линии.
defineProps({
  name: { type: String, required: true },
  size: { type: [Number, String], default: 120 },
})
</script>

<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 120 120"
    fill="none"
    aria-hidden="true"
    class="doodle"
  >
    <!-- Сонный мешок -->
    <template v-if="name === 'bag'">
      <path
        d="M33 44c-4 14-9 24-9 38 0 16 15 26 36 26s36-10 36-26c0-14-5-24-9-38"
        fill="#fffdf4"
        stroke="#1e1e1e"
        stroke-width="4"
        stroke-linecap="round"
      />
      <path
        d="M28 46c10-8 54-8 64 0 2 2 1 6-2 7-14 5-46 5-60 0-3-1-4-5-2-7Z"
        fill="#f36e20"
        stroke="#1e1e1e"
        stroke-width="4"
        stroke-linejoin="round"
      />
      <path d="M42 68c3 3 7 3 10 0" stroke="#1e1e1e" stroke-width="4" stroke-linecap="round" />
      <path d="M68 68c3 3 7 3 10 0" stroke="#1e1e1e" stroke-width="4" stroke-linecap="round" />
      <path d="M56 82c3 3 7 3 9 0" stroke="#1e1e1e" stroke-width="4" stroke-linecap="round" />
      <circle cx="38" cy="76" r="4" fill="#f36e20" opacity="0.45" />
      <circle cx="84" cy="76" r="4" fill="#f36e20" opacity="0.45" />
    </template>

    <!-- Звезда -->
    <template v-else-if="name === 'star'">
      <path
        d="M60 14c4 18 12 26 30 30-18 4-26 12-30 30-4-18-12-26-30-30 18-4 26-12 30-30Z"
        fill="#ffd98e"
        stroke="#1e1e1e"
        stroke-width="4"
        stroke-linejoin="round"
      />
    </template>

    <!-- Zzz -->
    <template v-else-if="name === 'zzz'">
      <path
        d="M22 30h22l-22 24h22"
        stroke="#1e1e1e"
        stroke-width="5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M62 58h28l-28 30h28"
        stroke="#1e1e1e"
        stroke-width="6"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </template>

    <!-- Чашка кофе -->
    <template v-else-if="name === 'coffee'">
      <path
        d="M26 46h56v22c0 14-12 24-28 24s-28-10-28-24V46Z"
        fill="#fffdf4"
        stroke="#1e1e1e"
        stroke-width="4"
        stroke-linejoin="round"
      />
      <path
        d="M82 50h8c7 0 11 5 11 11s-4 11-11 11h-9"
        stroke="#1e1e1e"
        stroke-width="4"
        stroke-linecap="round"
      />
      <path d="M42 30c-3 5 3 7 0 12M58 30c-3 5 3 7 0 12" stroke="#1e1e1e" stroke-width="4" stroke-linecap="round" />
    </template>

    <!-- Вьющаяся стрелка -->
    <template v-else-if="name === 'squiggle'">
      <path
        d="M14 78c14-30 34 18 50-14 10-19 28-6 40-22"
        stroke="#1e1e1e"
        stroke-width="4"
        stroke-linecap="round"
      />
      <path
        d="M92 34l14 6-10 11"
        stroke="#1e1e1e"
        stroke-width="4"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </template>

    <!-- Тучка -->
    <template v-else-if="name === 'cloud'">
      <path
        d="M34 78c-11 0-18-8-18-16 0-9 8-16 17-15 4-9 14-14 24-11 9 2 14 9 15 16 9-1 16 5 16 13 0 8-7 13-15 13H34Z"
        fill="#fffdf4"
        stroke="#1e1e1e"
        stroke-width="4"
        stroke-linejoin="round"
      />
    </template>

    <!-- Батарейка наполовину (среднее дело) -->
    <template v-else-if="name === 'battery'">
      <rect x="20" y="42" width="66" height="36" rx="8" fill="#fffdf4" stroke="#1e1e1e" stroke-width="4" />
      <rect x="28" y="50" width="24" height="20" rx="3" fill="#f36e20" />
      <path d="M92 52v16" stroke="#1e1e1e" stroke-width="6" stroke-linecap="round" />
    </template>

    <!-- Пёрышко (лёгкое дело) -->
    <template v-else-if="name === 'feather'">
      <path
        d="M28 92C30 56 52 28 92 24c-4 40-30 62-64 68Z"
        fill="#83a17c"
        stroke="#1e1e1e"
        stroke-width="4"
        stroke-linejoin="round"
      />
      <path d="M36 84C50 64 66 48 88 30" stroke="#1e1e1e" stroke-width="4" stroke-linecap="round" />
    </template>

    <!-- Гора (сложное дело) -->
    <template v-else-if="name === 'mountain'">
      <path
        d="M14 96 46 40l14 24 12-16 34 48H14Z"
        fill="#b3400f"
        stroke="#1e1e1e"
        stroke-width="4"
        stroke-linejoin="round"
      />
      <path d="M40 52l6 12 8-10" stroke="#fffdf4" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
    </template>
  </svg>
</template>
