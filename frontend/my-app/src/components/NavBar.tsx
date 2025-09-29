import { NavLink, Link } from 'react-router-dom'
import { useAuth } from '../store/auth'

function cxActive({ isActive }: { isActive: boolean }) {
  return [
    'px-3 py-2 rounded-lg text-sm font-medium transition',
    isActive ? 'bg-indigo-600 text-white' : 'text-gray-700 hover:bg-gray-100'
  ].join(' ')
}

export default function NavBar() {
  const user = useAuth(s => s.user)
  const logout = useAuth(s => s.logout)

  const initials = (user?.nickname ?? '')
    .trim()
    .slice(0, 2) || 'DP'

  return (
    <header className="sticky top-0 z-40 border-b bg-white/80 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4 h-14 flex items-center gap-4">
        <Link to="/main" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-sky-500 to-indigo-600" />
          <span className="font-semibold">Double-Play</span>
        </Link>

        <nav className="ml-6 flex items-center gap-2">
          <NavLink to="/schedule" className={cxActive}>경기 일정</NavLink>
          <NavLink to="/chat" className={cxActive}>채팅</NavLink>
          <NavLink to="/tickets" className={cxActive}>티켓 거래</NavLink>
          <NavLink to="/me" className={cxActive}>마이페이지</NavLink>
        </nav>

        <div className="ml-auto flex items-center gap-3">
          {user ? (
            <>
              <div className="h-8 w-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs">
                {initials}
              </div>
              <span className="text-sm text-gray-800">{user.nickname}</span>
              {logout && (
                <button
                  onClick={logout}
                  className="text-xs px-2 py-1 rounded-md border hover:bg-gray-50"
                >
                  로그아웃
                </button>
              )}
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm text-gray-700 hover:underline">로그인</Link>
              <span className="text-gray-300">|</span>
              <Link to="/signup" className="text-sm text-gray-700 hover:underline">회원가입</Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
