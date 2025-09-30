import { useEffect, useMemo, useState } from 'react'
import { fetchChatRooms, type ChatRoom } from '../api/chat'
import { Link } from 'react-router-dom'

export default function MainPage() {
  const [rooms, setRooms] = useState<ChatRoom[]>([])
  const [q, setQ] = useState('')
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState<string | null>(null)

  useEffect(() => {
    let on = true
    ;(async () => {
      try {
        const data = await fetchChatRooms()
        if (on) setRooms(data)
      } catch (e: any) {
        console.error('fetchChatRooms error', e)
        if (on) setErr(e?.message || '채팅방 목록을 불러오지 못했어요.')
      } finally {
        if (on) setLoading(false)
      }
    })()
    return () => { on = false }
  }, [])

  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase()
    if (!t) return rooms
    return rooms.filter(r => (r.title ?? '').toLowerCase().includes(t))
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
              to="/chatrooms/new"
              className="h-10 px-4 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-500"
            >
              방 만들기
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        {err && (
          <div className="mb-4 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
            {err}
          </div>
        )}

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
                key={r.roomId}
                to={`/chatrooms/${r.roomId}`}
                className="group rounded-2xl bg-white p-5 shadow hover:shadow-lg transition border border-gray-100"
              >
                <div className="flex items-start justify-between">
                  <h3 className="text-lg font-semibold">{r.title || `채팅방 #${r.roomId}`}</h3>
                </div>
                <div className="mt-2 text-sm text-gray-600">
                  개설자: {r.creatorNickname || (r.createdByUserId ? `User#${r.createdByUserId}` : '알 수 없음')}
                </div>
                <div className="text-sm text-gray-600">
                  생성일: {new Date(r.createdAt).toLocaleString()}
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
