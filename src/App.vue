<script setup>
import { ref } from 'vue'
import AppHeader from './components/AppHeader.vue'
import AuthPopup from './components/AuthPopup.vue'
import AppFooter from './components/AppFooter.vue'
const showAuth = ref(false)

function openAuth() {
  showAuth.value = true
}
function closeAuth() {
  showAuth.value = false
}
</script>

<template>
  <div class="app">
    <AppHeader @open-auth="openAuth" />
    <main class="main-content">
      <RouterView :showAuth="showAuth" @open-auth="openAuth" @close-auth="closeAuth" />
    </main>
    <AppFooter v-cloak />
    <transition name="fade">
      <AuthPopup :showAuth="showAuth" v-if="showAuth" @close="closeAuth" />
    </transition>
  </div>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
