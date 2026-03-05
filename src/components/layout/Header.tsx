import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { Activity, Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

const navItems = [
  { label: 'Dashboard', to: '/' },
  { label: 'Classificação', to: '/standings' },
  { label: 'Corridas', to: '/races' },
  { label: 'Pilotos', to: '/drivers' },
]

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-800 bg-f1black/95 backdrop-blur supports-[backdrop-filter]:bg-f1black/80">
      <div className="mx-auto flex h-12 max-w-7xl items-center justify-between px-3 sm:h-16 sm:px-4">
        <div className="flex items-center gap-2">
          <Activity className="h-4.5 w-4.5 text-f1red sm:h-6 sm:w-6" />
          <span className="text-base font-bold tracking-tight sm:text-xl">
            F1 <span className="text-f1red">Pulse</span>
          </span>
        </div>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                cn('transition-colors hover:text-f1red', isActive ? 'text-white' : 'text-neutral-400')
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-full bg-f1red/10 px-2 py-0.5 text-[9px] font-medium text-f1red sm:gap-1.5 sm:px-3 sm:py-1 sm:text-xs">
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
            <div className="flex flex-col gap-0.5 px-3 py-2">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      'rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-neutral-800/50 text-white'
                        : 'text-neutral-400 hover:bg-neutral-800/30 hover:text-white',
                    )
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}
