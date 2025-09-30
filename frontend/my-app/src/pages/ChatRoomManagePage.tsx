import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  listMembers,
  approveMember,
  rejectMember,
  kickMember,
  banMember,
  unbanMember,
  type MemberInfo,
} from '../api/chat'

export default function ChatRoomManagePage() {
  const { roomId = '' } = useParams()
  const rid = Number(roomId)
  const [members, setMembers] = useState<MemberInfo[]>([])
  const [err, setErr] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const load = async () => {
    try {
      setErr(null)
      setLoading(true)
      const data = await listMembers(rid)
      setMembers(data)
    } catch (e: any) {
      setErr(e?.response?.data?.message || e?.message || '멤버 목록을 불러오지 못했습니다.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [rid])

  const act = async (fn: () => Promise<any>) => {
    try {
      await fn()
      await load()
    } catch (e: any) {
      alert(e?.response?.data?.message || e?.message || '요청에 실패했습니다.')
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">채팅방 관리 #{rid}</h1>
        <Link to={`/chatrooms/${rid}`} className="text-indigo-600 hover:underline">← 채팅방으로</Link>
      </div>

      {err && <div className="mb-3 rounded border border-rose-200 bg-rose-50 px-3 py-2 text-rose-700">{err}</div>}
      {loading ? (
        <div className="h-24 rounded bg-white shadow animate-pulse" />
      ) : (
        <ul className="space-y-2">
          {members.map(m => (
            <li key={m.userId} className="rounded border bg-white p-3 flex items-center justify-between">
              <div>
                <div className="font-semibold">{m.nickname || `User#${m.userId}`}</div>
                <div className="text-xs text-gray-500">상태: {m.status}</div>
              </div>
              <div className="flex gap-2">
                {m.status === 'PENDING' && (
                  <>
                    <button
                      className="px-2 py-1 text-black bg-emerald-600 rounded"
                      onClick={() => act(() => approveMember(rid, m.userId))}
                    >
                      승인
                    </button>
                    <button
                      className="px-2 py-1 text-rose-600 border rounded"
                      onClick={() => act(() => rejectMember(rid, m.userId))}
                    >
                      거절
                    </button>
                  </>
                )}
                {m.status === 'APPROVED' && (
                  <>
                    <button
                      className="px-2 py-1 text-rose-600 border rounded"
                      onClick={() => act(() => kickMember(rid, m.userId))}
                    >
                      강퇴
                    </button>
                    <button
                      className="px-2 py-1 text-black bg-rose-600 rounded"
                      onClick={() => act(() => banMember(rid, m.userId))}
                    >
                      차단
                    </button>
                  </>
                )}
                {m.status === 'BANNED' && (
                  <button
                    className="px-2 py-1 text-black bg-indigo-600 rounded"
                    onClick={() => act(() => unbanMember(rid, m.userId))}
                  >
                    차단 해제
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
