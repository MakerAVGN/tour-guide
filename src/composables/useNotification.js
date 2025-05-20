import { ref } from 'vue'

const notifications = ref([])

export function useNotification() {
  const showNotification = (message, type = 'success', duration = 5000) => {
    const id = Date.now()
    notifications.value.push({
      id,
      message,
      type,
      duration,
    })

    if (duration > 0) {
      setTimeout(() => {
        removeNotification(id)
      }, duration)
    }
  }

  const removeNotification = (id) => {
    notifications.value = notifications.value.filter((n) => n.id !== id)
  }

  return {
    notifications,
    showNotification,
    removeNotification,
  }
}
