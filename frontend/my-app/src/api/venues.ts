import api from './client'

export type Venue = { venueId: number; venueName: string }

function normalizeVenues(raw: unknown): Venue[] {
    const arr =
      Array.isArray(raw) ? raw :
      Array.isArray((raw as any)?.items) ? (raw as any).items :
      Array.isArray((raw as any)?.data?.items) ? (raw as any).data.items :
      Array.isArray((raw as any)?.content) ? (raw as any).content :
      Array.isArray((raw as any)?.results) ? (raw as any).results : []
  
    return (arr as unknown[])
      .map((v) => {
        const obj = v as Record<string, unknown>
        return {
          venueId: Number(obj.venueId ?? obj.id ?? obj.venue_id),
          venueName: String(obj.venueName ?? obj.name ?? obj.venue_name ?? ''),
        }
      })
      .filter(v => Number.isFinite(v.venueId) && v.venueName.length > 0)
  }
  

export async function listVenues(): Promise<Venue[]> {
  const { data } = await api.get('/api/venues')
  return normalizeVenues(data)
}

export async function getVenue(venueId: number): Promise<Venue> {
  const { data } = await api.get(`/api/venues/${venueId}`)
  return {
    venueId: Number(data?.venueId ?? data?.id ?? data?.venue_id),
    venueName: String(data?.venueName ?? data?.name ?? data?.venue_name ?? ''),
  }
}
