
import { Link } from 'react-router-dom'
import { Car, Users, DollarSign, LayoutDashboard, UserCog } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

const Sidebar = () => {
  const { hasPermission } = useAuth();

  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard, permission: { resource: '', action: 'read' as const } },
    { name: 'Vehicles', href: '/vehicles', icon: Car, permission: { resource: 'vehicles', action: 'read' as const } },
    { name: 'Dealers', href: '/dealers', icon: Users, permission: { resource: 'dealers', action: 'read' as const } },
    { name: 'Pricing', href: '/pricing', icon: DollarSign, permission: { resource: 'pricing', action: 'read' as const } },
    { name: 'User Management', href: '/profile/users', icon: UserCog, permission: { resource: 'users', action: 'read' as const } },
  ]
  
  // Filter navigation items based on user permissions
  const filteredNavigation = navigation.filter(item => 
    !item.permission.resource || hasPermission(item.permission.resource, item.permission.action)
  );

  return (
    <aside className="w-64 bg-white border-r border-gray-200">
      <div className="h-full px-3 py-4 overflow-y-auto">
        <ul className="space-y-2">
          {filteredNavigation.map((item) => (
            <li key={item.name}>
              <Link
                to={item.href}
                className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100"
              >
                <item.icon className="w-5 h-5 text-gray-500" />
                <span className="ml-3">{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  )
}

export default Sidebar
