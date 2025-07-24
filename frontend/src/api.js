import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8000', // Changez cela en production
})

// Intercepteur pour ajouter le token JWT
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}, (error) => {
  return Promise.reject(error)
})

// Intercepteur pour rafraîchir le token
api.interceptors.response.use((response) => {
  return response
}, async (error) => {
  const originalRequest = error.config
  
  if (error.response.status === 401 && !originalRequest._retry) {
    originalRequest._retry = true
    
    try {
      const refreshToken = localStorage.getItem('refresh_token')
      const response = await axios.post('/api/token/refresh/', {
        refresh: refreshToken
      })
      
      localStorage.setItem('access_token', response.data.access)
      api.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`
      return api(originalRequest)
    } catch (err) {
      console.error('Refresh token failed', err)
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      window.location.href = '/login'
    }
  }
  
  return Promise.reject(error)
})

export default api