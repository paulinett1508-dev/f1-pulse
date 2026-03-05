import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Layout } from '@/components/layout/Layout'

const Dashboard = lazy(() => import('@/pages/Dashboard'))
const Standings = lazy(() => import('@/pages/Standings'))
const Races = lazy(() => import('@/pages/Races'))
const Drivers = lazy(() => import('@/pages/Drivers'))

function PageLoader() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-neutral-700 border-t-f1red" />
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/standings" element={<Standings />} />
            <Route path="/races" element={<Races />} />
            <Route path="/drivers" element={<Drivers />} />
          </Routes>
        </Suspense>
      </Layout>
    </BrowserRouter>
  )
}

export default App
