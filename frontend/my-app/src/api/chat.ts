import api from './client'

export type ChatRoom = {
  roomId: number
  title: string
  createdAt: string
  createdByUserId: number
  transactionId?: number | null
  creatorNickname?: string
}

export type MemberInfo = {
  userId: number
  nickname?: string
  role?: 'OWNER' | 'MODERATOR' | 'MEMBER'
  status: 'PENDING' | 'APPROVED' | 'BANNED'
}

export function computeIsOwner(opts: {
  room?: Pick<ChatRoom, 'createdByUserId'> | null
  members?: MemberInfo[]
  myId: number | null | undefined
}): boolean {
  const { room, members = [], myId } = opts
  if (!myId) return false
  if (room && room.createdByUserId === myId) return true
  const owner = members.find(m => m.userId === myId && m.role === 'OWNER')
  return !!owner
}

export async function fetchChatRooms(): Promise<ChatRoom[]> {
  const { data } = await api.get<{ items: ChatRoom[] }>('/api/chatrooms')
  return data.items
}
export const listChatRooms = fetchChatRooms

export async function createChatRoom(title: string, transactionId?: number | null): Promise<ChatRoom> {
  const payload = { title, transactionId: transactionId ?? null }
  const { data } = await api.post<ChatRoom>('/api/chatrooms', payload)
  return data
}

export async function connectRoomByTransaction(transactionId: number): Promise<ChatRoom> {
  return createChatRoom(`거래 #${transactionId}`, transactionId)
}

export async function getRoom(roomId: number): Promise<ChatRoom> {
  const { data } = await api.get<ChatRoom>(`/api/chatrooms/${roomId}`)
  return data
}

/** ========= Members ========= */
export async function listMembers(roomId: number): Promise<MemberInfo[]> {
  const { data } = await api.get<{ items: MemberInfo[] }>(`/api/chatrooms/${roomId}/members`)
  return data.items
}

export async function requestJoin(roomId: number) {
  const { data } = await api.post<{ status: MemberInfo['status'] }>(`/api/chatrooms/${roomId}/join`)
  return data
}

export async function approveMember(roomId: number, userId: number) {
  const { data } = await api.put<{ status: MemberInfo['status'] }>(`/api/chatrooms/${roomId}/members/${userId}/approve`)
  return data
}

export async function rejectMember(roomId: number, userId: number) {
  const { data } = await api.delete<{ success: boolean }>(`/api/chatrooms/${roomId}/members/${userId}`)
  return data
}

export async function kickMember(roomId: number, userId: number) {
  const { data } = await api.delete<{ success: boolean }>(`/api/chatrooms/${roomId}/members/${userId}`)
  return data
}

export async function banMember(roomId: number, userId: number) {
  const { data } = await api.put<{ success: boolean }>(`/api/chatrooms/${roomId}/members/${userId}/ban`)
  return data
}

export async function unbanMember(roomId: number, userId: number) {
  const { data } = await api.put<{ status: MemberInfo['status'] }>(`/api/chatrooms/${roomId}/members/${userId}/approve`)
  return data
}
