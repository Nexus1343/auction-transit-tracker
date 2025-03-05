
import { Link } from 'react-router-dom'
import { Car, Users, DollarSign, LayoutDashboard, FileText } from 'lucide-react'

const Sidebar = () => {
  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Vehicles', href: '/vehicles', icon: Car },
    { name: 'Dealers', href: '/dealers', icon: Users },
    { name: 'Pricing', href: '/pricing', icon: DollarSign },
  ]

  return (
    <aside className="w-64 bg-white border-r border-gray-200">
      <div className="h-full px-3 py-4 overflow-y-auto">
        <ul className="space-y-2">
          {navigation.map((item) => (
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
