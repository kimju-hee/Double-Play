import { useEffect, useState } from 'react'
import { login } from '../api/auth'
import { useAuth } from '../store/auth'
import { useNavigate, Link } from 'react-router-dom'
import api from '../api/client'

export default function LoginPage() {
  const nav = useNavigate()
  const setAuth = useAuth((s) => s.setAuth)

  const [form, setForm] = useState({ email: '', password: '' })
  const [remember, setRemember] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errMsg, setErrMsg] = useState<string | null>(null)

  useEffect(() => {
    const saved = localStorage.getItem('dp_email')
    if (saved) {
      setForm((f) => ({ ...f, email: saved }))
      setRemember(true)
    }
  }, [])

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value })

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (loading) return
    setLoading(true)
    setErrMsg(null)

    const resp = await login(form)
    if (!resp.success || !resp.data) {
      setErrMsg(resp.errors?.global || '로그인에 실패했습니다.')
      setLoading(false)
      return
    }

    const { accessToken, refreshToken, user } = resp.data
    setAuth({ accessToken, refreshToken, user })
    api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`

    if (remember) localStorage.setItem('dp_email', form.email)
    else localStorage.removeItem('dp_email')

    setLoading(false)
    nav('/main', { replace: true })
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
      <div className="w-full max-w-6xl grid md:grid-cols-2 rounded-3xl shadow-2xl overflow-hidden bg-white/90 backdrop-blur border border-white/30">
        {/* LEFT */}
        <div className="hidden md:flex flex-col justify-center p-12 text-white bg-gradient-to-br from-sky-600 via-blue-700 to-indigo-800">
          <h2 className="text-4xl font-extrabold leading-tight mb-6">함께하는 야구, 더 즐겁게!</h2>
          <p className="text-base/7 opacity-90">
            티켓을 안전하게 거래하고,<br />
            실시간 채팅으로 팬들과 소통하며,<br />
            같이 직관 갈 사람을 찾아보세요 ⚾
          </p>
          <div className="mt-auto pt-10 text-xs opacity-80">Double-Play • 야구 커뮤니티 & 티켓 거래 플랫폼</div>
        </div>

        <div className="p-8 md:p-12 flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-sky-500 to-indigo-600 shadow-md" />
            <div className="text-2xl font-semibold text-gray-900">Double-Play</div>
          </div>

          <form onSubmit={submit} className="space-y-4">
            <input
              className="w-full h-11 px-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              name="email"
              placeholder="이메일"
              value={form.email}
              onChange={onChange}
              autoComplete="username"
              required
            />
            <input
              className="w-full h-11 px-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              type="password"
              name="password"
              placeholder="비밀번호"
              value={form.password}
              onChange={onChange}
              autoComplete="current-password"
              required
            />

            <label className="flex items-center gap-2 text-sm text-gray-600 select-none">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              아이디 저장
            </label>

            {errMsg && (
              <div className="text-sm text-rose-600" role="alert">
                {errMsg}
              </div>
            )}

            <button
              disabled={loading}
              className="h-11 w-full rounded-lg text-white font-medium shadow-md transition bg-[#5C7CFA] hover:bg-[#4f6def] disabled:opacity-60"
              type="submit"
            >
              {loading ? '처리 중…' : '로그인'}
            </button>
          </form>

          <div className="mt-6 flex items-center justify-center gap-6 text-sm text-gray-600">
            <Link to="/signup" className="hover:text-gray-900">회원가입하기</Link>
            <span className="text-gray-300">|</span>
            <button type="button" className="hover:text-gray-900">비밀번호 찾기</button>
          </div>
        </div>
      </div>

      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 text-xs text-white/90">
        © {new Date().getFullYear()} Double-Play • Terms • Privacy
      </div>
    </div>
  )
}