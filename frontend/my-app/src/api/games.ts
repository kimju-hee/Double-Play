import api from './client'
import type { Game, GameDetail, ListResp } from '../types'

export async function fetchGames(params: { date?: string; teamId?: number }) {
  const { date, teamId } = params
  const { data } = await api.get<ListResp<Game>>('/api/games', {
    params: { date, teamId }
  })
  return data.items
}

export async function fetchGame(gameId: number) {
  const { data } = await api.get<GameDetail>(`/api/games/${gameId}`)
  return data
}
