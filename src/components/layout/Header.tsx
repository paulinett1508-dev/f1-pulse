import { NavLink } from 'react-router-dom'
import { Activity, LayoutDashboard, Trophy, Flag, Users } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { label: 'Dashboard', to: '/', icon: LayoutDashboard },
  { label: 'Classificação', to: '/standings', icon: Trophy },
  { label: 'Corridas', to: '/races', icon: Flag },
  { label: 'Pilotos', to: '/drivers', icon: Users },
]

export function Header() {
  return (
    <>
      <header className="sticky top-0 z-50 border-b border-neutral-800 bg-f1black/95 backdrop-blur supports-[backdrop-filter]:bg-f1black/80">
        <div className="mx-auto flex h-12 max-w-7xl items-center justify-between px-3 sm:h-16 sm:px-4">
          <div className="flex items-center gap-2">
            <Activity className="h-4.5 w-4.5 text-f1red sm:h-6 sm:w-6" />
            <span className="text-base font-bold tracking-tight sm:text-xl">
              F1 <span className="text-f1red">Pulse</span>
            </span>
          </div>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium transition-all',
                    isActive
                      ? 'bg-f1red/15 text-f1red'
                      : 'text-neutral-400 hover:bg-neutral-800 hover:text-white',
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <item.icon className={cn('h-4 w-4', isActive && 'text-f1red')} />
                    {item.label}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          <span className="inline-flex items-center gap-1 rounded-full bg-f1red/10 px-2 py-0.5 text-[9px] font-medium text-f1red sm:gap-1.5 sm:px-3 sm:py-1 sm:text-xs">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-f1red" />
            LIVE
          </span>
        </div>
      </header>

      {/* Mobile Quick Bar — fixed bottom */}
      <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-neutral-800 bg-f1black/95 backdrop-blur supports-[backdrop-filter]:bg-f1black/80 md:hidden">
        <div className="mx-auto flex h-14 max-w-md items-stretch justify-around pb-[env(safe-area-inset-bottom)]">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                cn(
                  'relative flex flex-1 flex-col items-center justify-center gap-0.5 text-[10px] font-medium transition-colors',
                  isActive ? 'text-f1red' : 'text-neutral-500 active:text-neutral-300',
                )
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span className="absolute inset-x-3 top-0 h-0.5 rounded-full bg-f1red" />
                  )}
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>
    </>
  )
}
