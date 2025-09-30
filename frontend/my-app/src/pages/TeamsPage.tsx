import { useEffect, useState } from 'react'
import { fetchTeams } from '../api/teams'
import type { Team } from '../types'
import { Link } from 'react-router-dom'

export default function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>([])
  useEffect(() => { fetchTeams().then(setTeams).catch(console.error) }, [])
  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <h1 className="text-xl font-bold mb-4">팀 목록</h1>
      <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {teams.map(t => (
          <li key={t.teamId} className="rounded border bg-white p-4">
            <div className="font-semibold">{t.city} {t.teamName}</div>
            <Link to={`/teams/${t.teamId}`} className="text-indigo-600 text-sm hover:underline mt-2 inline-block">
              상세 보기
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}