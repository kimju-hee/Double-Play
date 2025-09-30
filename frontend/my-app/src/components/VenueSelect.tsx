import { useEffect, useState } from 'react'
import { listVenues, type Venue } from '../api/venues'

type Props = {
  value: number | null
  onChange: (v: number | null) => void
  disabled?: boolean
}

export default function VenueSelect({ value, onChange, disabled }: Props) {
  const [venues, setVenues] = useState<Venue[]>([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState<string | null>(null)

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

  if (loading) return <div className="h-10 rounded border bg-white px-3 py-2 text-gray-500">로딩 중…</div>
  if (err) return <div className="rounded border border-rose-200 bg-rose-50 px-3 py-2 text-rose-700">{err}</div>
  if (venues.length === 0) return <div className="h-10 rounded border bg-white px-3 py-2 text-gray-500">등록된 구장이 없습니다</div>

  return (
    <select
      className="w-full rounded border px-3 py-2 bg-white"
      value={value ?? ''}
      onChange={(e) => onChange(e.target.value ? Number(e.target.value) : null)}
      disabled={disabled}
    >
      <option value="">구장 선택</option>
      {venues.map(v => (
        <option key={v.venueId} value={v.venueId}>{v.venueName}</option>
      ))}
    </select>
  )
}
