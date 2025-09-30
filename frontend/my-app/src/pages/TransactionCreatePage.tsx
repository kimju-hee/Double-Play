import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createTransaction } from '../api/transactions'
import { listVenues, type Venue } from '../api/venues'
import { useAuth } from '../store/auth'   // ✅ 추가

export default function TransactionCreatePage() {
  const nav = useNavigate()
  const auth = useAuth()                  // ✅ 로그인 유저 정보
  const [meetupId, setMeetupId] = useState<number>(12)
  const [venueId, setVenueId] = useState<number | ''>('')
  const [title, setTitle] = useState('')
  const [price, setPrice] = useState<number | ''>('')
  const [venues, setVenues] = useState<Venue[]>([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    let on = true
    ;(async () => {
      try {
        const v = await listVenues()
        if (on) setVenues(v)
      } catch (e: any) {
        if (on) setErr(e?.response?.data?.message || e?.message || '구장 목록을 불러오지 못했습니다.')
      } finally {
        if (on) setLoading(false)
      }
    })()
    return () => { on = false }
  }, [])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (venueId === '' || price === '' || title.trim() === '') {
      setErr('필수 항목을 입력하세요.')
      return
    }
    setErr(null)
    setSubmitting(true)
    try {
      const res = await createTransaction({
        meetupId,
        venueId: Number(venueId),
        title: title.trim(),
        price: Number(price),
        userId: auth.user?.userId ?? 0,   // ✅ userId 함께 전송
      })
      nav(`/transactions/${res.transactionId}`)
    } catch (e: any) {
      setErr(e?.response?.data?.message || e?.message || '등록에 실패했습니다.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">거래 등록</h1>

      {err && (
        <div className="mb-4 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-rose-700">
          {err}
        </div>
      )}

      <form onSubmit={submit} className="space-y-4 rounded-xl bg-white p-5 shadow border border-gray-100">
        <label className="block">
          <div className="text-sm text-gray-600 mb-1">모임 ID</div>
          <input
            type="number"
            className="w-full rounded border px-3 py-2"
            value={meetupId}
            onChange={e => setMeetupId(Number(e.target.value))}
          />
        </label>

        <label className="block">
          <div className="text-sm text-gray-600 mb-1">구장</div>
          {loading ? (
            <div className="h-10 rounded border bg-white px-3 py-2 text-gray-500">로딩 중…</div>
          ) : venues.length === 0 ? (
            <div className="h-10 rounded border bg-white px-3 py-2 text-gray-500">등록된 구장이 없습니다</div>
          ) : (
            <select
              className="w-full rounded border px-3 py-2 bg-white"
              value={venueId}
              onChange={e => setVenueId(e.target.value ? Number(e.target.value) : '')}
            >
              <option value="">구장 선택</option>
              {venues.map(v => (
                <option key={v.venueId} value={v.venueId}>{v.venueName}</option>
              ))}
            </select>
          )}
        </label>

        <label className="block">
          <div className="text-sm text-gray-600 mb-1">제목</div>
          <input
            className="w-full rounded border px-3 py-2"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="예) 구장 대관"
          />
        </label>

        <label className="block">
          <div className="text-sm text-gray-600 mb-1">가격</div>
          <input
            type="number"
            className="w-full rounded border px-3 py-2"
            value={price}
            onChange={e => setPrice(e.target.value ? Number(e.target.value) : '')}
          />
        </label>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={submitting || loading}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-white disabled:opacity-50"
          >
            {submitting ? '등록 중…' : '등록'}
          </button>
        </div>
      </form>
    </div>
  )
}
