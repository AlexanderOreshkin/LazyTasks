import { reactive, computed, watch } from 'vue'

const STORAGE_KEY = 'lenivye-dela-v2'
const NAME_MAX = 30

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

export const AVATARS = [
  { key: 'sloth', name: 'Ленивец', caption: 'мешок — мой лучший друг' },
  { key: 'snail', name: 'Улитка', caption: 'зато со своим домом' },
  { key: 'koala', name: 'Коала', caption: 'сплю 20 часов и горжусь' },
  { key: 'capybara', name: 'Капибара', caption: 'всё равно всем доволен' },
  { key: 'panda', name: 'Панда', caption: 'работаю в бамбуковом стиле' },
  { key: 'owl', name: 'Сова', caption: 'делаю дела ночью' },
  { key: 'giraffe', name: 'Жираф', caption: 'вижу дела издалека' },
  { key: 'cheetah', name: 'Гепард', caption: 'самое быстрое дело на районе' },
]

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch (e) {
    /* битые данные — начинаем заново */
  }
  return {
    user: null, // null | { name, avatar, createdAt, mode: 'demo' | 'registered' }
    seeded: false,
    tasks: [],
    doneTotal: 0,
    refusedTotal: 0,
    refused: {},
    // 'YYYY-MM-DD' -> сколько дел сделано в этот день (для серии и тепловой карты)
    activity: {},
    // архив завершённых дел
    archive: [],
  }
}

const saved = load()

export const store = reactive({
  user: saved.user,
  seeded: saved.seeded || false,
  tasks: saved.tasks,
  doneTotal: saved.doneTotal || 0,
  refusedTotal: saved.refusedTotal || 0,
  // taskId -> timestamp, до которого дело исключено из выдачи (кулдаун после отказа)
  refused: saved.refused || {},
  activity: saved.activity || {},
  archive: saved.archive || [],
  ui: {
    tab: 'bag',
    toast: null,
    view: 'main', // main | profile
    registerOpen: false,
    onboardingSeen: false, // скрыли онбординг без выбора (только на сессию)
  },
})

watch(
  () => ({
    user: store.user,
    seeded: store.seeded,
    tasks: store.tasks,
    doneTotal: store.doneTotal,
    refusedTotal: store.refusedTotal,
    refused: store.refused,
    activity: store.activity,
    archive: store.archive,
  }),
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
  delete store.refused[id]
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

function endOfToday() {
  const d = new Date()
  d.setHours(23, 59, 59, 999)
  return d.getTime()
}

/** Дело сейчас в отказе (до конца дня не попадётся в выдаче)? */
export function isRefusedNow(id) {
  const until = store.refused[id]
  if (!until) return false
  if (until < Date.now()) {
    delete store.refused[id]
    return false
  }
  return true
}

/** Доступные дела под текущее настроение (без отказавшихся сегодня). */
export function poolForMood(mood) {
  const bag = bagTasks.value.filter((t) => !isRefusedNow(t.id))
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

const ARCHIVE_LIMIT = 60

export function completeTask(id) {
  const t = store.tasks.find((x) => x.id === id)
  if (!t) return
  store.lastDone = { title: t.title, difficulty: t.difficulty }
  store.doneTotal += 1
  // активность дня — для серии и тепловой карты
  const key = dayKey(new Date())
  store.activity[key] = (store.activity[key] || 0) + 1
  // трофейная полка
  store.archive.unshift({ title: t.title, difficulty: t.difficulty, doneAt: Date.now() })
  if (store.archive.length > ARCHIVE_LIMIT) store.archive.length = ARCHIVE_LIMIT
  removeTask(id)
}

/** Похвала после завершения дела — показывается в окне «Сделано». */
export const PRAISES = [
  'Вот это по-ленивому продуктивно!',
  'Мешок аплодирует завязками.',
  'Ещё одно дело больше не тяжелит.',
  'Лень отступает. Медленно, но отступает.',
  'Ты сделал это, даже не вставая с духа.',
  'Гордо. Лениво. Гордо.',
  'Дело сдано в архив побед.',
  'Серия растёт, а мешок легчает.',
]

function dayKey(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

/**
 * Разбить дело на шаги: исходное исчезает, а шаги сразу попадают в работу.
 * Это единственный случай, когда дела в работе могут стать больше двух.
 */
export function splitTask(id, steps) {
  const t = store.tasks.find((x) => x.id === id)
  if (!t) return 'Дело не найдено.'
  const clean = steps.map((s) => s.trim()).filter(Boolean)
  if (clean.length < 2) return 'Нужно минимум два шага — иначе это не разбивка.'
  const subDifficulty = t.difficulty === 'hard' ? 'medium' : 'easy'
  removeTask(id)
  clean.forEach((s) => {
    const sub = addTask(`${t.title}: ${s}`, subDifficulty)
    sub.status = 'active'
    sub.takenAt = Date.now()
  })
  return null
}

// ─── Серия дней и тепловая карта ─────────────────────────────

/**
 * Серия с «остыванием»: считаем подряд идущие активные дни, заканчивающиеся
 * сегодня или вчера, и вычитаем по единице за каждый пропущенный день —
 * огонёк гаснет постепенно, а не сгорает в ноль.
 */
export const streak = computed(() => {
  const act = store.activity
  if (!Object.keys(act).length) return 0
  const day = 86400000
  const today = new Date()
  // последний день с активностью
  let last = null
  for (let i = 0; i < 366; i++) {
    const d = new Date(today.getTime() - i * day)
    if (act[dayKey(d)]) {
      last = d
      break
    }
  }
  if (!last) return 0
  const missed = Math.round((today.setHours(0, 0, 0, 0) - new Date(last).setHours(0, 0, 0, 0)) / day)
  let consecutive = 0
  for (let i = 0; i < 366; i++) {
    const d = new Date(last.getTime() - i * day)
    if (act[dayKey(d)]) consecutive++
    else break
  }
  return Math.max(0, consecutive - missed)
})

/** Тепловая карта: последние 10 недель, колонки — недели, строки — дни. */
export const heatmap = computed(() => {
  const act = store.activity
  const day = 86400000
  const today = new Date()
  const weeks = []
  // неделя начинается с понедельника
  const mondayOffset = (today.getDay() + 6) % 7
  const lastMonday = new Date(today.getTime() - mondayOffset * day)
  lastMonday.setHours(0, 0, 0, 0)
  for (let w = 9; w >= 0; w--) {
    const weekStart = new Date(lastMonday.getTime() - w * 7 * day)
    const days = []
    for (let d = 0; d < 7; d++) {
      const date = new Date(weekStart.getTime() + d * day)
      const key = dayKey(date)
      const isFuture = date > today
      days.push({
        key,
        count: isFuture ? 0 : act[key] || 0,
        future: isFuture,
        title: isFuture
          ? ''
          : `${key}: сделано дел — ${act[key] || 0}`,
      })
    }
    weeks.push(days)
  }
  return weeks
})

// ─── Уровни мешка ──────────────────────────────────────────

export const BAG_LEVELS = [
  { min: 0, name: 'Дремлющий мешок', note: 'ещё прячется за завязкой' },
  { min: 10, name: 'Бодрый мешок', note: 'начал просыпаться' },
  { min: 25, name: 'Опытный мешок', note: 'знает толк в делах' },
  { min: 50, name: 'Золотой мешок', note: 'легенда среди мешков' },
]

export const bagLevel = computed(() => {
  let lvl = BAG_LEVELS[0]
  for (const l of BAG_LEVELS) {
    if (store.doneTotal >= l.min) lvl = l
  }
  return lvl
})

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

/** Отказ от дела: одноразовый — до конца дня дело не попадётся в выдаче снова. */
export function refuseTask(id) {
  store.refused[id] = endOfToday()
  store.refusedTotal += 1
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

// ─── Пользователь: регистрация, профиль, удаление ──────────

export function validateName(name) {
  const n = name.trim()
  if (!n) return 'Представься — мешку важно знать, кто тянет дела.'
  if (n.length > NAME_MAX) return `Имя длиннее ${NAME_MAX} символов мешок не запомнит.`
  return null
}

/**
 * Регистрация профиля.
 * migrate=false — начать с чистого мешка (демо-дела выбрасываются).
 */
export function registerUser(name, avatarKey, migrate = true) {
  const err = validateName(name)
  if (err) return err
  if (!migrate) {
    store.tasks.splice(0, store.tasks.length)
    store.doneTotal = 0
    store.refusedTotal = 0
    store.refused = {}
    store.activity = {}
    store.archive.splice(0, store.archive.length)
  }
  store.user = {
    name: name.trim(),
    avatar: AVATARS.some((a) => a.key === avatarKey) ? avatarKey : AVATARS[0].key,
    createdAt: Date.now(),
    mode: 'registered',
  }
  store.ui.registerOpen = false
  return null
}

const SEED_TASKS = [
  ['Ответить на старое письмо', 'easy'],
  ['Почистить клавиатуру', 'easy'],
  ['Разобрать ящик с проводами', 'medium'],
  ['Выставить на продажу ненужные вещи', 'medium'],
  ['Сделать резервную копию фото', 'hard'],
  ['Записаться к стоматологу', 'hard'],
]

export function switchToDemo() {
  store.user = { mode: 'demo' }
  store.ui.onboardingSeen = true
  seedDemoTasks()
}

/**
 * Демо-наполнение: шесть стандартных примеров всегда возвращаются в мешок,
 * если их удалили или выполнили. Выполняется при загрузке приложения,
 * чтобы перезагрузка страницы давала свежий демо-набор.
 */
export function seedDemoTasks() {
  SEED_TASKS.forEach(([title, d]) => {
    if (!store.tasks.some((t) => t.title === title)) {
      addTask(title, d)
    }
  })
  store.seeded = true
}

export function renameUser(name) {
  const err = validateName(name)
  if (err) return err
  store.user.name = name.trim()
  return null
}

export function setAvatar(key) {
  if (!AVATARS.some((a) => a.key === key)) return
  store.user.avatar = key
}

/** Удаление профиля: стирает всё и возвращает приложение в состояние первого визита. */
export function deleteProfile() {
  store.user = null
  store.seeded = false
  store.tasks.splice(0, store.tasks.length)
  store.doneTotal = 0
  store.refusedTotal = 0
  store.refused = {}
  store.activity = {}
  store.archive.splice(0, store.archive.length)
  store.ui.view = 'main'
  store.ui.tab = 'bag'
  store.ui.registerOpen = false
  store.ui.onboardingSeen = false
}

export const isRegistered = computed(() => store.user?.mode === 'registered')

export const daysWithUs = computed(() => {
  if (!store.user?.createdAt) return 0
  return Math.max(1, Math.floor((Date.now() - store.user.createdAt) / 86400000))
})

/** Шутливое звание по числу сделанных дел. */
export function lazyTitle(done) {
  if (done >= 60) return 'Повелитель мешка'
  if (done >= 30) return 'Мастер вытаскивания'
  if (done >= 15) return 'Завсегдатай мешка'
  if (done >= 5) return 'Бодрящий любитель'
  return 'Сонный стажёр'
}
