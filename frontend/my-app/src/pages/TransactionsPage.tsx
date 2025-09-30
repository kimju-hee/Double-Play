import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { fetchTransactions, type TransactionSummary } from '../api/transactions'

export default function TransactionsPage() {
  const [items, setItems] = useState<TransactionSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState<string | null>(null)
  const [sp] = useSearchParams()
  const meetupId = sp.get('meetupId') ? Number(sp.get('meetupId')) : undefined

  useEffect(() => {
    let on = true
    ;(async () => {
      setLoading(true)
      setErr(null)
      try {
        const data = await fetchTransactions(meetupId)
        if (on) setItems(data)
      } catch (e: any) {
        if (on) setErr(e?.response?.data?.message || e?.message || '목록을 불러오지 못했습니다.')
      } finally {
        if (on) setLoading(false)
      }
    })()
    return () => { on = false }
  }, [meetupId])

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">티켓 거래</h1>
        <div className="flex gap-3">
          <Link to="/main" className="rounded-lg border px-3 py-2 text-indigo-600 hover:bg-indigo-50">
            메인으로
          </Link>
          <Link to="/transactions/new" className="rounded-lg bg-indigo-600 px-4 py-2 text-white disabled:opacity-50">
            거래 등록
          </Link>
        </div>
      </div>

      {meetupId && <div className="mb-3 text-sm text-gray-600">필터: 모임 ID {meetupId}</div>}

      {err && (
        <div className="mb-4 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-rose-700">
          {err}
        </div>
      )}

      {loading ? (
        <div className="h-40 rounded-xl bg-white shadow animate-pulse" />
      ) : items.length === 0 ? (
        <div className="rounded-xl bg-white py-20 text-center text-gray-500 border">
          등록된 거래가 없습니다.
        </div>
      ) : (
        <ul className="grid gap-3">
          {items.map((it) => (
            <li key={it.transactionId} className="rounded-xl bg-white p-4 border hover:shadow-sm transition">
              <div className="flex items-center justify-between">
                <div className="font-semibold">{it.title}</div>
                <div className="text-lg font-bold">{it.price.toLocaleString()}원</div>
              </div>
              <div className="mt-1 text-sm text-gray-600">
                거래일시 {new Date(it.tradedAt).toLocaleString()} · 구장 #{it.venueId}
              </div>
              <div className="mt-2">
                <Link
                  to={`/transactions/${it.transactionId}`}
                  className="text-indigo-600 text-sm hover:underline"
                >
                  상세 보기
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
