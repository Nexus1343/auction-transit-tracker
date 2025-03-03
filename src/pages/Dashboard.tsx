
import { Card } from "@/components/ui/card"
import { 
  Car, 
  Calendar, 
  Truck, 
  Ship, 
  AlertTriangle,
  Clock
} from "lucide-react"
import { Link } from "react-router-dom"

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="p-6">
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-full">
              <Car className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <h3 className="font-medium text-gray-900">Total Vehicles</h3>
              <p className="text-3xl font-bold">0</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-full">
              <Calendar className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <h3 className="font-medium text-gray-900">New This Month</h3>
              <p className="text-3xl font-bold">0</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center">
            <div className="bg-yellow-100 p-3 rounded-full">
              <AlertTriangle className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <h3 className="font-medium text-gray-900">Pending Action</h3>
              <p className="text-3xl font-bold">0</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Recent Vehicles</h3>
            <Link to="/vehicles" className="text-sm text-blue-600 hover:underline">
              View all
            </Link>
          </div>
          <div className="text-center py-8 text-gray-500">
            No vehicles added yet
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Transport Status</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Truck className="h-4 w-4 text-gray-400 mr-2" />
                <span>Land Transport</span>
              </div>
              <span className="text-sm font-medium">0</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Ship className="h-4 w-4 text-gray-400 mr-2" />
                <span>Sea Transport</span>
              </div>
              <span className="text-sm font-medium">0</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Clock className="h-4 w-4 text-gray-400 mr-2" />
                <span>Awaiting Delivery</span>
              </div>
              <span className="text-sm font-medium">0</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default Dashboard
