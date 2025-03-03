
import { Routes, Route } from 'react-router-dom'
import MainLayout from './components/layout/MainLayout'
import Index from './pages/Index'
import NotFound from './pages/NotFound'
import VehiclesPage from './pages/vehicles/VehiclesPage'
import { Toaster } from './components/ui/toaster'
import './App.css'

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Index />} />
          <Route path="vehicles" element={<VehiclesPage />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
      <Toaster />
    </>
  )
}

export default App
