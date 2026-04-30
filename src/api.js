import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:5000',
})

// attach access token to every request automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken')
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`
    console.log(`%c[REQUEST] ${config.method.toUpperCase()} ${config.url} — attaching access token`, 'color: blue')
  }
  return config
})

// if access token expired, refresh it and retry the original request
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // 403 means token expired/invalid, and we haven't retried yet
    if (error.response?.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true
      console.log('%c[INTERCEPTOR] Access token expired (403). Attempting refresh...', 'color: orange')

      try {
        const refreshToken = localStorage.getItem('refreshToken')
        const res = await axios.post('http://localhost:5000/refresh', { refreshToken })

        const newAccessToken = res.data.accessToken
        localStorage.setItem('accessToken', newAccessToken)

        console.log('%c[INTERCEPTOR] New access token received!', 'color: green')
        console.log('  New Access Token:', newAccessToken)

        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`
        console.log('%c[INTERCEPTOR] Retrying original request...', 'color: green')

        // notify Dashboard to update displayed token
        if (window.__onTokenRefreshed) window.__onTokenRefreshed(newAccessToken)

        return api(originalRequest)
      } catch (err) {
        console.log('%c[INTERCEPTOR] Refresh token expired. Logging out...', 'color: red')
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        window.location.href = '/'
      }
    }

    return Promise.reject(error)
  }
)

export default api
