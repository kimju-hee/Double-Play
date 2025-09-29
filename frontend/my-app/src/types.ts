export type Role = 'USER' | 'ADMIN'
export type Gender = 'M' | 'F'

export interface User {
  userId: number
  email: string
  nickname: string
  role: Role
  gender?: Gender
}

// src/types.ts
export type LoginResponse = {
    accessToken: string
    refreshToken: string
    user: { userId: number; nickname: string; role: string }
  }
  