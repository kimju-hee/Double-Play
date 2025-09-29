import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../store/auth'

export default function Header() {
  const { user, clear } = useAuth()
  const nav = useNavigate()
  const logout = () => { clear(); nav('/login') }
  const tab = ({ isActive }: { isActive: boolean }) =>
    isActive ? 'navlink navlink-active' : 'navlink'

  return (
    <header className="border-b bg-white">
      <div className="container flex h-16 items-center justify-between">
        <button onClick={() => nav('/')} className="text-xl font-bold">Double-Play</button>
        <nav className="flex items-center gap-2">
          <NavLink to="/login" className={tab}>로그인</NavLink>
          <NavLink to="/signup" className={tab}>회원가입</NavLink>
          <NavLink to="/me" className={tab}>내 정보</NavLink>
        </nav>
        <div className="flex items-center gap-2">
          {user ? (
            <>
              <span className="hidden sm:inline text-sm text-gray-600">{user.nickname}</span>
              <button className="btn" onClick={logout}>로그아웃</button>
            </>
          ) : (
            <button className="btn" onClick={() => nav('/login')}>시작하기</button>
          )}
        </div>
      </div>
    </header>
  )
}
