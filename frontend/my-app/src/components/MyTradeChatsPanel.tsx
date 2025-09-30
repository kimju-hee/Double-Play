import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { aggregateMyTradeChats } from '../api/chat'
import { useAuth } from '../store/auth'

export default function MyTradeChatsPanel() {
  const me = useAuth(s => s.user)
  const [data, setData] = useState<{ hosting: any[]; joined: any[]; others: any[] } | null>(null)
  const [err, setErr] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let on = true
    ;(async () => {
      try {
        setErr(null)
        setLoading(true)
        const d = await aggregateMyTradeChats(Number(me?.userId))
        if (on) setData(d)
      } catch (e: any) {
        setErr(e?.response?.data?.message || e?.message || '불러오지 못했습니다.')
      } finally {
        if (on) setLoading(false)
      }
    })()
    return () => { on = false }
  }, [me?.userId])

  if (loading) return <div className="rounded bg-white p-3 shadow">불러오는 중…</div>
  if (err) return <div className="rounded bg-rose-50 border border-rose-200 p-3 text-rose-700">{err}</div>

  return (
    <div className="space-y-4">
      <Section title="내가 방장인 거래 채팅" items={data?.hosting || []} />
      <Section title="내가 참여한 거래 채팅" items={data?.joined || []} />
      <Section title="다른 사람이 참여 중인 거래 채팅" items={data?.others || []} />
    </div>
  )
}

function Section({ title, items }: { title: string; items: any[] }) {
  if (!items.length) return null
  return (
    <div>
      <div className="mb-2 text-sm font-semibold text-gray-600">{title}</div>
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {items.map(it => (
          <li key={it.roomId} className="rounded border bg-white p-3 flex items-center justify-between">
            <div>
              <div className="font-semibold">{it.title}</div>
              <div className="text-xs text-gray-500">거래 #{it.transactionId} · {it.status || 'OPEN'}</div>
            </div>
            <Link to={`/chatrooms/${it.roomId}`} className="text-indigo-600 hover:underline">열기</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
