
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Plus } from "lucide-react"
import { AddVehicleModal } from "@/components/vehicles/AddVehicleModal"

const VehiclesPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Vehicles</h1>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Vehicle
        </Button>
      </div>
      
      <Card className="p-6">
        <div className="text-center py-10 text-gray-500">
          No vehicles added yet. Click the "Add Vehicle" button to get started.
        </div>
      </Card>
      
      <AddVehicleModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </div>
  )
}

export default VehiclesPage
