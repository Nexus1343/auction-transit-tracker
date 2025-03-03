
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus } from "lucide-react"
import { AddVehicleModal } from "@/components/vehicles/AddVehicleModal"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"

// Define the Vehicle type based on what we need to display
interface Vehicle {
  id: number
  vin: string
  lot_number: string
  year: number
  manufacturer: {
    name: string
  }
  model: {
    name: string
  }
}

const VehiclesPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()
  
  // Function to fetch vehicles
  const fetchVehicles = async () => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase
        .from('vehicles')
        .select(`
          id,
          vin,
          lot_number,
          year,
          manufacturer:manufacturer_id(name),
          model:model_id(name)
        `)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      
      setVehicles(data || [])
    } catch (error) {
      console.error('Error fetching vehicles:', error)
      toast({
        title: "Error",
        description: "Failed to load vehicles. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }
  
  // Fetch vehicles on component mount
  useEffect(() => {
    fetchVehicles()
  }, [])
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Vehicles</h1>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Vehicle
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Vehicle Inventory</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-6">Loading vehicles...</div>
          ) : vehicles.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              No vehicles added yet. Click the "Add Vehicle" button to get started.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-muted border-b">
                    <th className="text-left py-3 px-4 font-medium">VIN</th>
                    <th className="text-left py-3 px-4 font-medium">Lot Number</th>
                    <th className="text-left py-3 px-4 font-medium">Manufacturer</th>
                    <th className="text-left py-3 px-4 font-medium">Model</th>
                    <th className="text-left py-3 px-4 font-medium">Year</th>
                  </tr>
                </thead>
                <tbody>
                  {vehicles.map((vehicle) => (
                    <tr key={vehicle.id} className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4">{vehicle.vin}</td>
                      <td className="py-3 px-4">{vehicle.lot_number}</td>
                      <td className="py-3 px-4">{vehicle.manufacturer?.name || "Unknown"}</td>
                      <td className="py-3 px-4">{vehicle.model?.name || "Unknown"}</td>
                      <td className="py-3 px-4">{vehicle.year}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
      
      <AddVehicleModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onVehicleAdded={fetchVehicles}
      />
    </div>
  )
}

export default VehiclesPage
