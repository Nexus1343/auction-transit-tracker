
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"

export const VehicleNotFound = () => {
  const navigate = useNavigate()
  
  return (
    <div className="text-center py-10">
      <p className="text-lg text-gray-500">Vehicle not found.</p>
      <Button 
        variant="outline" 
        onClick={() => navigate("/vehicles")}
        className="mt-4"
      >
        Back to Vehicles
      </Button>
    </div>
  )
}
