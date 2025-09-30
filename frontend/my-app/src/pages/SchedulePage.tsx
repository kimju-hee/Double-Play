import { useEffect, useMemo, useState } from 'react'
import { fetchGames } from '../api/games'
import { fetchTeams } from '../api/teams'
import type { Game, Team } from '../types'
import { Link } from 'react-router-dom'

export default function SchedulePage() {
  const [date, setDate] = useState<string>(() => new Date().toISOString().slice(0, 10))
  const [teamId, setTeamId] = useState<number | ''>('')
  const [teams, setTeams] = useState<Team[]>([])
  const [games, setGames] = useState<Game[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchTeams().then(setTeams).catch(console.error)
  }, [])

  useEffect(() => {
    setLoading(true)
    fetchGames({ date, teamId: teamId ? Number(teamId) : undefined })
      .then(setGames)
      .finally(() => setLoading(false))
  }, [date, teamId])

  const teamName = (id: number) => teams.find(t => t.teamId === id)?.teamName ?? `#${id}`

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <h1 className="text-xl font-bold mb-4">경기 일정</h1>

      <div className="flex gap-3 mb-6">
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="h-10 px-3 rounded border"
        />
        <select
          value={teamId}
          onChange={(e) => setTeamId(e.target.value ? Number(e.target.value) : '')}
          className="h-10 px-3 rounded border bg-white"
        >
          <option value="">전체 팀</option>
          {teams.map(t => (
            <option key={t.teamId} value={t.teamId}>{t.city} {t.teamName}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="text-gray-500">로딩 중…</div>
      ) : games.length === 0 ? (
        <div className="text-gray-500">경기가 없습니다.</div>
      ) : (
        <ul className="space-y-3">
          {games.map(g => (
            <li key={g.gameId} className="rounded border bg-white p-4 flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-500">{new Date(g.date).toLocaleString()}</div>
                <div className="font-medium mt-1">
                  {teamName(g.homeTeam)} vs {teamName(g.awayTeam)}
                </div>
              </div>
              <Link to={`/games/${g.gameId}`} className="text-indigo-600 hover:underline">자세히</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
