<template>
  <form class="search-bar">
    <div class="search-bar__item">
      <span class="search-bar__icon">
        <!-- Location SVG -->
        <svg
          width="20"
          height="20"
          fill="none"
          stroke="#6cc3b5"
          stroke-width="2"
          viewBox="0 0 24 24"
        >
          <path d="M12 21s-6-5.686-6-10a6 6 0 1112 0c0 4.314-6 10-6 10z" />
          <circle cx="12" cy="11" r="2" />
        </svg>
      </span>
      <div class="search-bar__wrapper">
        <div class="search-bar__label">Населенный пункт</div>
        <input class="search-bar__input" type="text" placeholder="Куда хотите отправиться в тур?" />
      </div>
    </div>
    <div class="search-bar__divider"></div>
    <button class="search-bar__btn" type="button" @click="handleSearch">
      <span>Найти</span>
    </button>
  </form>
</template>

<script setup>
const emit = defineEmits(['open-auth', 'close-auth'])
import { useUserStore } from '../../stores/user'
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const router = useRouter()

defineProps({
  showAuth: {
    type: Boolean,
    required: true,
  },
})

function handleSearch() {
  if (userStore.isAuth) {
    router.push('/chat')
  } else {
    emit('open-auth')
  }
}
</script>
