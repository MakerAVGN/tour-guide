import { useUserStore } from '@/stores/user'
import { profileService } from '@/services/profileService'
import { useGeolocation } from './useGeolocation'

export function useTrips() {
  const userStore = useUserStore()
  const { openYandexRoute } = useGeolocation()

  const deleteTrip = async (tripId) => {
    try {
      await profileService.deleteTrip(userStore.token, tripId)
      // Обновляем список туров после удаления
      await userStore.fetchProfile()
      return { success: true }
    } catch (error) {
      console.error('Ошибка при удалении тура:', error)
      return { success: false, message: error.message }
    }
  }

  return {
    openYandexRoute,
    deleteTrip,
  }
}
