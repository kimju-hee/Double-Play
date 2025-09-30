import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchChatRooms, type ChatRoom } from '../api/chat'

export default function ChatRoomListPage() {
  const [rooms, setRooms] = useState<ChatRoom[]>([])

  useEffect(() => {
    fetchChatRooms().then(setRooms).catch(console.error)
  }, [])

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">채팅방</h1>
        <Link to="/chatrooms/new" className="rounded bg-indigo-600 px-4 py-2 text-white">개설</Link>
      </div>
      <ul className="space-y-2">
        {rooms.map(r => (
          <li key={r.roomId} className="rounded border bg-white p-4">
            <div className="font-semibold">{r.title}</div>
            <div className="text-sm text-gray-500">
              #{r.roomId} · {new Date(r.createdAt).toLocaleString()}
            </div>
            <Link
              to={`/chatrooms/${r.roomId}`}
              className="text-indigo-600 text-sm hover:underline mt-2 inline-block"
            >
              입장
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
