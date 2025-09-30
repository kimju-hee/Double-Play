// src/api/client.ts
import axios, { AxiosError } from 'axios'
import type { AxiosRequestConfig } from 'axios'

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080'

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
})

/** ========= Auth 메모리 & 핸들러 ========= */
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

/** ========= 요청 인터셉터 (Authorization 부착 정책) ========= */
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

  // 공개 GET 및 인증 엔드포인트에는 토큰을 붙이지 않음
  if (!isAuthEndpoint(url) && !isPublicGet(method, url) && accessTokenMem) {
    config.headers = config.headers ?? {}
    // 이미 헤더에 수동 설정되어 있으면 건드리지 않음
    if (!('Authorization' in config.headers)) {
      config.headers.Authorization = `Bearer ${accessTokenMem}`
    }
  }
  return config
})

/** ========= 응답 인터셉터 (401/403 처리 + 1회 재발급) ========= */
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
    // refresh 실패 → 로그아웃 핸들러 호출
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

    // 인증/공개 엔드포인트는 재시도 불필요
    if (isAuthEndpoint(url) || isPublicGet(method, url)) {
      return Promise.reject(error)
    }

    // 401/403이면 1회만 토큰 재발급 시도
    if ((status === 401 || status === 403) && !original._retry) {
      try {
        original._retry = true
        const newToken = await getFreshToken()
        original.headers = original.headers ?? {}
        original.headers.Authorization = `Bearer ${newToken}`
        return api.request(original)
      } catch {
        // 재발급 실패: 그대로 에러 전파
        return Promise.reject(error)
      }
    }

    return Promise.reject(error)
  }
)

export default api
