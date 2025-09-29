import type { ReactNode } from 'react'
import Header from './Header'

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh">
      <Header />
      <main className="container py-8">{children}</main>
    </div>
  )
}
