;(window as any).global = window
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'
import { useAuth } from './store/auth'
import { setAuthToken } from './api/client'

const { accessToken } = useAuth.getState()
if (accessToken) setAuthToken(accessToken)

createRoot(document.getElementById('root')!).render(<App />)
