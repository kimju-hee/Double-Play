// src/components/TransactionForm.tsx
import { useEffect, useState } from 'react'
import { createTransaction } from '../api/transactions'
import { listVenues, type Venue } from '../api/venues' // 있으면 사용

type Props = {
  meetupId: number
  userId: number
  onCreated?: (transactionId: number) => void
  venuesProp?: Venue[] // 외부에서 넘겨줄 수도 있게 선택값
}

export default function TransactionForm({ meetupId, userId, onCreated, venuesProp }: Props) {
  const [title, setTitle] = useState('')
  const [price, setPrice] = useState<number | ''>('')
  const [venueId, setVenueId] = useState<number | ''>('')
  const [venues, setVenues] = useState<Venue[]>(venuesProp ?? [])
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  // venues를 prop으로 안 주면 직접 불러오기
  useEffect(() => {
    if (venuesProp && venuesProp.length) return
    let on = true
    ;(async () => {
      try {
        const rows = await listVenues() // GET /api/venues -> {items: Venue[]}
        if (on) setVenues(rows)
      } catch (e: any) {
        // 구장 목록 실패는 필수는 아니므로 에러만 표시
        setErr(e?.message || '구장 목록을 불러오지 못했습니다.')
      }
    })()
    return () => { on = false }
  }, [venuesProp])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (loading) return

    if (!title.trim()) {
      setErr('제목을 입력해주세요.')
      return
    }
    if (price === '' || Number(price) <= 0) {
      setErr('가격을 올바르게 입력해주세요.')
      return
    }
    if (venueId === '') {
      setErr('구장을 선택해주세요.')
      return
    }

    setLoading(true)
    setErr(null)
    try {
      const res = await createTransaction({
        meetupId,
        userId,
        title: title.trim(),
        price: Number(price),
        venueId: Number(venueId),
      })
      onCreated?.(res.transactionId)
      setTitle('')
      setPrice('')
      setVenueId('')
    } catch (e: any) {
      setErr(e?.response?.data?.message || e?.message || '등록에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={submit} className="grid gap-3 md:grid-cols-[1fr_auto_auto_auto] md:items-center">
      {/* 제목 */}
      <input
        type="text"
        className="h-10 px-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        placeholder="제목 (예: 6/3 잠실 1루 네이비 2연석)"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      {/* 가격 */}
      <input
        type="number"
        min={0}
        step={1000}
        className="h-10 md:w-40 px-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        placeholder="가격(원)"
        value={price}
        onChange={(e) => setPrice(e.target.value === '' ? '' : Number(e.target.value))}
      />

      {/* 구장 선택 */}
      <select
        className="h-10 md:w-48 px-3 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        value={venueId}
        onChange={(e) => setVenueId(e.target.value === '' ? '' : Number(e.target.value))}
      >
        <option value="">구장 선택</option>
        {venues.map((v) => (
          <option key={v.venueId} value={v.venueId}>
            {v.venueName}
          </option>
        ))}
      </select>

      <button
        type="submit"
        disabled={loading}
        className="h-10 px-4 rounded-lg bg-indigo-600 text-white font-medium disabled:opacity-60"
      >
        {loading ? '등록 중…' : '거래 등록'}
      </button>

      {err && <div className="md:col-span-4 text-sm text-rose-600">{err}</div>}
    </form>
  )
}
