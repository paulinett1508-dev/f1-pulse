import { useState } from 'react'
import { Activity, Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-800 bg-f1black/95 backdrop-blur supports-[backdrop-filter]:bg-f1black/80">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:h-16">
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-f1red sm:h-6 sm:w-6" />
          <span className="text-lg font-bold tracking-tight sm:text-xl">
            F1 <span className="text-f1red">Pulse</span>
          </span>
        </div>

        {/* Desktop nav */}
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
          <span className="inline-flex items-center gap-1.5 rounded-full bg-f1red/10 px-2.5 py-1 text-[10px] font-medium text-f1red sm:px-3 sm:text-xs">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-f1red" />
            LIVE
          </span>

          {/* Mobile hamburger */}
          <button
            className="flex h-9 w-9 items-center justify-center rounded-lg text-neutral-400 transition-colors hover:bg-neutral-800 hover:text-white md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-neutral-800 md:hidden"
          >
            <div className="flex flex-col gap-1 px-4 py-3">
              {['Dashboard', 'Classificação', 'Corridas', 'Pilotos'].map((item, i) => (
                <a
                  key={item}
                  href="#"
                  className={`rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    i === 0 ? 'bg-neutral-800/50 text-white' : 'text-neutral-400 hover:bg-neutral-800/30 hover:text-white'
                  }`}
                  onClick={() => setMenuOpen(false)}
                >
                  {item}
                </a>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}
