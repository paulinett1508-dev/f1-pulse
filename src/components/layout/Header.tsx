import { Activity } from 'lucide-react'

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-neutral-800 bg-f1black/95 backdrop-blur supports-[backdrop-filter]:bg-f1black/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Activity className="h-6 w-6 text-f1red" />
          <span className="text-xl font-bold tracking-tight">
            F1 <span className="text-f1red">Pulse</span>
          </span>
        </div>

        <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
          <a href="#" className="text-white transition-colors hover:text-f1red">
            Dashboard
          </a>
          <a href="#" className="text-neutral-400 transition-colors hover:text-f1red">
            Classificação
          </a>
          <a href="#" className="text-neutral-400 transition-colors hover:text-f1red">
            Corridas
          </a>
          <a href="#" className="text-neutral-400 transition-colors hover:text-f1red">
            Pilotos
          </a>
        </nav>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-f1red/10 px-3 py-1 text-xs font-medium text-f1red">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-f1red" />
            LIVE
          </span>
        </div>
      </div>
    </header>
  )
}
