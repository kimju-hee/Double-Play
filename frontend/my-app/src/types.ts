export type Role = 'USER' | 'ADMIN'
export type Gender = 'M' | 'F'
export type Team = { teamId: number; teamName: string; city: string }
export type Venue = { venueId: number; venueName: string }


export interface User {
  userId: number
  email: string
  nickname: string
  role: Role
  gender?: Gender
}

export type LoginResponse = {
    accessToken: string
    refreshToken: string
    user: { userId: number; nickname: string; role: string }
  }
  
  export type Game = {
    gameId: number
    date: string
    homeTeam: number
    awayTeam: number
    venueId: number
  }
  
  export type GameDetail = {
    gameId: number
    date: string
    homeTeam: number
    awayTeam: number
    venue: Venue
  }

  export type ListResp<T> = { items: T[] }
