import { useState } from 'react'
import { signup } from '../api/auth'
import { useNavigate, Link } from 'react-router-dom'

export default function SignupPage() {
  const nav = useNavigate()
  const [form, setForm] = useState({
    email: '',
    password: '',
    nickname: '',
    gender: 'F' as 'M' | 'F',
    oauth_provider: undefined as 'kakao' | undefined,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value })

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const res = await signup(form)
      console.log('signup success:', res)
      alert('회원가입이 완료되었습니다. 로그인해 주세요!')
      nav('/login')
    } catch (err: any) {
      console.error('signup error:', err)
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        '회원가입에 실패했습니다.'
      setError(msg)
    } finally {
      setLoading(false)
    }
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

      <div className="w-full max-w-6xl grid md:grid-cols-2 rounded-3xl shadow-2xl overflow-hidden bg-white/90 backdrop-blur border border-white/30">
        <div className="hidden md:flex flex-col justify-center p-12 text-white bg-gradient-to-br from-sky-600 via-blue-700 to-indigo-800">
          <h2 className="text-4xl font-extrabold leading-tight mb-6">야구 팬을 위한 최고의 커뮤니티</h2>
          <p className="text-base/7 opacity-90">
            지금 가입하고 티켓을 안전하게 거래하고,<br />
            실시간 채팅으로 팬들과 소통하며,<br />
            같이 직관 갈 사람을 찾아보세요 ⚾
          </p>
          <div className="mt-auto pt-10 text-xs opacity-80">Double-Play • 야구 커뮤니티 & 티켓 거래 플랫폼</div>
        </div>

        {/* RIGHT: 폼 */}
        <div className="p-8 md:p-12 flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-sky-500 to-indigo-600 shadow-md" />
            <div className="text-2xl font-semibold text-gray-900">Double-Play</div>
          </div>

          <h1 className="text-xl font-bold text-gray-900 mb-4">회원가입</h1>

          {error && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={submit} className="space-y-4">
            <input
              className="w-full h-11 px-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              name="email"
              placeholder="이메일"
              value={form.email}
              onChange={onChange}
            />
            <input
              className="w-full h-11 px-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              type="password"
              name="password"
              placeholder="비밀번호"
              value={form.password}
              onChange={onChange}
            />
            <input
              className="w-full h-11 px-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              name="nickname"
              placeholder="닉네임"
              value={form.nickname}
              onChange={onChange}
            />
            <select
              className="w-full h-11 px-3 rounded-lg border border-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              name="gender"
              value={form.gender}
              onChange={onChange}
            >
              <option value="F">여성</option>
              <option value="M">남성</option>
            </select>

            <button
              disabled={loading}
              className="h-11 w-full rounded-lg text-white font-medium shadow-md transition bg-[#5C7CFA] hover:bg-[#4f6def] disabled:opacity-60"
              type="submit"
            >
              {loading ? '처리 중…' : '가입'}
            </button>
          </form>

          <div className="mt-6 text-sm text-gray-600 text-center">
            이미 계정이 있으신가요? <Link to="/login" className="text-indigo-600 hover:text-indigo-800 font-medium">로그인</Link>
          </div>
        </div>
      </div>

      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 text-xs text-white/90">
        © {new Date().getFullYear()} Double-Play • Terms • Privacy
      </div>
    </div>
  )
}
