import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { createChatRoom } from '../api/chat'

export default function ChatRoomCreatePage() {
  const nav = useNavigate()
  const [title, setTitle] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) {
      setErr('방 제목을 입력하세요.')
      return
    }
    setErr(null)
    setSubmitting(true)
    try {
      const room = await createChatRoom(title.trim())
      nav(`/chatrooms/${room.roomId}`)
    } catch (e: any) {
      setErr(e?.response?.data?.message || e?.message || '채팅방 생성에 실패했습니다.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">채팅방 만들기</h1>
        <Link to="/chatrooms" className="text-sm text-indigo-600 hover:underline">
          ← 목록으로
        </Link>
      </div>

      {err && (
        <div className="mb-4 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-rose-700">
          {err}
        </div>
      )}

      <form onSubmit={submit} className="space-y-4 rounded-xl bg-white p-5 shadow border border-gray-100">
        <label className="block">
          <div className="text-sm text-gray-600 mb-1">방 제목</div>
          <input
            className="w-full rounded border px-3 py-2"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="예) 직관 동행 방"
          />
        </label>

        <div className="pt-2 flex justify-end gap-2">
          <Link to="/chatrooms" className="rounded-lg border px-4 py-2">
            취소
          </Link>
          <button
            type="submit"
            disabled={submitting || !title.trim()}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-white disabled:opacity-50"
          >
            {submitting ? '생성 중…' : '생성'}
          </button>
        </div>
      </form>
    </div>
  )
}
