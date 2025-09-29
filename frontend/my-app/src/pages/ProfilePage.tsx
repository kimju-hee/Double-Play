import { useEffect, useState } from 'react'
import { getMe, deleteUser } from '../api/users'
import { useAuth } from '../store/auth'
import { Link, useNavigate } from 'react-router-dom'
import type { User } from '../types'

export default function ProfilePage() {
  const nav = useNavigate()
  const auth = useAuth()
  const [me, setMe] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ;(async () => {
      try {
        const u = await getMe()
        setMe(u)
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const remove = async () => {
    if (!auth.user) return
    const r = await deleteUser(auth.user.userId)
    if (r.success) {
      auth.clear()
      nav('/login')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-400 via-indigo-500 to-fuchsia-500 text-white">
        로딩중...
      </div>
    )
  }

  return (
    <div className="relative min-h-screen w-screen overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-sky-400 via-indigo-500 to-fuchsia-500" />
      <div
        className="pointer-events-none absolute inset-0 -z-10 blur-3xl opacity-40"
        style={{
          backgroundImage:
            'radial-gradient(40rem 40rem at 10% 15%, rgba(255,255,255,.5), transparent),' +
            'radial-gradient(30rem 30rem at 90% 20%, rgba(255,255,255,.25), transparent),' +
            'radial-gradient(25rem 25rem at 50% 90%, rgba(255,255,255,.25), transparent)',
        }}
      />

      <div className="w-full max-w-3xl rounded-3xl shadow-2xl bg-white/90 backdrop-blur border border-white/30 p-10">
        <h1 className="text-2xl font-bold mb-6 text-gray-900">내 정보</h1>

        <div className="bg-gray-100 rounded-lg p-6 mb-6 text-sm text-gray-700">
          <pre className="whitespace-pre-wrap break-words">
            {JSON.stringify(me, null, 2)}
          </pre>
        </div>

        <div className="flex gap-4">
          <Link
            to="/me/edit"
            className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition"
          >
            정보 수정
          </Link>
          <button
            onClick={remove}
            className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
          >
            회원 삭제
          </button>
        </div>
      </div>

      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 text-xs text-white/90">
        © {new Date().getFullYear()} Double-Play • Terms • Privacy
      </div>
    </div>
  )
}
