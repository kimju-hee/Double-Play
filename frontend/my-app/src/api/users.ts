import api from './client'
import type { User, Gender, Role } from '../types'

export async function getMe() {
  const { data } = await api.get<User>('/api/users/me')
  return data
}

export async function updateUser(userId: number, body: { nickname?: string; gender?: Gender; role?: Role }) {
  const { data } = await api.put(`/api/users/${userId}`, body)
  return data
}

export async function deleteUser(userId: number) {
  const { data } = await api.delete<{ success: boolean }>(`/api/users/${userId}`)
  return data
}
