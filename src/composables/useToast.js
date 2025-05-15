import { ref } from 'vue'
import { createVNode, render } from 'vue'
import ToastNotification from '../components/Notifications/ToastNotification.vue'

const toasts = ref([])

export function useToast() {
  const showToast = (message, type = 'info', duration = 3000) => {
    const container = document.createElement('div')
    const vnode = createVNode(ToastNotification, {
      message,
      type,
      duration,
      onClose: () => {
        render(null, container)
        container.remove()
        const index = toasts.value.indexOf(container)
        if (index > -1) {
          toasts.value.splice(index, 1)
        }
      },
    })

    render(vnode, container)
    document.body.appendChild(container)
    toasts.value.push(container)
  }

  return {
    showToast,
    success: (message, duration) => showToast(message, 'success', duration),
    error: (message, duration) => showToast(message, 'error', duration),
    warning: (message, duration) => showToast(message, 'warning', duration),
    info: (message, duration) => showToast(message, 'info', duration),
  }
}
