import type { ReactNode } from 'react'
import { Header } from './Header'

interface LayoutProps {
  children: ReactNode
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-f1black">
      <Header />
      <main className="mx-auto w-full max-w-7xl flex-1 px-3 py-4 sm:px-4 sm:py-6">
        {children}
      </main>
      <footer className="border-t border-neutral-800 py-3 text-center text-[10px] text-neutral-500 sm:py-4 sm:text-xs">
        F1 Pulse &copy; {new Date().getFullYear()} — Dashboard de Fórmula 1 em tempo real
      </footer>
    </div>
  )
}
