import api from './client'
import type { LoginResponse } from '../types'
import axios from 'axios'

export async function signup(payload: {
  email: string; password: string; nickname: string; gender: 'M' | 'F'; oauth_provider?: 'kakao' | undefined
}) {
  const { email, password, nickname, gender, oauth_provider } = payload
  const body: Record<string, any> = { email, password, nickname, gender }
  if (oauth_provider) body.oauth_provider = oauth_provider

  try {
    const { data } = await api.post('/api/auth/signup', body)
    return { success: true, data }
  } catch (err) {
    if (axios.isAxiosError(err) && err.response?.data) {
      return {
        success: false,
        errors: err.response.data.errors ?? { global: err.response.data.message || '회원가입 실패' },
      }
    }
    return { success: false, errors: { global: '알 수 없는 오류' } }
  }
}

export async function login(payload: { email: string; password: string }) {
  try {
    const { data } = await api.post<LoginResponse>('/api/auth/login', payload)
    return { success: true, data }
  } catch (err: any) {
    if (axios.isAxiosError(err) && err.response) {
      return { success: false, errors: { global: err.response.data?.message || '로그인 실패' } }
    }
    return { success: false, errors: { global: '네트워크 오류' } }
  }
}
