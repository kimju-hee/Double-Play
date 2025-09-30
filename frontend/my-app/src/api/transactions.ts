import api from './client'

export type TransactionSummary = {
  transactionId: number
  userId: number
  title: string
  price: number
  venueId: number
  tradedAt: string
}

export type TransactionResponse = {
  transactionId: number
  meetupId: number
  userId: number
  title: string
  price: number
  venueId: number
  tradedAt: string
}

export async function createTransaction(payload: {
  meetupId: number
  userId: number
  title: string
  price: number
  venueId: number
}) {
  const { data } = await api.post<TransactionResponse>('/api/transactions', payload)
  return data
}

// ★ 컨트롤러가 List<TransactionSummary> 바로 반환하므로 {items: ...}가 아님
export async function listTransactions(meetupId: number) {
  const { data } = await api.get<TransactionSummary[]>(
    `/api/meetups/${meetupId}/transactions`
  )
  return data ?? []
}

export async function getTransaction(transactionId: number) {
  const { data } = await api.get<TransactionResponse>(`/api/transactions/${transactionId}`)
  return data
}

export async function fetchTransactions(meetupId?: number): Promise<TransactionSummary[]> {
  const { data } = await api.get<TransactionSummary[]>('/api/transactions', {
    params: meetupId ? { meetupId } : {}
  })
  return data ?? []
}

export async function deleteTransaction(
  transactionId: number,
  opts?: { requesterId?: number; isAdmin?: boolean }
) {
  const params = new URLSearchParams()
  if (opts?.requesterId) params.set('requesterId', String(opts.requesterId))
  if (opts?.isAdmin) params.set('isAdmin', String(opts.isAdmin))
  const { data } = await api.delete<boolean>(
    `/api/transactions/${transactionId}${params.toString() ? `?${params.toString()}` : ''}`
  )
  return data
}

export async function completeTransaction(id: number) {
  const { data } = await api.put<{ success: boolean; status: string }>(
    `/api/transactions/${id}/complete`
  )
  return data
}
