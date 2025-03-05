
import { Routes, Route } from 'react-router-dom'
import MainLayout from './components/layout/MainLayout'
import Index from './pages/Index'
import NotFound from './pages/NotFound'
import VehiclesPage from './pages/vehicles/VehiclesPage'
import VehicleDetailsPage from './pages/vehicles/VehicleDetailsPage'
import DealersPage from './pages/dealers/DealersPage'
import PricingPage from './pages/pricing/PricingPage'
import ProfilePage from './pages/profile/ProfilePage'
import UserManagementPage from './pages/profile/UserManagementPage'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import { Toaster } from './components/ui/toaster'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/auth/ProtectedRoute'
import RoleBasedRoute from './components/auth/RoleBasedRoute'
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
            
            {/* Routes accessible by all logged-in users */}
            <Route element={<RoleBasedRoute resource="vehicles" requiredAction="read" />}>
              <Route path="vehicles" element={<VehiclesPage />} />
              <Route path="vehicles/:id" element={<VehicleDetailsPage />} />
            </Route>
            
            <Route element={<RoleBasedRoute resource="profile" requiredAction="read" />}>
              <Route path="profile" element={<ProfilePage />} />
            </Route>
            
            {/* Admin-only routes */}
            <Route element={<RoleBasedRoute resource="dealers" requiredAction="read" />}>
              <Route path="dealers" element={<DealersPage />} />
            </Route>
            
            <Route element={<RoleBasedRoute resource="pricing" requiredAction="read" />}>
              <Route path="pricing" element={<PricingPage />} />
            </Route>
            
            <Route element={<RoleBasedRoute resource="users" requiredAction="read" />}>
              <Route path="profile/users" element={<UserManagementPage />} />
            </Route>
          </Route>
        </Route>
        
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </AuthProvider>
  )
}

export default App
