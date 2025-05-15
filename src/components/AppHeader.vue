<template>
  <header :class="[isHome ? 'header-home' : 'header', { scrolled: isScrolled }]">
    <div class="header-container">
      <div class="header-logo">
        <router-link :to="{ path: '/' }"> <h1>tour guide</h1></router-link>
      </div>
      <nav v-if="windowWidth > 965" class="header-nav" :class="{ 'is-mobile': isMobileMenuOpen }">
        <router-link
          v-for="link in links"
          :key="link.path"
          :to="link.path"
          class="header-nav__link"
          @click="closeMobileMenu"
        >
          {{ link.name }}
        </router-link>
      </nav>
      <template v-else>
        <div class="burger">
          <button
            class="burger"
            :class="{ open: isMobileMenuOpen }"
            @click="toggleMobileMenu"
            aria-label="Открыть меню"
          >
            <span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
                width="800px"
                height="800px"
                viewBox="0 0 12 12"
                enable-background="new 0 0 12 12"
                id="Слой_1"
                version="1.1"
                xml:space="preserve"
              >
                <g>
                  <rect fill="#1D1D1B" height="1" width="11" x="0.5" y="5.5" />

                  <rect fill="#1D1D1B" height="1" width="11" x="0.5" y="2.5" />

                  <rect fill="#1D1D1B" height="1" width="11" x="0.5" y="8.5" />
                </g>
              </svg>
            </span>
          </button>
          <div v-show="isMobileMenuOpen" class="mobile-menu-overlay" @click="closeMobileMenu">
            <transition name="slide-up">
              <div v-show="isMobileMenuOpen" class="mobile-menu" @click.stop>
                <button
                  class="mobile-menu__close"
                  @click="closeMobileMenu"
                  aria-label="Закрыть меню"
                >
                  &times;
                </button>
                <nav>
                  <router-link
                    v-for="link in links"
                    :key="link.path"
                    :to="link.path"
                    class="mobile-menu__link"
                    @click="closeMobileMenu"
                  >
                    {{ link.name }}
                  </router-link>
                </nav>
              </div>
            </transition>
          </div>
        </div>
      </template>

      <div v-if="userStore.isAuth" class="header-auth-buttons">
        <router-link to="/profile" class="header-profile-btn" title="Профиль">
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
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        </router-link>
        <button class="header-logout-btn" @click="logout" title="Выйти">
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
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
        </button>
      </div>
      <button v-else class="header-signin" @click="showAuthBtn">
        <span>В путь!</span>
      </button>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, defineEmits } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

const emit = defineEmits(['open-auth'])

function showAuthBtn() {
  emit('open-auth')
}

async function logout() {
  await userStore.logout()
  router.push('/')
}

const route = useRoute()
const isHome = computed(() => route.path === '/')

const windowWidth = ref(window.innerWidth)
const handleResize = () => {
  windowWidth.value = window.innerWidth
}
onMounted(() => {
  window.addEventListener('resize', handleResize)
})
onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})

const isScrolled = ref(false)
const handleScroll = () => {
  isScrolled.value = window.scrollY > 15
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

const isMobileMenuOpen = ref(false)
const toggleMobileMenu = () => (isMobileMenuOpen.value = !isMobileMenuOpen.value)
const closeMobileMenu = () => (isMobileMenuOpen.value = false)

const links = [
  { name: 'Главная', path: '/' },
  { name: 'Нейрогид', path: '/chat' },
]
</script>
