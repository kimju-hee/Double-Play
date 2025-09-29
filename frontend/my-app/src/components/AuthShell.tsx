import type { ReactNode } from 'react'

export default function AuthShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh bg-gradient-to-br from-[#fdfbfb] to-[#ebedee]">
      <div className="mx-auto max-w-6xl px-4">
        <header className="h-16 flex items-center justify-between">
          <div className="text-2xl font-semibold bg-gradient-to-r from-[#ff7a7a] via-[#ffaf7b] to-[#6a85ff] bg-clip-text text-transparent">
            Double-Play
          </div>
          <nav className="hidden sm:flex gap-3 text-sm">
            <a href="/login" className="text-gray-600 hover:text-gray-900">로그인</a>
            <a href="/signup" className="text-gray-600 hover:text-gray-900">회원가입</a>
            <a href="/me" className="text-gray-600 hover:text-gray-900">내 정보</a>
          </nav>
        </header>

        <main className="py-8">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div className="relative hidden lg:block">
              <div className="aspect-[3/5] w-[380px] rounded-[36px] shadow-2xl border bg-white mx-auto overflow-hidden">
                <div className="h-10" />
                <div className="px-6 pt-2 pb-6 space-y-4">
                  <div className="h-4 w-24 rounded bg-gray-200" />
                  <div className="h-48 rounded-xl bg-gradient-to-br from-[#ffecd2] via-[#fcb69f] to-[#a1c4fd]" />
                  <div className="grid grid-cols-3 gap-3">
                    <div className="h-20 rounded-lg bg-gray-100" />
                    <div className="h-20 rounded-lg bg-gray-100" />
                    <div className="h-20 rounded-lg bg-gray-100" />
                  </div>
                  <div className="h-10 rounded-full bg-gradient-to-r from-[#ff7a7a] via-[#ffaf7b] to-[#6a85ff]" />
                </div>
              </div>
              <div className="absolute -z-10 blur-3xl opacity-40 inset-0 bg-[radial-gradient(circle_at_20%_20%,#ff7a7a_0,transparent_40%),radial-gradient(circle_at_80%_30%,#6a85ff_0,transparent_40%),radial-gradient(circle_at_50%_90%,#ffaf7b_0,transparent_35%)]" />
            </div>
            <div className="w-full max-w-md mx-auto">{children}</div>
          </div>
        </main>

        <footer className="py-10 text-xs text-center text-gray-500">
          © {new Date().getFullYear()} Double-Play • Terms • Privacy
        </footer>
      </div>
    </div>
  )
}
