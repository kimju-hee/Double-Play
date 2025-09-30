import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import type { ReactNode } from 'react'

import AppLayout from './layouts/AppLayout'
import MainPage from './pages/MainPage'
import SchedulePage from './pages/SchedulePage'
import GameDetailPage from './pages/GameDetailPage'
import TeamsPage from './pages/TeamsPage'
import TeamDetailPage from './pages/TeamDetailPage'
import VenuesPage from './pages/VenuesPage'
import VenueDetailPage from './pages/VenueDetailPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'

import { useAuth } from './store/auth'

import TransactionsPage from './pages/TransactionsPage'
import TransactionDetailPage from './pages/TransactionDetailPage'
import TransactionCreatePage from './pages/TransactionCreatePage'

import ChatRoomListPage from './pages/ChatRoomListPage'
import ChatRoomCreatePage from './pages/ChatRoomCreatePage'
import ChatRoomPage from './pages/ChatRoomPage'
import ChatRoomManagePage from './pages/ChatRoomManagePage'

function RequireAuth({ children }: { children: ReactNode }) {
  const accessToken = useAuth((s) => s.accessToken)
  return accessToken ? <>{children}</> : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        <Route element={<AppLayout />}>
          <Route index element={<Navigate to="/main" replace />} />

          <Route path="/main" element={<RequireAuth><MainPage /></RequireAuth>} />
          <Route path="/schedule" element={<RequireAuth><SchedulePage /></RequireAuth>} />
          <Route path="/games/:gameId" element={<RequireAuth><GameDetailPage /></RequireAuth>} />
          <Route path="/teams" element={<RequireAuth><TeamsPage /></RequireAuth>} />
          <Route path="/teams/:teamId" element={<RequireAuth><TeamDetailPage /></RequireAuth>} />
          <Route path="/venues" element={<RequireAuth><VenuesPage /></RequireAuth>} />
          <Route path="/venues/:venueId" element={<RequireAuth><VenueDetailPage /></RequireAuth>} />

          <Route path="/transactions" element={<RequireAuth><TransactionsPage /></RequireAuth>} />
          <Route path="/transactions/new" element={<RequireAuth><TransactionCreatePage /></RequireAuth>} />
          <Route path="/transactions/:transactionId" element={<RequireAuth><TransactionDetailPage /></RequireAuth>} />
          <Route path="/meetups/:meetupId/transactions" element={<RequireAuth><TransactionsPage /></RequireAuth>} />

          <Route path="/chatrooms" element={<RequireAuth><ChatRoomListPage /></RequireAuth>} />
          <Route path="/chatrooms/new" element={<RequireAuth><ChatRoomCreatePage /></RequireAuth>} />
          <Route path="/chatrooms/:roomId" element={<RequireAuth><ChatRoomPage /></RequireAuth>} />
          <Route path="/chatrooms/:roomId/manage" element={<RequireAuth><ChatRoomManagePage /></RequireAuth>} />
          <Route path="/chatrooms/:roomId" element={<ChatRoomPage />} />

          <Route
            path="/tickets"
            element={<RequireAuth><Navigate to="/meetups/1/transactions" replace /></RequireAuth>}
          />
        </Route>

        <Route path="*" element={<Navigate to="/main" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
