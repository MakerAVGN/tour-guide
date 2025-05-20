// src/composables/useGeolocation.js

import { useNotification } from './useNotification'

export function useGeolocation() {
  const defaultCoords = [44.943376, 34.098043] // Симферополь
  const { showNotification } = useNotification()

  const getUserCoords = (options) => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        showNotification('Геолокация не поддерживается браузером', 'warning')
        reject(new Error('Геолокация не поддерживается браузером'))
        return
      }

      navigator.geolocation.getCurrentPosition(
        resolve,
        (error) => {
          let errorMessage
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Доступ к геолокации запрещен пользователем'
              break
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Информация о местоположении недоступна'
              break
            case error.TIMEOUT:
              errorMessage = 'Время ожидания получения координат истекло'
              break
            default:
              errorMessage = 'Неизвестная ошибка геолокации'
          }
          showNotification(errorMessage, 'warning')
          reject(new Error(errorMessage))
        },
        options,
      )
    })
  }

  const getYandexRouteLink = (currentCoords, points) => {
    const ll = `${currentCoords[1]},${currentCoords[0]}`
    const rtext =
      `${currentCoords[0]},${currentCoords[1]}~` +
      points.map((pt) => `${pt.coords[0]},${pt.coords[1]}`).join('~')
    return `https://yandex.ru/maps/146/simferopol/?ll=${ll}&mode=routes&rtext=${rtext}&rtt=mt&ruri=~~&z=13.6`
  }

  const openYandexRoute = async (trip) => {
    let currentCoords = defaultCoords

    try {
      currentCoords = await getUserCoords({
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      })
    } catch (e) {
      showNotification(`Ошибка: ${e.message}. Будет использован центр Симферополя.`, 'warning')
      console.log('🔄 Используются координаты по умолчанию (Симферополь):', currentCoords)
    }

    const url = getYandexRouteLink(currentCoords, trip.points)
    window.open(url, '_blank')
  }

  return {
    getUserCoords,
    getYandexRouteLink,
    openYandexRoute,
  }
}
