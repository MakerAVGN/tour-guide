<template>
  <Transition name="notification">
    <div v-if="show" class="notification" :class="type">
      <div class="notification-content">
        <span class="notification-message">{{ message }}</span>
        <button class="notification-close" @click="close">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
  message: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    default: 'success',
  },
  duration: {
    type: Number,
    default: 5000,
  },
})

const emit = defineEmits(['close'])
const show = ref(true)

const close = () => {
  show.value = false
  emit('close')
}

onMounted(() => {
  if (props.duration > 0) {
    setTimeout(() => {
      close()
    }, props.duration)
  }
})
</script>

<style lang="scss" scoped>
.notification {
  position: fixed;
  bottom: 20px;
  right: 20px;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  min-width: 300px;
  max-width: 400px;

  &.success {
    background-color: #4caf50;
    color: white;
  }

  &.error {
    background-color: #f44336;
    color: white;
  }

  &.warning {
    background-color: #ff9800;
    color: white;
  }

  .notification-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .notification-message {
    margin-right: 16px;
  }

  .notification-close {
    background: none;
    border: none;
    color: currentColor;
    cursor: pointer;
    padding: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0.7;
    transition: opacity 0.2s;

    &:hover {
      opacity: 1;
    }

    svg {
      width: 20px;
      height: 20px;
    }
  }
}

.notification-enter-active,
.notification-leave-active {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.notification-enter-from,
.notification-leave-to {
  transform: translateX(-120%);
  opacity: 0;
}

.notification-enter-to,
.notification-leave-from {
  transform: translateX(0);
  opacity: 1;
}
</style>
