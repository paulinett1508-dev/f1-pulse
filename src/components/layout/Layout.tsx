import type { ReactNode } from 'react'
import { Header } from './Header'

interface LayoutProps {
  children: ReactNode
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-f1black">
      <Header />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6">
        {children}
      </main>
      <footer className="border-t border-neutral-800 py-4 text-center text-xs text-neutral-500">
        F1 Pulse &copy; {new Date().getFullYear()} — Dashboard de Fórmula 1 em tempo real
      </footer>
    </div>
  )
}
