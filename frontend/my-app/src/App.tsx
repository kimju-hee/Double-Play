import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import type { ReactNode } from 'react'
import AppLayout from './layouts/AppLayout'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import MainPage from './pages/MainPage'
import { useAuth } from './store/auth'

function RequireAuth({ children }: { children: ReactNode }) {
  const accessToken = useAuth(s => s.accessToken)
  return accessToken ? <>{children}</> : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login"   element={<LoginPage />} />
        <Route path="/signup"  element={<SignupPage />} />
        <Route element={<AppLayout />}>
          <Route path="/main"     element={<RequireAuth><MainPage /></RequireAuth>} />
          <Route path="/schedule" element={<RequireAuth><div>경기 일정</div></RequireAuth>} />
          <Route path="/chat"     element={<RequireAuth><div>채팅방 리스트</div></RequireAuth>} />
          <Route path="/tickets"  element={<RequireAuth><div>티켓 거래</div></RequireAuth>} />
          <Route path="/me"       element={<RequireAuth><div>마이페이지</div></RequireAuth>} />
        </Route>
        <Route path="*" element={<Navigate to="/main" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
