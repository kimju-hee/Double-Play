import api from './client'
import type { ListResp, Team } from '../types'

export async function fetchTeams() {
  const { data } = await api.get<ListResp<Team>>('/api/teams')
  return data.items
}

export async function fetchTeam(teamId: number) {
  const { data } = await api.get<Team>(`/api/teams/${teamId}`)
  return data
}
