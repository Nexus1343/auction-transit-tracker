
import { Link } from 'react-router-dom'
import { UserCircle } from 'lucide-react'

const Navbar = () => {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="font-bold text-xl text-blue-600">
                AmeriCars
              </Link>
            </div>
          </div>
          <div className="flex items-center">
            <button className="p-2 rounded-full hover:bg-gray-100">
              <UserCircle className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Navbar
