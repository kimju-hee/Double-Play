import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { fetchTeam } from '../api/teams'
import type { Team } from '../types'

export default function TeamDetailPage() {
  const { teamId } = useParams()
  const [team, setTeam] = useState<Team | null>(null)

  useEffect(() => {
    if (!teamId) return
    fetchTeam(Number(teamId)).then(setTeam).catch(console.error)
  }, [teamId])

  if (!team) return <div className="mx-auto max-w-6xl px-4 py-6">로딩 중…</div>

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <h1 className="text-xl font-bold mb-2">팀 상세</h1>
      <div className="rounded border bg-white p-4">
        <div className="text-lg font-semibold">{team.city} {team.teamName}</div>
        <div className="text-gray-600 mt-1">ID: {team.teamId}</div>
      </div>
    </div>
  )
}