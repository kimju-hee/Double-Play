import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchChatRooms, listMembers, requestJoin, type ChatRoom } from '../api/chat'
import { useAuth } from '../store/auth'

export default function ChatRoomListPage() {
  const [rooms, setRooms] = useState<ChatRoom[]>([])
  const [statuses, setStatuses] = useState<Record<number, string>>({})
  const me = useAuth(s => s.user)

  useEffect(() => {
    fetchChatRooms()
      .then(async rooms => {
        setRooms(rooms)
        const statusMap: Record<number, string> = {}
        for (const r of rooms) {
          try {
            const ms = await listMembers(r.roomId)
            const mine = ms.find(m => Number(m.userId) === Number(me?.userId))
            statusMap[r.roomId] = mine?.status || 'NONE'
          } catch {
            statusMap[r.roomId] = 'NONE'
          }
        }
        setStatuses(statusMap)
      })
      .catch(console.error)
  }, [me?.userId])

  const onJoin = async (roomId: number) => {
    try {
      await requestJoin(roomId)
      setStatuses(prev => ({ ...prev, [roomId]: 'PENDING' }))
    } catch (e) {
      alert('참여 요청 실패')
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">채팅방</h1>
        <Link to="/chatrooms/new" className="rounded bg-indigo-600 px-4 py-2 text-white">개설</Link>
      </div>
      <ul className="space-y-2">
        {rooms.map(r => {
          const status = statuses[r.roomId]
          return (
            <li key={r.roomId} className="rounded border bg-white p-4">
              <div className="font-semibold">{r.title}</div>
              <div className="text-sm text-gray-500">
                #{r.roomId} · {new Date(r.createdAt).toLocaleString()}
              </div>

              {status === 'APPROVED' ? (
                <Link
                  to={`/chatrooms/${r.roomId}`}
                  className="text-indigo-600 text-sm hover:underline mt-2 inline-block"
                >
                  입장
                </Link>
              ) : status === 'PENDING' ? (
                <div className="mt-2 text-xs text-gray-500">참여 요청 대기 중</div>
              ) : (
                <button
                  onClick={() => onJoin(r.roomId)}
                  className="mt-2 rounded bg-indigo-600 px-2 py-1 text-white text-sm"
                >
                  참여 요청
                </button>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
