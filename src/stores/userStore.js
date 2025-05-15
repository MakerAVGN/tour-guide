import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    query: '',
    results: [],
    isLoading: false,
  }),
  actions: {
    async search(query) {
      this.isLoading = true
      // Здесь будет запрос к API
      this.results = mockResults
      this.isLoading = false
    },
  },
})
