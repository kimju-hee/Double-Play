import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { fetchGame } from '../api/games'
import type { GameDetail } from '../types'
import { fetchTeams } from '../api/teams'
import type { Team } from '../types'

export default function GameDetailPage() {
  const { gameId } = useParams()
  const [game, setGame] = useState<GameDetail | null>(null)
  const [teams, setTeams] = useState<Team[]>([])

  useEffect(() => { fetchTeams().then(setTeams) }, [])
  useEffect(() => {
    if (!gameId) return
    fetchGame(Number(gameId)).then(setGame).catch(console.error)
  }, [gameId])

  if (!game) return <div className="mx-auto max-w-6xl px-4 py-6">로딩 중…</div>

  const teamName = (id: number) => teams.find(t => t.teamId === id)?.teamName ?? `#${id}`

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <h1 className="text-xl font-bold mb-2">경기 상세</h1>
      <div className="rounded border bg-white p-4">
        <div className="text-sm text-gray-500">{new Date(game.date).toLocaleString()}</div>
        <div className="text-lg font-semibold mt-1">
          {teamName(game.homeTeam)} vs {teamName(game.awayTeam)}
        </div>
        <div className="mt-2 text-gray-700">구장: {game.venue.venueName}</div>
      </div>
    </div>
  )
}
