
import { ChevronLeft, Check } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { VehicleDetails } from "../types/vehicleTypes"

interface VehicleHeaderProps {
  vehicle: VehicleDetails
  currentStatus: string
  statuses: string[]
  updateStatus: (status: string) => void
  getProgressPercentage: () => number
}

export const VehicleHeader = ({ 
  vehicle, 
  currentStatus, 
  statuses, 
  updateStatus,
  getProgressPercentage 
}: VehicleHeaderProps) => {
  const navigate = useNavigate()

  return (
    <div className="bg-white border-b sticky top-0 z-10">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => navigate("/vehicles")}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                {vehicle.manufacturer?.name} {vehicle.model?.name} {vehicle.year}
              </h1>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span>Stock #{vehicle.stock_number || 'N/A'}</span>
                <span>VIN: {vehicle.vin}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-600">Current Status:</span>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              {currentStatus}
            </span>
          </div>
        </div>

        <div className="mt-6 mb-4">
          <div className="relative">
            <div className="h-2 bg-gray-200 rounded-full">
              <div 
                className="h-2 bg-blue-500 rounded-full transition-all duration-300"
                style={{ width: `${getProgressPercentage()}%` }}
              />
            </div>
            <div className="flex justify-between mt-4">
              {statuses.map((status, index) => {
                const isCompleted = statuses.indexOf(currentStatus) >= index;
                const isCurrent = currentStatus === status;
                
                return (
                  <div 
                    key={status}
                    className="flex flex-col items-center relative group"
                    style={{ width: `${100 / statuses.length}%` }}
                  >
                    <button
                      onClick={() => updateStatus(status)}
                      className={`w-6 h-6 rounded-full flex items-center justify-center transition-all
                        ${isCompleted ? 'bg-blue-500' : 'bg-gray-200'}
                        ${isCurrent ? 'ring-4 ring-blue-100' : ''}
                      `}
                    >
                      {isCompleted && <Check className="w-4 h-4 text-white" />}
                    </button>
                    <span className="absolute top-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap text-xs font-medium text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">
                      {status}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
