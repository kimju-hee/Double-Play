import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import {
  getTransaction,
  deleteTransaction,
  type TransactionResponse,
} from '../api/transactions'
import { getVenue } from '../api/venues'
import { connectRoomByTransaction } from '../api/chat'

export default function TransactionDetailPage() {
  const { transactionId } = useParams<{ transactionId: string }>()
  const id = Number(transactionId)
  const [item, setItem] = useState<TransactionResponse | null>(null)
  const [venueName, setVenueName] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState<string | null>(null)
  const nav = useNavigate()

  useEffect(() => {
    let on = true
    ;(async () => {
      try {
        const data = await getTransaction(id)
        if (!on) return
        setItem(data)
        try {
          const v = await getVenue(data.venueId)
          if (on) setVenueName(v.venueName)
        } catch {}
      } catch (e: any) {
        if (on) setErr(e?.response?.data?.message || e?.message || '불러오기에 실패했습니다.')
      } finally {
        if (on) setLoading(false)
      }
    })()
    return () => { on = false }
  }, [id])

  const remove = async () => {
    if (!confirm('이 거래를 삭제할까요?')) return
    try {
      await deleteTransaction(id)
      nav(-1)
    } catch (e: any) {
      alert(e?.response?.data?.message || e?.message || '삭제에 실패했습니다.')
    }
  }

  const connectChat = async () => {
    if (!item) return
    try {
      const room = await connectRoomByTransaction(item.transactionId)
      nav(`/chatrooms/${room.roomId}`)
    } catch (e: any) {
      alert(e?.response?.data?.message || e?.message || '채팅방 연결 실패')
    }
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">거래 상세</h1>
        <Link to="/main" className="text-sm text-indigo-600 hover:underline">← 메인으로</Link>
      </div>

      {err && (
        <div className="mb-4 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-rose-700">
          {err}
        </div>
      )}

      {loading ? (
        <div className="h-40 rounded-xl bg-white shadow animate-pulse" />
      ) : !item ? (
        <div className="text-gray-500">데이터가 없습니다.</div>
      ) : (
        <div className="rounded-xl bg-white p-5 shadow border border-gray-100 space-y-3">
          <div className="text-sm text-gray-600">거래 ID</div>
          <div className="text-lg font-semibold">#{item.transactionId}</div>

          <div className="text-sm text-gray-600 mt-2">제목</div>
          <div className="font-medium">{item.title}</div>

          <div className="text-sm text-gray-600 mt-2">구장</div>
          <div>{venueName || `#${item.venueId}`}</div>

          <div className="text-sm text-gray-600 mt-2">모임 ID</div>
          <div>{item.meetupId}</div>

          <div className="text-sm text-gray-600 mt-2">사용자</div>
          <div>{item.userId}</div>

          <div className="text-sm text-gray-600 mt-2">가격</div>
          <div className="text-lg font-semibold">{item.price.toLocaleString()}원</div>

          <div className="text-sm text-gray-600 mt-2">거래 일시</div>
          <div>{new Date(item.tradedAt).toLocaleString()}</div>

          <div className="pt-4 flex justify-between">
            <button
              onClick={connectChat}
              className="rounded bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700"
            >
              구매(채팅 시작)
            </button>
            <button onClick={remove} className="text-rose-600 hover:underline">
              삭제
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
