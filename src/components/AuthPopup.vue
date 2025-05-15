<template>
  <transition name="fade">
    <div v-if="showAuth" class="auth-popup__backdrop" @click="emit('close')">
      <div class="auth-popup" @click.stop>
        <button class="auth-popup__close" @click="emit('close')">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M18 6L6 18M6 6L18 18"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>

        <div class="auth-popup__content">
          <h2 class="auth-popup__title">{{ isLogin ? 'Вход' : 'Регистрация' }}</h2>

          <div v-if="authError" class="auth-popup__error">
            {{ authError }}
          </div>

          <form @submit.prevent="isLogin ? onLogin() : onRegister()" class="auth-popup__form">
            <div class="auth-popup__form-group">
              <label for="username">Имя пользователя</label>
              <input id="username" v-model="username" type="text" required :disabled="isLoading" />
            </div>

            <div v-if="!isLogin" class="auth-popup__form-group">
              <label for="email">Email</label>
              <input id="email" v-model="email" type="email" required :disabled="isLoading" />
            </div>

            <div class="auth-popup__form-group">
              <label for="password">Пароль</label>
              <input
                id="password"
                v-model="password"
                type="password"
                required
                :disabled="isLoading"
              />
            </div>

            <div v-if="!isLogin" class="auth-popup__form-group">
              <label for="confirm-password">Подтвердите пароль</label>
              <input
                id="confirm-password"
                v-model="confirmPassword"
                type="password"
                required
                :disabled="isLoading"
              />
              <div v-if="passwordError" class="auth-popup__error">
                {{ passwordError }}
              </div>
            </div>

            <button type="submit" class="auth-popup__submit" :disabled="isLoading">
              {{ isLoading ? 'Загрузка...' : isLogin ? 'Войти' : 'Зарегистрироваться' }}
            </button>
          </form>

          <div class="auth-popup__footer">
            <button class="auth-popup__switch" @click="isLogin = !isLogin" :disabled="isLoading">
              {{ isLogin ? 'Создать аккаунт' : 'Уже есть аккаунт?' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref } from 'vue'
import { useUserStore } from '@/stores/user'

defineProps({
  showAuth: {
    type: Boolean,
    required: true,
  },
})

const emit = defineEmits(['close'])

const userStore = useUserStore()
const isLogin = ref(true)
const username = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const passwordError = ref('')
const authError = ref('')
const isLoading = ref(false)
import { useRouter } from 'vue-router'
const router = useRouter()

const onLogin = async () => {
  try {
    isLoading.value = true
    authError.value = ''
    await userStore.login({
      username: username.value,
      password: password.value,
    })
    emit('close')
  } catch (error) {
    console.error('Ошибка авторизации:', error)
    authError.value = 'Неверный логин или пароль'
  } finally {
    isLoading.value = false
    router.push('/profile')
  }
}

const onRegister = async () => {
  if (password.value !== confirmPassword.value) {
    passwordError.value = 'Пароли не совпадают'
    return
  }

  try {
    isLoading.value = true
    authError.value = ''
    await userStore.register({
      username: username.value,
      email: email.value,
      password: password.value,
    })
    // После успешной регистрации автоматически логинимся
    await userStore.login({
      username: username.value,
      password: password.value,
    })
    emit('close')
  } catch (error) {
    console.error('Ошибка регистрации:', error)
    authError.value = 'Ошибка при регистрации'
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped></style>
