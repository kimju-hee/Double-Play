import { useEffect, useState } from 'react'
import { listVenues, type Venue } from '../api/venues'
import { Link } from 'react-router-dom'

export default function VenuesPage() {
  const [venues, setVenues] = useState<Venue[]>([])
  useEffect(() => { listVenues().then(setVenues).catch(console.error) }, [])
  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <h1 className="text-xl font-bold mb-4">구장 목록</h1>
      <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {venues.map(v => (
          <li key={v.venueId} className="rounded border bg-white p-4">
            <div className="font-semibold">{v.venueName}</div>
            <Link to={`/venues/${v.venueId}`} className="text-indigo-600 text-sm hover:underline mt-2 inline-block">
              상세 보기
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
