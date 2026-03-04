import type { ReactNode } from 'react'
import { Header } from './Header'

interface LayoutProps {
  children: ReactNode
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-f1black">
      <Header />
      <main className="mx-auto w-full max-w-7xl flex-1 px-2.5 pb-6 pt-3 sm:px-4 sm:py-6">
        {children}
      </main>
      <footer className="border-t border-neutral-800 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3 text-center text-[10px] text-neutral-500 sm:py-4 sm:text-xs">
        F1 Pulse &copy; {new Date().getFullYear()}
      </footer>
    </div>
  )
}
