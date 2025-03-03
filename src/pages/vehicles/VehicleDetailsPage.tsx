
import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"

interface VehicleDetails {
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
  // Add other fields as needed
}

const VehicleDetailsPage = () => {
  const { id } = useParams<{ id: string }>()
  const [vehicle, setVehicle] = useState<VehicleDetails | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()
  const { toast } = useToast()

  useEffect(() => {
    const fetchVehicleDetails = async () => {
      if (!id) return
      
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
          .eq('id', id)
          .single()
        
        if (error) throw error
        
        setVehicle(data)
      } catch (error) {
        console.error('Error fetching vehicle details:', error)
        toast({
          title: "Error",
          description: "Failed to load vehicle details. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchVehicleDetails()
  }, [id, toast])

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={() => navigate("/vehicles")}
          className="h-10 w-10"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">
          Vehicle Details {vehicle ? `- ${vehicle.manufacturer?.name} ${vehicle.model?.name}` : ''}
        </h1>
      </div>
      
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <p>Loading vehicle details...</p>
        </div>
      ) : vehicle ? (
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">VIN</dt>
                  <dd className="text-lg">{vehicle.vin}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Lot Number</dt>
                  <dd className="text-lg">{vehicle.lot_number}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Manufacturer</dt>
                  <dd className="text-lg">{vehicle.manufacturer?.name || "Unknown"}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Model</dt>
                  <dd className="text-lg">{vehicle.model?.name || "Unknown"}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Year</dt>
                  <dd className="text-lg">{vehicle.year}</dd>
                </div>
              </dl>
            </CardContent>
          </Card>
          
          {/* You can add more cards here for additional sections of vehicle data */}
        </div>
      ) : (
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
      )}
    </div>
  )
}

export default VehicleDetailsPage
