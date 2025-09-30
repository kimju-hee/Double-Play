import { useEffect, useRef, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAuth } from '../store/auth'
import { useChatMessagesStore } from '../store/chatMessages'
import {
  getRoom,
  fetchChatMessages,
  sendChatMessage,
  completeChat,
  listMembers,
  requestJoin,
  type MemberInfo,
  type ChatRoom as ChatRoomMeta,
} from '../api/chat'

type MyMembership = 'APPROVED' | 'PENDING' | 'BANNED' | 'NONE'

export default function ChatRoomPage() {
  const { roomId = '' } = useParams()
  const rid = Number(roomId)
  const me = useAuth(s => s.user)

  const { rooms, setMeta, addMessages } = useChatMessagesStore()
  const roomState = rooms[rid]

  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState<string | null>(null)
  const [text, setText] = useState('')
  const [members, setMembers] = useState<MemberInfo[] | null>(null)
  const [membership, setMembership] = useState<MyMembership>('NONE')

  const wsRef = useRef<WebSocket | null>(null)
  const myIdNum = Number(me?.userId ?? NaN)

  useEffect(() => {
    let on = true
    ;(async () => {
      try {
        setErr(null)
        setLoading(true)

        const meta: ChatRoomMeta = await getRoom(rid)
        setMeta(rid, meta)

        const ms = await listMembers(rid)
        if (!on) return
        setMembers(ms)

        const mine = ms.find(m => Number(m.userId) === myIdNum)
        setMembership((mine?.status as MyMembership) || 'NONE')

        const isOwnerNow =
          Number(meta?.createdByUserId) === myIdNum ||
          ms.some(m => Number(m.userId) === myIdNum && m.role === 'OWNER')

        const canView = isOwnerNow || mine?.status === 'APPROVED'
        if (canView) {
          const msgs = await fetchChatMessages(rid, roomState?.lastId || 0, 50)
          if (!on) return
          addMessages(rid, msgs)
        }
      } catch (e: any) {
        if (!on) return
        setErr(e?.response?.data?.message || e?.message || '불러오기에 실패했습니다.')
      } finally {
        if (on) setLoading(false)
      }
    })()
    return () => { on = false }
  }, [rid, myIdNum])

  useEffect(() => {
    const meta = roomState?.meta as any
    const isOwner =
      Number(meta?.createdByUserId) === Number(me?.userId) ||
      (members?.some(m => Number(m.userId) === Number(me?.userId) && m.role === 'OWNER') ?? false)

    const canRealtime = isOwner || membership === 'APPROVED'
    if (!canRealtime || !roomState) return

    const url = import.meta.env.VITE_WS_BASE_URL
    if (!url) return
    const ws = new WebSocket(`${url}/ws`)
    wsRef.current = ws
    ws.onopen = () => {
      ws.send(JSON.stringify({ type: 'SUBSCRIBE', roomId: rid, after: roomState.lastId }))
    }
    ws.onmessage = ev => {
      const p = JSON.parse(ev.data)
      if (p.type === 'MESSAGE') addMessages(rid, [p.data])
      if (p.type === 'SYSTEM' && p.data?.status) {
        const prev = rooms[rid]?.meta
        if (prev) setMeta(rid, { ...prev, status: p.data.status })
      }
    }
    return () => { ws.close() }
  }, [roomState?.lastId, membership, members?.length])

  const onClickJoin = async () => {
    try {
      await requestJoin(rid)
      setMembership('PENDING')
    } catch (e: any) {
      setErr(e?.response?.data?.message || e?.message || '참여 요청에 실패했습니다.')
    }
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!text.trim()) return
    const meta = rooms[rid]?.meta as any
    const isOwner =
      Number(meta?.createdByUserId) === Number(me?.userId) ||
      (members?.some(m => Number(m.userId) === Number(me?.userId) && m.role === 'OWNER') ?? false)
    const closed = meta?.status === 'CLOSED'
    if (closed) return
    if (!(isOwner || membership === 'APPROVED')) return
    const m = await sendChatMessage(rid, text.trim())
    addMessages(rid, [m])
    setText('')
  }

  const onComplete = async () => {
    const meta = rooms[rid]?.meta as any
    const isOwner =
      Number(meta?.createdByUserId) === Number(me?.userId) ||
      (members?.some(m => Number(m.userId) === Number(me?.userId) && m.role === 'OWNER') ?? false)
    if (!isOwner) return
    await completeChat(rid)
    const newMeta = await getRoom(rid)
    setMeta(rid, newMeta)
  }

  if (loading) return <div className="p-6">불러오는 중…</div>
  if (err) return <div className="p-6 text-rose-600">{err}</div>

  const meta = rooms[rid]?.meta as any
  const isTrade = !!meta?.transactionId
  const closed = meta?.status === 'CLOSED'
  const isOwner =
    Number(meta?.createdByUserId) === Number(me?.userId) ||
    (members?.some(m => Number(m.userId) === Number(me?.userId) && m.role === 'OWNER') ?? false)
  const canView = isOwner || membership === 'APPROVED'
  const canSend = !closed && canView

  return (
    <div className="mx-auto max-w-3xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="text-2xl font-bold">
          채팅방 #{rid}
          {isTrade && <span className="ml-2 text-xs rounded bg-amber-100 px-2 py-1">거래</span>}
          {closed && <span className="ml-2 text-xs rounded bg-gray-200 px-2 py-1">종료</span>}
        </div>
        {isTrade && isOwner && !closed && (
          <button onClick={onComplete} className="rounded bg-emerald-600 text-black px-3 py-1">
            거래 완료
          </button>
        )}
      </div>

      <div className="rounded border bg-white p-3 h-96 overflow-auto">
        {canView ? (
          roomState?.messages.map(m => (
            <div key={m.id} className="mb-2">
              <div className="text-xs text-gray-500">{m.system ? '시스템' : `User#${m.userId}`}</div>
              <div>{m.content}</div>
            </div>
          ))
        ) : (
          <div className="h-full flex items-center justify-center text-gray-400">
            권한이 부여되면 채팅 내용이 표시됩니다.
          </div>
        )}
        {closed && (
          <div className="mt-2 text-center text-sm text-gray-500">
            거래된 티켓입니다. 채팅이 종료되었습니다.
          </div>
        )}
      </div>

      {isOwner && !closed && (
        <div className="text-right mt-2">
          <Link
            to={`/chatrooms/${rid}/manage`}
            className="inline-block rounded bg-yellow-200 px-3 py-1 text-black font-semibold hover:bg-yellow-300"
          >
            참여 요청 관리 →
          </Link>
        </div>
      )}

      {!isOwner && !closed && (
        membership === 'NONE' ? (
          <div className="flex justify-end">
            <button
              onClick={onClickJoin}
              className="mt-2 rounded bg-indigo-600 px-3 py-1 text-black text-sm hover:bg-indigo-500"
            >
              참여 요청
            </button>
          </div>
        ) : membership === 'PENDING' ? (
          <div className="text-right text-sm text-gray-700">참여 요청 대기 중</div>
        ) : null
      )}

      <form onSubmit={submit} className="flex gap-2">
        <input
          className="flex-1 rounded border px-3 py-2"
          disabled={!canSend}
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder={
            closed
              ? '종료된 채팅입니다.'
              : !canView
              ? membership === 'PENDING'
                ? '승인 대기 중'
                : '참여 요청 필요'
              : '메시지를 입력하세요'
          }
        />
        <button
          disabled={!canSend || !text.trim()}
          className="rounded bg-indigo-600 text-black px-4 hover:bg-indigo-500 disabled:opacity-50"
        >
          보내기
        </button>
      </form>
    </div>
  )
}
