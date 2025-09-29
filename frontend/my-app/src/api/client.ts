import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080'

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
})

let accessTokenMem: string | undefined
type RefreshHandler = () => Promise<string>
type LogoutHandler  = () => void

let refreshHandler: RefreshHandler | null = null
let logoutHandler: LogoutHandler  | null = null

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

api.interceptors.request.use((config) => {
  const url = config.url || ''
  const isAuthEndpoint = url.startsWith('/api/auth/') || url.startsWith('api/auth/')
  if (!isAuthEndpoint && accessTokenMem) {
    config.headers = config.headers ?? {}
    config.headers.Authorization = `Bearer ${accessTokenMem}`
  }
  return config
})

let refreshing = false
let waiters: Array<(t: string) => void> = []

async function runRefresh(): Promise<string> {
  if (refreshing) return new Promise((resolve) => waiters.push(resolve))
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
  (r) => r,
  async (error) => {
    const original = error.config as any
    if (error.response?.status === 401 && !original?._retry) {
      original._retry = true
      const newAccess = await runRefresh()
      original.headers = original.headers ?? {}
      original.headers.Authorization = `Bearer ${newAccess}`
      return api(original)
    }
    return Promise.reject(error)
  }
)

export default api
