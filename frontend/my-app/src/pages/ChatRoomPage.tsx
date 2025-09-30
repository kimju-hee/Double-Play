import { useEffect, useRef, useState, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client'
import api from '../api/client'
import { useAuth } from '../store/auth'
import { computeIsOwner } from '../api/chat'

import {
  listMembers,
  requestJoin,
  approveMember,
  rejectMember,
  getRoom,
  type MemberInfo,
  type ChatRoom,
} from '../api/chat'

type ChatMsg = {
  messageId: number
  roomId: number
  senderUserId: number
  senderNickname: string
  content: string
  sendAt: string
}

export default function ChatRoomPage() {
  const { roomId = '' } = useParams()
  const rid = Number(roomId)

  const { user } = useAuth.getState()
  const myId = user?.userId ?? 0

  // ▼ members를 먼저 선언
  const [members, setMembers] = useState<MemberInfo[]>([])
  const [loadingMembers, setLoadingMembers] = useState(false)

  const [room, setRoom] = useState<ChatRoom | null>(null)
  const isOwner = useMemo(
    () => computeIsOwner({ room, members, myId }),
    [room, members, myId]
  )

  const [messages, setMessages] = useState<ChatMsg[]>([])
  const [input, setInput] = useState('')
  const listRef = useRef<HTMLDivElement | null>(null)
  const clientRef = useRef<Client | null>(null)

  const [myStatus, setMyStatus] = useState<MemberInfo['status'] | 'NONE'>('NONE')
  const [statusErr, setStatusErr] = useState<string | null>(null)
  const canChat = useMemo(() => myStatus === 'APPROVED', [myStatus])

  useEffect(() => {
    let on = true
    ;(async () => {
      try {
        const r = await getRoom(rid)
        if (on) setRoom(r)
      } catch {}
    })()
    return () => { on = false }
  }, [rid])

  const reloadMembers = async () => {
    setLoadingMembers(true)
    try {
      const ms = await listMembers(rid)
      setMembers(ms)
      const me = ms.find(m => m.userId === myId)
      setMyStatus(me?.status ?? 'NONE')
    } finally {
      setLoadingMembers(false)
    }
  }

  useEffect(() => {
    let on = true
    ;(async () => {
      try {
        setStatusErr(null)
        const ms = await listMembers(rid)
        if (!on) return
        setMembers(ms)
        const me = ms.find(m => m.userId === myId)
        setMyStatus(me?.status ?? 'NONE')
      } catch (e: any) {
        if (on) {
          setMyStatus('NONE')
          setStatusErr(e?.response?.data?.message || e?.message || '참여 상태를 불러오지 못했습니다.')
        }
      }
    })()
    return () => { on = false }
  }, [rid, myId])

  useEffect(() => {
    if (!canChat) return
    let on = true
    ;(async () => {
      try {
        const { data } = await api.get<{ items: ChatMsg[] }>(`/api/chatrooms/${rid}/messages?limit=50`)
        const arr = [...data.items].sort((a, b) => a.messageId - b.messageId)
        if (on) setMessages(arr)
        setTimeout(() => listRef.current?.scrollTo({ top: 999999, behavior: 'auto' }), 0)
      } catch {}
    })()
    return () => { on = false }
  }, [rid, canChat])

  useEffect(() => {
    if (!canChat) return
    const sock = new SockJS('/ws-chat')
    const c = new Client({
      webSocketFactory: () => sock as any,
      reconnectDelay: 2000,
      onConnect: () => {
        c.subscribe(`/topic/chatrooms/${rid}`, (msg) => {
          const payload: ChatMsg = JSON.parse(msg.body)
          setMessages(prev => [...prev, payload])
          setTimeout(() => {
            listRef.current?.scrollTo({ top: 999999, behavior: 'smooth' })
          }, 0)
        })
      },
    })
    c.activate()
    clientRef.current = c
    return () => { c.deactivate() }
  }, [rid, canChat])

  const askJoin = async () => {
    if (!myId) {
      setStatusErr('로그인이 필요합니다.')
      return
    }
    try {
      const r = await requestJoin(rid)
      setMyStatus(r.status as any)
      setStatusErr(null)
      reloadMembers()
    } catch (e: any) {
      setStatusErr(e?.response?.data?.message || e?.message || '참여 요청에 실패했습니다.')
    }
  }

  const send = async () => {
    if (!input.trim()) return
    if (!canChat) {
      alert(myStatus === 'PENDING'
        ? '승인 대기 중입니다.'
        : '채팅 권한이 없습니다. 먼저 참여 요청을 보내세요.')
      return
    }
    try {
      await api.post(`/api/chatrooms/${rid}/messages`, { content: input.trim() })
      setInput('')
    } catch {}
  }

  const pending = useMemo(() => members.filter(m => m.status === 'PENDING'), [members])
  const [openManage, setOpenManage] = useState(false)

  const onApprove = async (uid: number) => {
    await approveMember(rid, uid)
    await reloadMembers()
  }
  const onReject = async (uid: number) => {
    await rejectMember(rid, uid)
    await reloadMembers()
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <div className="mb-3 flex items-center justify-between">
        <h1 className="text-xl font-bold">
          채팅방 #{rid} {room?.title ? <span className="text-gray-500 text-base">/ {room.title}</span> : null}
        </h1>
        {isOwner && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setOpenManage(v => !v)}
              className="rounded px-3 py-1.5 border text-sm hover:bg-gray-50"
            >
              대기자 관리 {pending.length > 0 && (
                <span className="ml-1 rounded-full px-2 py-0.5 text-xs bg-amber-600 text-white">
                  {pending.length}
                </span>
              )}
            </button>
            <Link
              to={`/chatrooms/${rid}/manage`}
              className="rounded px-3 py-1.5 bg-indigo-600 text-white text-sm"
            >
              전체 관리
            </Link>
          </div>
        )}
      </div>

      {statusErr && (
        <div className="mb-3 rounded border border-rose-200 bg-rose-50 px-3 py-2 text-rose-700">
          {statusErr}
        </div>
      )}
      {myStatus === 'NONE' && (
        <div className="mb-3 rounded border bg-amber-50 px-3 py-2 text-amber-800 flex items-center justify-between">
          <span>이 채팅방에 참여하려면 요청이 필요합니다.</span>
          <button
            onClick={askJoin}
            className="ml-2 rounded bg-amber-600 px-3 py-1 text-white text-sm"
          >
            참여 요청
          </button>
        </div>
      )}
      {myStatus === 'PENDING' && (
        <div className="mb-3 rounded border bg-sky-50 px-3 py-2 text-sky-800">
          승인 대기 중입니다. 방장의 승인을 기다려주세요.
        </div>
      )}
      {myStatus === 'BANNED' && (
        <div className="mb-3 rounded border bg-rose-50 px-3 py-2 text-rose-800">
          차단되어 채팅에 참여할 수 없습니다.
        </div>
      )}

      {isOwner && openManage && (
        <div className="mb-4 rounded-xl border bg-white p-4 shadow">
          <div className="mb-2 font-semibold">대기자 목록</div>
          {loadingMembers ? (
            <div className="text-sm text-gray-500">로딩 중…</div>
          ) : pending.length === 0 ? (
            <div className="text-sm text-gray-500">대기 중인 사용자가 없습니다.</div>
          ) : (
            <ul className="space-y-2">
              {pending.map(p => (
                <li key={p.userId} className="flex items-center justify-between">
                  <div className="text-sm">
                    {p.nickname || `User#${p.userId}`}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => onApprove(p.userId)}
                      className="rounded bg-emerald-600 text-white text-xs px-3 py-1"
                    >
                      수락
                    </button>
                    <button
                      onClick={() => onReject(p.userId)}
                      className="rounded bg-rose-600 text-white text-xs px-3 py-1"
                    >
                      거절
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <div ref={listRef} className="h-[60vh] overflow-y-auto rounded border bg-white p-3 space-y-2">
        {canChat ? (
          messages.map((m) => (
            <div key={m.messageId} className="text-sm">
              <span className="font-semibold">
                {m.senderNickname?.trim()?.length ? m.senderNickname : `User#${m.senderUserId}`}
              </span>
              : {m.content}
              <span className="ml-2 text-gray-400">
                {new Date(m.sendAt).toLocaleTimeString()}
              </span>
            </div>
          ))
        ) : (
          <div className="h-full grid place-items-center text-gray-400 text-sm">
            권한이 부여되면 채팅 내용이 표시됩니다.
          </div>
        )}
      </div>

      <div className="mt-3 flex gap-2">
        <input
          className="flex-1 rounded border px-3 py-2"
          value={input}
          onChange={(e)=>setInput(e.target.value)}
          placeholder={
            canChat ? '메시지 입력'
            : myStatus === 'PENDING' ? '승인 대기 중…'
            : '참여 요청 필요'
          }
          disabled={!canChat}
          onKeyDown={(e)=> e.key === 'Enter' && send()}
        />
        <button
          className="rounded bg-indigo-600 px-4 py-2 text-white disabled:opacity-50"
          onClick={send}
          disabled={!canChat}
        >
          보내기
        </button>
      </div>
    </div>
  )
}
