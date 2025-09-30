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
    room?: { createdByUserId?: number | string } | null
    members?: Array<{ userId: number | string; role?: 'OWNER' | 'MODERATOR' | 'MEMBER' }>
    myId: number | string | null | undefined
  }): boolean {
    const my = Number(opts.myId ?? NaN)
    if (!Number.isFinite(my)) return false
  
    const ownerFromRoom = Number(opts.room?.createdByUserId ?? NaN)
    if (Number.isFinite(ownerFromRoom) && ownerFromRoom === my) return true
  
    const list = opts.members ?? []
    return list.some(m => Number(m.userId) === my && m.role === 'OWNER')
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
export type ChatMessage = { id: number; roomId: number; userId: number; content: string; createdAt: string; system?: boolean }

export async function fetchChatMessages(roomId: number, after: number = 0, limit: number = 50): Promise<ChatMessage[]> {
  const { data } = await api.get<{ items: ChatMessage[] }>(`/api/chatrooms/${roomId}/messages`, { params: { after, limit } })
  return data.items
}

export async function sendChatMessage(roomId: number, content: string): Promise<ChatMessage> {
  const { data } = await api.post<ChatMessage>(`/api/chatrooms/${roomId}/messages`, { content })
  return data
}

export async function completeChat(roomId: number): Promise<ChatRoom> {
  const { data } = await api.post<ChatRoom>(`/api/chatrooms/${roomId}/complete`)
  return data
}

export async function aggregateMyTradeChats(myId: number) {
  const rooms = await listChatRooms()
  const tradeRooms = rooms.filter(r => r.transactionId != null)
  const enriched = await Promise.all(
    tradeRooms.map(async r => {
      let status: 'OPEN' | 'CLOSED' | undefined = undefined
      try {
        const full = await getRoom(r.roomId)
        status = (full as any).status || undefined
      } catch {}
      let joined = false
      try {
        const members = await listMembers(r.roomId)
        joined = members.some(m => Number(m.userId) === Number(myId) && m.status === 'APPROVED')
      } catch {}
      return { ...r, status, joined }
    })
  )
  const hosting = enriched.filter(r => Number(r.createdByUserId) === Number(myId))
  const joined = enriched.filter(r => Number(r.createdByUserId) !== Number(myId) && r.joined)
  const others = enriched.filter(r => Number(r.createdByUserId) !== Number(myId) && !r.joined)
  return { hosting, joined, others }
}
