<template v-cloak>
  <section v-if="isLoading && userStore.isAuth" class="profile">
    <div class="profile-header">
      <h1>Мой профиль</h1>
      <div class="profile-breadcrumbs">Профиль / {{ currentTabLabel }}</div>
    </div>
    <div class="profile-wrapper">
      <div class="profile-card">
        <!-- Левая колонка -->
        <aside class="profile-sidebar">
          <div class="sidebar-content">
            <div>
              <div class="avatar-block">
                <img
                  class="avatar"
                  :src="avatarUrl"
                  alt="avatar"
                  @click="openModal"
                  :style="{ '--auth-token': userStore.token }"
                />
                <div class="user-name">{{ userData.name }} {{ userData.surname }}</div>
                <div class="user-username">{{ userData.username }}</div>
                <div class="user-meta">
                  <span class="user-birth" v-if="userData.birthDate">
                    <i class="icon-calendar"></i> {{ userData.birthDate }}
                  </span>
                </div>
              </div>
              <nav class="profile-nav">
                <button
                  v-for="tab in tabs"
                  :key="tab.id"
                  :class="['nav-btn', { active: activeTab === tab.id }]"
                  @click="activeTab = tab.id"
                >
                  {{ tab.label }}
                </button>
              </nav>
            </div>
            <button class="logout-btn" @click="handleLogout">Выйти</button>
          </div>
        </aside>

        <div v-if="activeTab === 'profile' || activeTab === 'security'" class="profile-content">
          <h2>{{ activeTab === 'profile' ? 'Персональная информация' : 'Изменение профиля' }}</h2>
          <div class="form-group">
            <label>Имя пользователя:</label>
            <input v-model="userData.username" type="text" :disabled="activeTab === 'profile'" />
          </div>
          <div class="form-group">
            <label>Почта:</label>
            <input v-model="userData.email" type="text" :disabled="activeTab === 'profile'" />
          </div>
          <div class="form-group">
            <label>Имя:</label>
            <input v-model="userData.name" type="text" :disabled="activeTab === 'profile'" />
          </div>
          <div class="form-group">
            <label>Фамилия:</label>
            <input v-model="userData.surname" type="text" :disabled="activeTab === 'profile'" />
          </div>
          <div class="form-group">
            <label>Номер телефона:</label>
            <input v-model="userData.phone" type="text" :disabled="activeTab === 'profile'" />
          </div>
          <div class="form-group">
            <label for="gender-select">Пол:</label>
            <select
              id="gender-select"
              v-model="userData.gender"
              :disabled="activeTab === 'profile'"
            >
              <option value="">Выберите пол</option>
              <option value="male">Мужчина</option>
              <option value="female">Женщина</option>
            </select>
          </div>
          <div class="form-group">
            <label>Дата рождения:</label>
            <input v-model="userData.birthday" type="date" :disabled="activeTab === 'profile'" />
          </div>
          <button v-if="activeTab === 'security'" class="save-btn" @click="handleSave">
            Сохранить
          </button>
        </div>

        <div v-if="activeTab === 'history'" class="profile-content">
          <h2>Мои туры</h2>
          <div v-if="userStore.user?.myTrips?.length" class="trips-list">
            <div
              v-for="trip in userStore.user.myTrips"
              :key="trip.startDate + trip.destination"
              class="trip-card"
            >
              <div class="trip-wrapper">
                <h3>{{ trip.destination }}</h3>
                <div class="trip-dates">
                  <span>С {{ new Date(trip.startDate).toLocaleDateString() }}</span>
                  <span>по {{ new Date(trip.endDate).toLocaleDateString() }}</span>
                </div>
                <div class="trip-points">
                  <b>Точки маршрута:</b>
                  <ul>
                    <li v-for="point in trip.points" :key="point.name">{{ point.name }}</li>
                  </ul>
                </div>
                <div v-if="trip.notes" class="trip-notes"><b>Заметки:</b> {{ trip.notes }}</div>
              </div>
              <div class="trip-buttons">
                <button class="build-route-btn" @click="openYandexRoute(trip)">
                  Построить маршрут
                </button>
                <button class="delete-trip-btn" @click="handleDeleteTrip(trip)">
                  <span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="200"
                      height="200"
                      viewBox="0 0 20 20"
                      fill="#000000"
                    >
                      <path
                        fill="#000000"
                        d="m6 2l2-2h4l2 2h4v2H2V2h4zM3 6h14l-1 14H4L3 6zm5 2v10h1V8H8zm3 0v10h1V8h-1z"
                      ></path>
                    </svg>
                  </span>
                </button>
              </div>
            </div>
          </div>
          <div v-else class="no-trips">У вас пока нет сохранённых туров</div>
        </div>
      </div>
    </div>
  </section>
  <div v-else class="profile loading">Загрузка профиля...</div>
  <div v-if="showAvatarPopup" class="popup-backdrop" @click.self="closeModal">
    <div class="popup">
      <h3>Загрузить новое фото</h3>
      <div class="file-input-wrapper">
        <label class="file-input-label">
          <span>Выбрать файл</span>
          <input type="file" accept="image/*" @change="onFileChange" ref="fileInput" />
        </label>
        <span class="file-name" v-if="selectedFileName">{{ selectedFileName }}</span>
      </div>
      <div class="popup-actions">
        <button class="cancel-btn" @click="closeModal">Отмена</button>
      </div>
    </div>
  </div>
  <NotificationContainer />
</template>

<script setup>
import { onMounted } from 'vue'
import { useProfile } from '@/composables/useProfile'
import { useTrips } from '@/composables/useTrips'
import { useNotification } from '@/composables/useNotification'
import NotificationContainer from '../components/NotificationContainer.vue'

defineProps({
  showAuth: {
    type: Boolean,
    required: true,
  },
})

defineEmits(['openAuth', 'closeAuth'])

const { showNotification } = useNotification()

const {
  isLoading,
  userData,
  avatarUrl,
  showAvatarPopup,
  activeTab,
  tabs,
  currentTabLabel,
  userStore,
  loadProfile,
  saveProfile,
  handleLogout,
  openModal,
  closeModal,
  onFileChange,
} = useProfile()

const { openYandexRoute, deleteTrip } = useTrips()

const handleDeleteTrip = async (trip) => {
  console.log('Данные тура:', trip)
  if (!trip.number) {
    console.error('У тура отсутствует номер')
    return
  }
  const result = await deleteTrip(trip.number)
  if (!result.success) {
    console.error('Ошибка при удалении тура:', result.message)
  }
}

async function handleSave() {
  console.log('Начало сохранения профиля')
  try {
    const result = await saveProfile()
    console.log('Результат сохранения:', result)
    if (result.success) {
      console.log('Показываю уведомление об успехе')
      showNotification('Профиль успешно обновлен!', 'success')
    } else {
      console.log('Показываю уведомление об ошибке')
      showNotification('Ошибка при обновлении профиля', 'error')
    }
  } catch (error) {
    console.error('Ошибка при сохранении:', error)
    showNotification('Произошла ошибка при сохранении профиля', 'error')
  }
}

onMounted(loadProfile)
</script>
