import { Link } from 'react-router-dom'
import { Flag } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <Flag className="mb-4 h-12 w-12 text-f1red" />
      <h1 className="text-4xl font-bold">404</h1>
      <p className="mt-2 text-sm text-neutral-400">Página não encontrada</p>
      <Link
        to="/"
        className="mt-6 rounded-lg bg-f1red px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-f1red/80"
      >
        Voltar ao Dashboard
      </Link>
    </div>
  )
}
