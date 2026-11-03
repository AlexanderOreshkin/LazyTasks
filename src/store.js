import { reactive, computed, watch } from 'vue'

const STORAGE_KEY = 'lenivye-dela-v1'

export const DIFFICULTY = {
  easy: {
    key: 'easy',
    label: 'Лёгкое',
    hint: '5–15 минут. Не откладывается: сначала доделай его.',
    postpone: false,
    weight: 1,
  },
  medium: {
    key: 'medium',
    label: 'Среднее',
    hint: 'до пары часов. Можно перенести с комментарием.',
    postpone: true,
    weight: 2,
  },
  hard: {
    key: 'hard',
    label: 'Сложное',
    hint: 'большое дело. Можно перенести с комментарием.',
    postpone: true,
    weight: 3,
  },
}

export const MAX_ACTIVE = 2

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch (e) {
    /* битые данные — начинаем заново */
  }
  return { tasks: [], doneTotal: 0 }
}

const saved = load()

export const store = reactive({
  tasks: saved.tasks,
  doneTotal: saved.doneTotal || 0,
  ui: {
    tab: 'bag',
    toast: null,
  },
})

watch(
  () => ({ tasks: store.tasks, doneTotal: store.doneTotal }),
  (v) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(v))
    } catch (e) {
      /* хранилище недоступно — приложение продолжит работать в памяти */
    }
  },
  { deep: true }
)

let idSeq = Date.now()

export function addTask(title, difficulty) {
  const t = {
    id: 't' + idSeq++,
    title: title.trim(),
    difficulty,
    status: 'bag',
    comment: '',
    takenAt: null,
    doneAt: null,
  }
  store.tasks.push(t)
  return t
}

export function removeTask(id) {
  const i = store.tasks.findIndex((t) => t.id === id)
  if (i >= 0) store.tasks.splice(i, 1)
}

export const inProgress = computed(() =>
  store.tasks.filter((t) => t.status === 'active' || t.status === 'paused')
)

export const bagTasks = computed(() => store.tasks.filter((t) => t.status === 'bag'))

function activeOnly() {
  return store.tasks.filter((t) => t.status === 'active')
}

/** Почему нельзя вытащить новое дело — null, если можно. */
export function pullBlockReason() {
  const prog = inProgress.value
  if (prog.length >= MAX_ACTIVE) {
    return 'У тебя уже два дела в работе. Сначала закончи или верни одно из них.'
  }
  const active = activeOnly()
  if (active.length === 1 && active[0].difficulty === 'easy') {
    return `«${active[0].title}» — лёгкое дело, оно не откладывается. Закончи его или верни в мешок.`
  }
  return null
}

/** Доступные дела под текущее настроение. */
export function poolForMood(mood) {
  const bag = bagTasks.value
  if (mood === 'light') return bag.filter((t) => t.difficulty === 'easy')
  return bag.filter((t) => t.difficulty === 'medium' || t.difficulty === 'hard')
}

export function pickRandom(list) {
  if (!list.length) return null
  return list[Math.floor(Math.random() * list.length)]
}

export function takeTask(id) {
  const t = store.tasks.find((x) => x.id === id)
  if (!t) return
  t.status = 'active'
  t.takenAt = Date.now()
  t.comment = ''
}

export function completeTask(id) {
  const t = store.tasks.find((x) => x.id === id)
  if (!t) return
  store.doneTotal += 1
  removeTask(id)
}

export function returnToBag(id) {
  const t = store.tasks.find((x) => x.id === id)
  if (!t) return
  t.status = 'bag'
  t.takenAt = null
  t.comment = ''
}

export function postponeTask(id, comment) {
  const t = store.tasks.find((x) => x.id === id)
  if (!t) return
  if (!DIFFICULTY[t.difficulty].postpone) return
  t.status = 'bag'
  t.takenAt = null
  t.comment = comment.trim()
}

let toastTimer = null
export function toast(msg) {
  store.ui.toast = msg
  clearTimeout(toastTimer)
  toastTimer = setTimeout(() => (store.ui.toast = null), 3200)
}

export const QUOTES = [
  'Лень — это просто дело, которое ещё не началось.',
  'Путь в тысячу дел начинается с одного вытащенного.',
  'Сделано криво — всё равно сделано. Сделано лучше, чем идеально задумано.',
  'Большое дело — это много маленьких, которые не успели испугаться.',
  'Не хочется — значит, просто начни с самого ленивого шага.',
  'Мешок легчает от одного взятого дела.',
  'Сегодня можно сделать чуть-чуть. Главное — чуть-чуть.',
  'Откладывать — тоже навык. Отложи сомнения.',
  'Ты не обязан хотеть. Ты обязан только вытащить.',
  'Чем страшнее дело, тем короче первый шаг.',
  'Перфекционизм — главный лентяй. Не дай ему выиграть.',
  'Одно закрытое дело прибавляет больше спокойствия, чем десять красивых планов.',
  'Ленивый прогресс всё ещё прогресс.',
  'Сделал — забыл. Не сделал — таскаешь. Выбери лёгкое.',
  'Сонливый мешок верит в тебя. Даже если ты не веришь.',
]

export function randomQuote() {
  return QUOTES[Math.floor(Math.random() * QUOTES.length)]
}
