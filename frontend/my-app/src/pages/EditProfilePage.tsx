import { useEffect, useState } from 'react'
import { getMe, updateUser } from '../api/users'
import { useAuth } from '../store/auth'
import { useNavigate } from 'react-router-dom'

export default function EditProfilePage() {
  const nav = useNavigate()
  const auth = useAuth()
  const [form, setForm] = useState({
    nickname: '',
    gender: 'F' as 'M' | 'F',
    role: 'USER' as 'USER' | 'ADMIN',
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ;(async () => {
      const me = await getMe()
      setForm({
        nickname: me.nickname ?? '',
        gender: (me.gender ?? 'F') as 'M' | 'F',
        role: me.role,
      })
      setLoading(false)
    })()
  }, [])

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value })

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!auth.user) return
    await updateUser(auth.user.userId, form)
    nav('/me')
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
      {/* 배경 */}
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

      {/* 카드 */}
      <div className="w-full max-w-md rounded-3xl shadow-2xl bg-white/90 backdrop-blur border border-white/30 p-10">
        <h1 className="text-2xl font-bold mb-6 text-gray-900">정보 수정</h1>

        <form onSubmit={submit} className="space-y-4">
          <input
            name="nickname"
            placeholder="닉네임"
            value={form.nickname}
            onChange={onChange}
            className="w-full h-11 px-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <select
            name="gender"
            value={form.gender}
            onChange={onChange}
            className="w-full h-11 px-3 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="F">여성</option>
            <option value="M">남성</option>
          </select>

          <select
            name="role"
            value={form.role}
            onChange={onChange}
            className="w-full h-11 px-3 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="USER">일반 사용자</option>
            <option value="ADMIN">관리자</option>
          </select>

          <button
            type="submit"
            className="h-11 w-full rounded-lg text-white font-medium shadow-md transition
                       bg-[#5C7CFA] hover:bg-[#4f6def]"
          >
            저장
          </button>
        </form>
      </div>

      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 text-xs text-white/90">
        © {new Date().getFullYear()} Double-Play • Terms • Privacy
      </div>
    </div>
  )
}
