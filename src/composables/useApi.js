import axios from 'axios'

const api = axios.create({
  baseURL: 'http://your-api-url.com/api',
  timeout: 10000,
})

export default api
