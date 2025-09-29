import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import api, { setAuthToken, setAuthHandlers, clearAuthMem } from '../api/client'
import axios from 'axios'

type User = { userId: number; nickname: string; role: string }

type AuthState = {
  accessToken?: string
  refreshToken?: string
  user?: User

  setAuth: (p: { accessToken: string; refreshToken: string; user: User }) => void
  setAccessToken: (t: string) => void
  clear: () => void
  logout: () => void
}

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      accessToken: undefined,
      refreshToken: undefined,
      user: undefined,

      setAuth: ({ accessToken, refreshToken, user }) => {
        setAuthToken(accessToken)
        set({ accessToken, refreshToken, user })
      },

      setAccessToken: (t) => {
        setAuthToken(t)
        set({ accessToken: t })
      },

      clear: () => {
        clearAuthMem()
        set({ accessToken: undefined, refreshToken: undefined, user: undefined })
      },

      logout: () => {
        clearAuthMem()
        set({ accessToken: undefined, refreshToken: undefined, user: undefined })
      },
    }),
    { name: 'dp-auth' }
  )
)

setAuthHandlers(
  async () => {
    const { refreshToken } = useAuth.getState()
    if (!refreshToken) throw new Error('no refresh token')
    const base = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080'
    const { data } = await axios.post(
      `${base}/api/auth/refresh`,
      { refreshToken },
      { headers: { 'Content-Type': 'application/json' }, withCredentials: true }
    )
    return data.accessToken as string
  },
  () => {
  }
)
