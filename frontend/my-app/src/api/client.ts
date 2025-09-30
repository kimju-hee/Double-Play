import axios from 'axios'
import type { AxiosError, AxiosRequestConfig } from 'axios'

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
})

let accessTokenMem: string | undefined
type RefreshHandler = () => Promise<string>
type LogoutHandler = () => void

let refreshHandler: RefreshHandler | null = null
let logoutHandler: LogoutHandler | null = null

export function setAuthToken(token?: string) {
  accessTokenMem = token
  if (token) api.defaults.headers.common['Authorization'] = `Bearer ${token}`
  else delete api.defaults.headers.common['Authorization']
}

export function setAuthHandlers(onRefresh: RefreshHandler, onLogout: LogoutHandler) {
  refreshHandler = onRefresh
  logoutHandler = onLogout
}

export function clearAuthMem() {
  accessTokenMem = undefined
  delete api.defaults.headers.common['Authorization']
}

function isAuthEndpoint(url: string) {
  return url.startsWith('/api/auth/') || url.startsWith('api/auth/')
}
function isPublicGet(method: string, url: string) {
  return (
    method === 'get' &&
    (url.startsWith('/api/venues') ||
      url.startsWith('api/venues') ||
      url.startsWith('/api/games') ||
      url.startsWith('api/games') ||
      url.startsWith('/api/teams') ||
      url.startsWith('api/teams'))
  )
}

api.interceptors.request.use((config) => {
  const url = config.url || ''
  const method = (config.method || 'get').toLowerCase()

  if (!isAuthEndpoint(url) && !isPublicGet(method, url) && accessTokenMem) {
    config.headers = config.headers ?? {}
    if (!('Authorization' in config.headers)) {
      config.headers.Authorization = `Bearer ${accessTokenMem}`
    }
  }
  return config
})

type RetriableConfig = AxiosRequestConfig & { _retry?: boolean }

let refreshing = false
let waiters: Array<(token: string) => void> = []

async function getFreshToken(): Promise<string> {
  if (refreshing) {
    return new Promise((resolve) => waiters.push(resolve))
  }
  refreshing = true
  try {
    if (!refreshHandler) throw new Error('no refresh handler')
    const newAccess = await refreshHandler()
    setAuthToken(newAccess)
    waiters.forEach((res) => res(newAccess))
    waiters = []
    return newAccess
  } catch (e) {
    if (logoutHandler) logoutHandler()
    clearAuthMem()
    throw e
  } finally {
    refreshing = false
  }
}

api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const status = error.response?.status
    const original = (error.config || {}) as RetriableConfig
    const url = original.url || ''
    const method = (original.method || 'get').toLowerCase()

    if (isAuthEndpoint(url) || isPublicGet(method, url)) {
      return Promise.reject(error)
    }

    if ((status === 401 || status === 403) && !original._retry) {
      try {
        original._retry = true
        const newToken = await getFreshToken()
        original.headers = original.headers ?? {}
        original.headers.Authorization = `Bearer ${newToken}`
        return api.request(original)
      } catch {
        return Promise.reject(error)
      }
    }

    return Promise.reject(error)
  }
)

export default api
