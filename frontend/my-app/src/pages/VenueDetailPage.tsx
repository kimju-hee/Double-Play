import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getVenue, type Venue } from '../api/venues'

export default function VenueDetailPage() {
  const { venueId } = useParams()
  const [venue, setVenue] = useState<Venue | null>(null)

  useEffect(() => {
    if (!venueId) return
    getVenue(Number(venueId)).then(setVenue).catch(console.error)
  }, [venueId])

  if (!venue) return <div className="mx-auto max-w-6xl px-4 py-6">로딩 중…</div>

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <h1 className="text-xl font-bold mb-2">구장 상세</h1>
      <div className="rounded border bg-white p-4">
        <div className="text-lg font-semibold">{venue.venueName}</div>
        <div className="text-gray-600 mt-1">ID: {venue.venueId}</div>
      </div>
    </div>
  )
}
