<script setup>
import { defineEmits } from 'vue'
import SearchBar from '../components/HomePage/SearchBar.vue'
import PopularCities from '../components/HomePage/PopularCities.vue'
import { useUserStore } from '../stores/user'
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const router = useRouter()

defineProps({
  showAuth: {
    type: Boolean,
    required: true,
  },
})

const showAuthBtn = () => {
  if (userStore.isAuth) {
    router.push('/chat')
  } else {
    emit('open-auth')
  }
}

const emit = defineEmits(['open-auth', 'close-auth'])
</script>

<template>
  <section class="main-section">
    <div class="main-section__content">
      <h1 class="main-section__title">Ваш персональный гид с искусственным интеллектом</h1>
      <p class="main-section__desc">Гид, который понимает вас с полуслова.</p>
    </div>
  </section>
  <SearchBar
    :showAuth="showAuth"
    @open-auth="$emit('open-auth')"
    @close-auth="$emit('close-auth')"
  />
  <PopularCities />
  <section class="unique-section">
    <div class="unique-section__blur">
      <div class="unique-section__wrapper">
        <h2 class="unique-section__title">Уникальные возможности вашего AI-гида</h2>

        <div class="unique-section__list">
          <div class="unique-section__card">
            <div class="unique-card__icon">
              <svg
                class="w-6 h-6 text-gray-800 dark:text-white"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  fill-rule="evenodd"
                  d="M11.906 1.994a8.002 8.002 0 0 1 8.09 8.421 7.996 7.996 0 0 1-1.297 3.957.996.996 0 0 1-.133.204l-.108.129c-.178.243-.37.477-.573.699l-5.112 6.224a1 1 0 0 1-1.545 0L5.982 15.26l-.002-.002a18.146 18.146 0 0 1-.309-.38l-.133-.163a.999.999 0 0 1-.13-.202 7.995 7.995 0 0 1 6.498-12.518ZM15 9.997a3 3 0 1 1-5.999 0 3 3 0 0 1 5.999 0Z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
            <div class="unique-card__content">
              <h3 class="unique-card__title">Персональный маршрут</h3>
              <p class="unique-card__desc">
                Просто скажите: «Хочу увидеть скрытые места Крыма с видом на море и местной кухней»
                — нейросеть создаст идеальный день без ручного поиска.
              </p>
            </div>
          </div>

          <div class="unique-section__card">
            <div class="unique-card__icon">
              <svg
                class="w-6 h-6 text-gray-800 dark:text-white"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 8v8m0-8a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm0 8a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm12 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm0 0V9a3 3 0 0 0-3-3h-3m1.5-2-2 2 2 2"
                />
              </svg>
            </div>
            <div class="unique-card__content">
              <h3 class="unique-card__title">Адаптация на лету</h3>
              <p class="unique-card__desc">
                Поменяли планы? Гид мгновенно перестроит маршрут, учитывая погоду, часы работы мест
                и вашу усталость.
              </p>
            </div>
          </div>

          <div class="unique-section__card">
            <div class="unique-card__icon">
              <svg
                class="w-6 h-6 text-gray-800 dark:text-white"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  fill-rule="evenodd"
                  d="M11.293 3.293a1 1 0 0 1 1.414 0l6 6 2 2a1 1 0 0 1-1.414 1.414L19 12.414V19a2 2 0 0 1-2 2h-3a1 1 0 0 1-1-1v-3h-2v3a1 1 0 0 1-1 1H7a2 2 0 0 1-2-2v-6.586l-.293.293a1 1 0 0 1-1.414-1.414l2-2 6-6Z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
            <div class="unique-card__content">
              <h3 class="unique-card__title">Только локальные знания</h3>
              <p class="unique-card__desc">Наш ИИ обучен на реальных отзывах жителей.</p>
            </div>
          </div>

          <div class="unique-section__card">
            <div class="unique-card__icon">
              <svg
                class="w-6 h-6 text-gray-800 dark:text-white"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 4h3a1 1 0 0 1 1 1v15a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h3m0 3h6m-3 5h3m-6 0h.01M12 16h3m-6 0h.01M10 3v4h4V3h-4Z"
                />
              </svg>
            </div>
            <div class="unique-card__content">
              <h3 class="unique-card__title">Ответы в любом формате</h3>
              <p class="unique-card__desc">
                Хотите список, карту или аудиоисторию? Гид представит информацию так, как вам
                удобно.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  <section class="promo-section">
    <div class="promo-section__container">
      <div class="promo-section__content">
        <h2 class="promo-section__title">tour guide</h2>
        <p class="promo-section__desc">
          Ваш идеальный маршрут по Крыму — в одном приложении. Персональные рекомендации, мгновенный
          подбор туров и только актуальная информация.
        </p>
        <button @click="showAuthBtn" class="search-bar__btn promo-section__btn">
          <span>Найти свой тур</span>
        </button>
      </div>
      <div class="promo-section__mockup">
        <img src="/public/img/promo-img.png" alt="Мобильное приложение" />
      </div>
    </div>
  </section>
</template>
