import { defineStore } from 'pinia'

export const useSearchStore = defineStore('search', {
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
