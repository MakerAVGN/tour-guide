import { useGeolocation } from './useGeolocation'

export function useTrips() {
  const { openYandexRoute } = useGeolocation()

  const getTrips = (user) => {
    return user?.myTrips || []
  }

  return {
    getTrips,
    openYandexRoute,
  }
}
