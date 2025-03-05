
import { Routes, Route } from 'react-router-dom'
import MainLayout from './components/layout/MainLayout'
import Index from './pages/Index'
import NotFound from './pages/NotFound'
import VehiclesPage from './pages/vehicles/VehiclesPage'
import VehicleDetailsPage from './pages/vehicles/VehicleDetailsPage'
import DealersPage from './pages/dealers/DealersPage'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import { Toaster } from './components/ui/toaster'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/auth/ProtectedRoute'
import './App.css'

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Index />} />
            <Route path="vehicles" element={<VehiclesPage />} />
            <Route path="vehicles/:id" element={<VehicleDetailsPage />} />
            <Route path="dealers" element={<DealersPage />} />
          </Route>
        </Route>
        
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </AuthProvider>
  )
}

export default App
