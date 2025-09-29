import { useEffect, useMemo, useState } from 'react'
import { fetchChatRooms, type ChatRoom } from '../api/chat'
import { Link } from 'react-router-dom'

export default function MainPage() {
  const [rooms, setRooms] = useState<ChatRoom[]>([])
  const [q, setQ] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let on = true
    ;(async () => {
      try {
        const data = await fetchChatRooms()
        if (on) setRooms(data)
      } finally {
        if (on) setLoading(false)
      }
    })()
    return () => { on = false }
  }, [])

  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase()
    if (!t) return rooms
    return rooms.filter(r => r.name.toLowerCase().includes(t))
  }, [rooms, q])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b">
        <div className="mx-auto max-w-6xl px-4 py-4 flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-sky-500 to-indigo-600" />
            <span className="font-semibold text-lg">Double-Play</span>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="채팅방 검색"
              className="h-10 w-64 px-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <Link
              to="/rooms/new"
              className="h-10 px-4 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-500"
            >
              방 만들기
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-28 rounded-2xl bg-white shadow animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="h-64 flex items-center justify-center text-gray-500">채팅방이 없습니다.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((r) => (
              <Link
                key={r.id}
                to={`/rooms/${r.id}`}
                className="group rounded-2xl bg-white p-5 shadow hover:shadow-lg transition border border-gray-100"
              >
                <div className="flex items-start justify-between">
                  <h3 className="text-lg font-semibold">{r.name}</h3>
                  {!!r.unreadCount && (
                    <span className="text-xs px-2 py-1 rounded-full bg-rose-600 text-white">{r.unreadCount}</span>
                  )}
                </div>
                <div className="mt-2 text-sm text-gray-600 line-clamp-2">{r.lastMessage ?? '최근 메시지가 없습니다.'}</div>
                <div className="mt-4 text-xs text-gray-500">{r.memberCount}명 참여중</div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
