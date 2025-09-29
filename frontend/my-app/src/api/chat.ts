import api from './client'

export type ChatRoom = {
  id: number
  name: string
  memberCount: number
  lastMessage?: string
  unreadCount?: number
}

export async function fetchChatRooms(q?: string): Promise<ChatRoom[]> {
  const { data } = await api.get('/api/rooms', { params: { q } })
  return data
}
