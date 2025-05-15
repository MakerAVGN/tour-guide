import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { profileService } from '@/services/profileService'

export function useProfile() {
  const router = useRouter()
  const userStore = useUserStore() // Добавляем userStore

  // Состояние
  const isLoading = ref(false)
  const userData = ref({
    username: '',
    email: '',
    name: '',
    surname: '',
    phone: '',
    gender: '',
    birthday: '',
    photo: null,
  })

  const avatarUrl = ref('/tour-guide/img/user-default.jpg')
  const showAvatarPopup = ref(false)

  // Табы
  const activeTab = ref('profile')
  const tabs = [
    { id: 'profile', label: 'Информация о профиле' },
    { id: 'history', label: 'Мои туры' },
    { id: 'security', label: 'Изменение профиля' },
  ]

  const currentTabLabel = computed(() => {
    const tab = tabs.find((t) => t.id === activeTab.value)
    return tab ? tab.label : ''
  })

  // Методы
  const loadProfile = async () => {
    if (!userStore.isAuth) {
      router.push('/')
      return
    }

    isLoading.value = false
    try {
      await userStore.fetchProfile()
      if (userStore.user) {
        userData.value = { ...userStore.user }
      }
    } catch (error) {
      console.error('Ошибка загрузки профиля:', error)
    } finally {
      isLoading.value = true
    }
  }

  const saveProfile = async () => {
    try {
      const updated = await profileService.updateProfile(userStore.token, userData.value)
      userStore.user = updated
      return { success: true, message: 'Профиль успешно сохранён!' }
    } catch (e) {
      console.error('Ошибка при сохранении профиля:', e)
      return {
        success: false,
        message: e.message || 'Ошибка при сохранении профиля',
      }
    }
  }

  const handleLogout = () => {
    userStore.logout()
    router.push('/')
  }

  // Методы для работы с аватаром
  const openModal = () => {
    showAvatarPopup.value = true
  }

  const closeModal = () => {
    showAvatarPopup.value = false
  }

  const selectedFileName = ref('')
  const onFileChange = async (event) => {
    const file = event.target.files[0]
    selectedFileName.value = file ? file.name : ''
    if (!file) return

    try {
      const data = await profileService.uploadPhoto(userStore.token, file)
      userData.value = {
        ...userData.value,
        photo: data.photoFilename,
        photoContentType: data.photoContentType,
        photoSize: data.photoSize,
        updatedAt: data.updatedAt,
      }
      closeModal()
      return { success: true }
    } catch (e) {
      console.error('Ошибка загрузки фото:', e)
      return { success: false, message: 'Ошибка загрузки фото' }
    }
  }

  const loadPhoto = async () => {
    if (!userData.value.photo) {
      avatarUrl.value = '/tour-guide/img/user-default.jpg'
      return
    }

    try {
      const data = await profileService.getPhoto(userStore.token)
      const byteCharacters = atob(data.data)
      const byteNumbers = new Array(byteCharacters.length)
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i)
      }
      const byteArray = new Uint8Array(byteNumbers)
      const blob = new Blob([byteArray], { type: data.contentType })
      avatarUrl.value = URL.createObjectURL(blob)
    } catch (e) {
      console.error('Ошибка загрузки фото:', e)
      avatarUrl.value = '/tour-guide/img/user-default.jpg'
    }
  }

  // Наблюдатель за изменением фото
  watch(() => userData.value.photo, loadPhoto, { immediate: true })

  return {
    // Состояние
    isLoading,
    userData,
    avatarUrl,
    showAvatarPopup,
    activeTab,
    tabs,
    currentTabLabel,
    userStore,

    // Методы
    loadProfile,
    saveProfile,
    handleLogout,
    openModal,
    closeModal,
    onFileChange,
  }
}
