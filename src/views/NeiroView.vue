<template>
  <section class="chat-section">
    <div class="chat-wrapper">
      <div class="chat-header">
        <h2>Чат с нейросетью</h2>
      </div>
      <div class="chat-history" ref="chatHistory">
        <div v-for="(msg, idx) in messages" :key="idx" :class="['chat-message', msg.role]">
          <div class="message-content">
            <span v-if="msg.role === 'user'" class="user-label">Вы:</span>
            <span v-if="msg.role === 'ai'" class="ai-label">Нейросеть:</span>
            <span v-html="formatBoldAndBreaks(msg.text)"></span>
            <!-- Кнопка только если есть points и маршрут еще не добавлен -->
            <button
              v-if="msg.role === 'ai' && msg.points && !msg.added"
              class="add-trip-btn"
              @click="openAddTripModal(msg)"
            >
              Добавить маршрут
            </button>
          </div>
        </div>
        <div v-if="isLoading" class="chat-message ai">
          <div class="message-content">
            <span class="ai-label">Нейросеть:</span>
            <span class="typing-indicator">
              <span class="dot"></span><span class="dot"></span><span class="dot"></span>
            </span>
          </div>
        </div>
      </div>
      <form class="chat-input" @submit.prevent="sendMessage">
        <input
          v-model="input"
          type="text"
          placeholder="Введите сообщение..."
          :disabled="isLoading"
          @keydown.enter.exact.prevent="sendMessage"
        />
        <button :disabled="!input.trim() || isLoading">Отправить</button>
        <button
          type="button"
          class="route-btn"
          :disabled="!input.trim() || isLoading"
          @click="generateRoute"
        >
          Сформировать маршрут
        </button>
      </form>
      <div class="clear-btn__wrapper">
        <button class="clear-chat-btn" @click="clearChat">Очистить чат</button>
      </div>
    </div>
  </section>
  <template v-if="showAddTripModal">
    <div class="popup-backdrop" @click.self="closeAddTripModal">
      <div class="popup">
        <h3>Добавить маршрут</h3>
        <input
          v-model="tripForm.destination"
          placeholder="Название маршрута (например, Южный берег Крыма)"
        />
        <input v-model="tripForm.startDate" type="date" placeholder="Дата начала" />
        <input v-model="tripForm.endDate" type="date" placeholder="Дата окончания" />
        <textarea v-model="tripForm.notes" placeholder="Заметки"></textarea>
        <button @click="addTrip" class="upload-btn">Сохранить</button>
        <button @click="closeAddTripModal" class="cancel-btn">Отмена</button>
      </div>
    </div>
  </template>
</template>

<script setup>
import { ref, nextTick, onMounted, watch } from 'vue'
import { useUserStore } from '@/stores/user'

const input = ref('')
const messages = ref([])
const isLoading = ref(false)
const chatHistory = ref(null)
const userStore = useUserStore()

// Загружаем историю чата при инициализации
onMounted(() => {
  const saved = localStorage.getItem('neiro_chat_history')
  if (saved) {
    messages.value = JSON.parse(saved)
  }
})

// Сохраняем историю чата при каждом изменении
watch(
  messages,
  (val) => {
    localStorage.setItem('neiro_chat_history', JSON.stringify(val))
  },
  { deep: true },
)

function scrollToBottom() {
  nextTick(() => {
    if (chatHistory.value) {
      chatHistory.value.scrollTop = chatHistory.value.scrollHeight
    }
  })
}

async function sendMessage() {
  if (!input.value.trim()) return
  const userMsg = { role: 'user', text: input.value }
  messages.value.push(userMsg)
  const userText = input.value
  input.value = ''
  isLoading.value = true
  scrollToBottom()

  try {
    const response = await fetch('https://tourgid-production.up.railway.app/api/ask', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${userStore.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ question: userText }),
    })
    if (!response.ok) throw new Error('Ошибка API')
    const data = await response.json()
    await typeWriter(data.answer)
  } catch (e) {
    console.error(e) // <-- исправлено
    messages.value.push({ role: 'ai', text: 'Ошибка получения ответа.' })
  } finally {
    isLoading.value = false
    scrollToBottom()
  }
}

async function generateRoute() {
  if (!input.value.trim()) return
  const userMsg = { role: 'user', text: input.value }
  messages.value.push(userMsg)
  const userText = input.value
  input.value = ''
  isLoading.value = true
  scrollToBottom()

  try {
    const response = await fetch('https://tourgid-production.up.railway.app/api/generate_route', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${userStore.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: userText }),
    })
    if (!response.ok) throw new Error('Ошибка API')
    const data = await response.json()
    console.log(data) // Посмотри, что приходит с сервера

    if (typeof data.description === 'string' && data.description.length > 0) {
      // Сохраняем и текст, и points (но points не выводим)
      await typeWriter(data.description, data.points)
    } else {
      messages.value.push({ role: 'ai', text: 'Нет данных о маршруте.' })
    }
    // УБРАНО: await typeWriter(data.answer)
  } catch (e) {
    console.error(e)
    messages.value.push({ role: 'ai', text: 'Ошибка получения маршрута.' })
  } finally {
    isLoading.value = false
    scrollToBottom()
  }
}

async function typeWriter(text, points = null) {
  if (typeof text !== 'string' || !text.length) return
  let current = ''
  for (let i = 0; i < text.length; i++) {
    current += text[i]
    if (i === 0) {
      messages.value.push({ role: 'ai', text: '', points }) // points сохраняем в сообщении
    }
    messages.value[messages.value.length - 1].text = current
    await new Promise((r) => setTimeout(r, 18 + Math.random() * 30))
    scrollToBottom()
  }
}

function formatBoldAndBreaks(text) {
  // Жирный
  let formatted = text.replace(/\*\*(.+?)\*\*/g, '<b>$1</b>')
  // Переносы строк
  formatted = formatted.replace(/\n/g, '<br>')
  return formatted
}

const showAddTripModal = ref(false)
const tripForm = ref({
  destination: '',
  startDate: '',
  endDate: '',
  notes: '',
  points: [],
})
let currentMsgIdx = null

function openAddTripModal(msg) {
  showAddTripModal.value = true
  tripForm.value = {
    destination: '',
    startDate: '',
    endDate: '',
    notes: '',
    points: msg.points || [],
  }
  currentMsgIdx = messages.value.indexOf(msg)
}
function closeAddTripModal() {
  showAddTripModal.value = false
  currentMsgIdx = null
}

async function addTrip() {
  try {
    const response = await fetch('https://tourgid-production.up.railway.app/profile/trips', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${userStore.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(tripForm.value),
    })
    if (!response.ok) throw new Error('Ошибка добавления маршрута')
    // Отметим, что маршрут добавлен (чтобы не показывать кнопку повторно)
    if (currentMsgIdx !== null) {
      messages.value[currentMsgIdx].added = true
    }
    closeAddTripModal()
    alert('Маршрут успешно добавлен в профиль!')
  } catch (e) {
    alert('Ошибка при добавлении маршрута')
    console.error(e)
  }
}

function clearChat() {
  messages.value = []
  localStorage.removeItem('neiro_chat_history')
}
</script>
