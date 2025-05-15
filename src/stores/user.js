import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  const token = ref(localStorage.getItem('access_token') || '')
  const user = ref(null)
  const isAuth = ref(!!token.value)

  function setToken(newToken) {
    token.value = newToken
    isAuth.value = true
    localStorage.setItem('access_token', newToken)
  }
  function clearToken() {
    token.value = ''
    isAuth.value = false
    localStorage.removeItem('access_token')
  }

  async function login({ username, password }) {
    const res = await fetch('https://tourgid-production.up.railway.app/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })
    if (!res.ok) throw new Error('Ошибка авторизации')
    const data = await res.json()
    setToken(data.access_token)
    user.value = data.user
    return data
  }

  async function register({ username, email, password }) {
    const res = await fetch('https://tourgid-production.up.railway.app/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password }),
    })
    if (!res.ok) throw new Error('Ошибка регистрации')
    return await res.json()
  }

  async function fetchProfile() {
    if (!token.value) return
    const res = await fetch('https://tourgid-production.up.railway.app/profile', {
      headers: { Authorization: 'Bearer ' + token.value },
    })
    if (!res.ok) throw new Error('Ошибка получения профиля')
    user.value = await res.json()
    return user.value
  }

  function logout() {
    clearToken()
    user.value = null
  }

  return { token, user, isAuth, login, register, fetchProfile, logout }
})
