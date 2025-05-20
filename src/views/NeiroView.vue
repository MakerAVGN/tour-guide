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
        <button :disabled="!input.trim() || isLoading">
          <span class="chat-input__icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="200"
              height="200"
              viewBox="0 0 512 512"
              fill="#000000"
            >
              <path
                fill="#000000"
                d="m476.59 227.05l-.16-.07L49.35 49.84A23.56 23.56 0 0 0 27.14 52A24.65 24.65 0 0 0 16 72.59v113.29a24 24 0 0 0 19.52 23.57l232.93 43.07a4 4 0 0 1 0 7.86L35.53 303.45A24 24 0 0 0 16 327v113.31A23.57 23.57 0 0 0 26.59 460a23.94 23.94 0 0 0 13.22 4a24.55 24.55 0 0 0 9.52-1.93L476.4 285.94l.19-.09a32 32 0 0 0 0-58.8Z"
              ></path>
            </svg>
          </span>
          <span class="chat-input__text"> Отправить </span>
        </button>
        <button
          type="button"
          class="route-btn"
          :disabled="!input.trim() || isLoading"
          @click="generateRoute"
        >
          <span class="chat-input__icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="200"
              height="200"
              viewBox="0 0 28 24"
              fill="#000000"
            >
              <path
                fill="#000000"
                d="m26.602 23.85l-6.066-4.073l-6.073 4.073c-.132.091-.295.145-.472.145s-.34-.054-.474-.147l.003.002l-6.068-4.073l-6.067 4.073a.836.836 0 0 1-.928.011l.003.002a1.06 1.06 0 0 1-.46-.874v-.021v.001V5.393c0-.352.173-.663.439-.853l.003-.002L6.983.146c.132-.091.295-.145.472-.145s.34.054.474.147L7.926.146l6.066 4.073L20.059.146c.132-.091.295-.145.472-.145s.34.054.474.147l-.003-.002l6.541 4.392c.266.189.438.497.438.844l-.001.038v-.002v17.581c0 .361-.182.679-.459.869l-.004.002a.83.83 0 0 1-.45.131a.863.863 0 0 1-.472-.152l.003.002zM2 6.056v15.101l4.436-3.086V2.97zm12.993 15.045l4.56-3.062v-6.823c-.044.044-.08.087-.118.131c-.113.131-.225.262-.338.387l-.75-.662c.106-.125.218-.25.331-.381c.175-.194.35-.4.538-.606l.331.3V2.938L14.986 6v7.017a4.11 4.11 0 0 0 .435-.047l-.023.003l.16.987a6.7 6.7 0 0 1-.531.056h-.031zm-6.56-3.055l4.56 3.055V12.96l-.262.8a5.654 5.654 0 0 1-1.316-.625l.022.013l.531-.85c.295.191.633.358.991.483l.034.01V5.999l-4.56-3.061v6.304c.296.157.545.312.783.483l-.02-.014l-.581.812c-.056-.044-.118-.08-.181-.125zM22.246 9.28a3.579 3.579 0 0 0-.716.234l.023-.009v8.575l4.429 3.02V5.994l-4.436-3.033v5.467c.129-.044.297-.089.468-.125l.032-.006zm-5.735 3.348c.37-.184.689-.405.972-.665l-.003.003l.662.75a5.166 5.166 0 0 1-1.164.798l-.03.014zm-6.923-1.124c-.056-.075-.118-.144-.181-.218l.762-.65l.187.225c.218.256.418.5.64.72l-.687.725a9.551 9.551 0 0 1-.711-.782l-.014-.018zm-6.379.24l.013-.05c.136-.487.333-.912.586-1.297l-.011.017l.825.56c-.188.295-.34.636-.438 1L4.178 12l-.018.056zM24.114 9.7l-.64.65l-.712-.712l.65-.64l-.65-.64l.712-.712l.64.65l.64-.65l.712.712l-.65.64l.65.64l-.712.712zM4.497 9.53a3.54 3.54 0 0 1 .689-.509l.018-.009c.169-.093.368-.18.574-.249l.025-.007l.306.95c-.15.044.075.038-.062.113c-.334.132-.62.281-.888.456l.019-.012z"
              ></path>
            </svg>
          </span>
          <span class="chat-input__text"> Построить маршрут </span>
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
  <NotificationContainer />
</template>

<script setup>
import { ref, nextTick, onMounted, watch } from 'vue'
import { useUserStore } from '@/stores/user'
import { useNotification } from '../composables/useNotification'
import NotificationContainer from '../components/NotificationContainer.vue'

const input = ref('')
const messages = ref([])
const isLoading = ref(false)
const chatHistory = ref(null)
const userStore = useUserStore()
const { showNotification } = useNotification()

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
    console.log(data) //

    if (typeof data.description === 'string' && data.description.length > 0) {
      await typeWriter(data.description, data.points)
    } else {
      messages.value.push({ role: 'ai', text: 'Нет данных о маршруте.' })
    }
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
    showNotification('Маршрут успешно добавлен в профиль!', 'success')
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
