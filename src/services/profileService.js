const API_URL = 'https://tourgid-production.up.railway.app'

// Константы для HTTP-методов
const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
}

// Константы для заголовков
const HEADERS = {
  JSON: 'application/json',
}

// Максимальный размер данных для отправки (в байтах)
const MAX_PAYLOAD_SIZE = 5 * 1024 * 1024 // 5MB

// Базовый метод для запросов
const fetchWithAuth = async (endpoint, options = {}) => {
  const { token, ...fetchOptions } = options

  // Проверяем размер данных для PUT/POST запросов
  if (fetchOptions.body) {
    const bodySize =
      fetchOptions.body instanceof FormData
        ? fetchOptions.body.get('photo')?.size || 0
        : JSON.stringify(fetchOptions.body).length

    if (bodySize > MAX_PAYLOAD_SIZE) {
      throw new Error(
        `Размер данных превышает максимально допустимый (${MAX_PAYLOAD_SIZE / 1024 / 1024}MB)`,
      )
    }
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...fetchOptions,
    headers: {
      ...fetchOptions.headers,
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Ошибка запроса: ${response.status} - ${errorText}`)
  }

  return response.json()
}

export const profileService = {
  // Получение профиля
  async getProfile(token) {
    return fetchWithAuth('/profile', { token })
  },

  // Обновление профиля
  async updateProfile(token, profileData) {
    console.log('profileService: Начало обновления профиля')
    // Очищаем данные от лишних полей перед отправкой
    const cleanData = {
      username: profileData.username,
      email: profileData.email,
      name: profileData.name,
      surname: profileData.surname,
      phone: profileData.phone,
      gender: profileData.gender,
      birthday: profileData.birthday,
    }
    console.log('profileService: Подготовленные данные:', cleanData)

    const result = await fetchWithAuth('/profile', {
      method: HTTP_METHODS.PUT,
      headers: {
        'Content-Type': HEADERS.JSON,
      },
      body: JSON.stringify(cleanData),
      token,
    })
    console.log('profileService: Получен ответ от сервера:', result)
    return result
  },

  // Загрузка фото
  async uploadPhoto(token, file) {
    // Проверяем размер файла
    if (file.size > MAX_PAYLOAD_SIZE) {
      throw new Error(
        `Размер файла превышает максимально допустимый (${MAX_PAYLOAD_SIZE / 1024 / 1024}MB)`,
      )
    }

    const formData = new FormData()
    formData.append('photo', file)

    return fetchWithAuth('/profile/upload-photo', {
      method: HTTP_METHODS.POST,
      body: formData,
      token,
    })
  },

  // Получение фото
  async getPhoto(token) {
    return fetchWithAuth('/profile/photo', { token })
  },

  async deleteTrip(token, tripId) {
    return fetchWithAuth(`/profile/trips/${tripId}`, {
      method: HTTP_METHODS.DELETE,
      token,
    })
  },
}
