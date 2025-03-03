
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Plus,
  Search,
  Filter,
  Download,
  RotateCw,
  Ship,
  Truck,
  X
} from "lucide-react"
import { AddVehicleModal } from "@/components/vehicles/AddVehicleModal"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { useNavigate } from "react-router-dom"
import { Input } from "@/components/ui/input"

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
  current_status?: string
}

const VehiclesPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeFilters, setActiveFilters] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const { toast } = useToast()
  const navigate = useNavigate()
  
  // Status categories
  const transportStatuses = {
    land: [
      'At Auction',
      'Ready to List',
      'Listed on Central',
      'Assigned',
      'Picked Up',
      'Delivered to Sail Warehouse'
    ],
    sea: [
      'Loaded',
      'Sailed',
      'Delivered to Destination Port',
      'Delivered'
    ]
  }
  
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
          model:model_id(name),
          current_status_id,
          status_types:current_status_id(name)
        `)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      
      // Transform data to include status name from status_types
      const transformedData = data.map(vehicle => ({
        ...vehicle,
        current_status: vehicle.status_types?.name || 'Unknown'
      }))
      
      console.log("Fetched vehicles:", transformedData)
      setVehicles(transformedData)
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
  
  // Toggle filter
  const toggleFilter = (status: string) => {
    if (activeFilters.includes(status)) {
      setActiveFilters(activeFilters.filter(filter => filter !== status))
    } else {
      setActiveFilters([...activeFilters, status])
    }
  }

  // Clear all filters
  const clearFilters = () => {
    setActiveFilters([])
  }
  
  // Filter vehicles based on active filters and search term
  const filteredVehicles = vehicles.filter(vehicle => {
    // For debugging
    console.log("Filtering vehicle:", vehicle, "Current status:", vehicle.current_status)
    console.log("Active filters:", activeFilters)
    
    // Match filters: if no filters are selected or the vehicle status is in the selected filters
    const matchesFilter = activeFilters.length === 0 || 
      (vehicle.current_status && activeFilters.includes(vehicle.current_status))
    
    // Match search term
    const matchesSearch = !searchTerm || 
      (vehicle.vin && vehicle.vin.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (vehicle.lot_number && vehicle.lot_number.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (vehicle.manufacturer?.name && vehicle.manufacturer.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (vehicle.model?.name && vehicle.model.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (vehicle.year && vehicle.year.toString().includes(searchTerm))
    
    return matchesFilter && matchesSearch
  })
  
  const handleRowClick = (vehicleId: number) => {
    navigate(`/vehicles/${vehicleId}`)
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Vehicles</h1>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Vehicle
        </Button>
      </div>
      
      {/* Status Filters */}
      <Card className="shadow-sm">
        <CardContent className="p-6">
          <div className="space-y-4">
            {/* Land Transportation Filters */}
            <div>
              <div className="flex items-center mb-2">
                <Truck className="w-5 h-5 text-gray-500 mr-2" />
                <h3 className="text-md font-semibold text-gray-700">Land Transportation</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {transportStatuses.land.map((status) => (
                  <button
                    key={status}
                    onClick={() => toggleFilter(status)}
                    className={`px-3 py-1 text-sm font-medium rounded-full transition-colors ${
                      activeFilters.includes(status)
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            {/* Sea Transportation Filters */}
            <div>
              <div className="flex items-center mb-2">
                <Ship className="w-5 h-5 text-gray-500 mr-2" />
                <h3 className="text-md font-semibold text-gray-700">Sea Transportation</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {transportStatuses.sea.map((status) => (
                  <button
                    key={status}
                    onClick={() => toggleFilter(status)}
                    className={`px-3 py-1 text-sm font-medium rounded-full transition-colors ${
                      activeFilters.includes(status)
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            {/* Active Filters */}
            {activeFilters.length > 0 && (
              <div className="flex items-center mt-4">
                <span className="text-sm font-medium text-gray-500 mr-2">Active Filters:</span>
                <div className="flex flex-wrap gap-2">
                  {activeFilters.map((filter) => (
                    <span 
                      key={filter} 
                      className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium flex items-center"
                    >
                      {filter}
                      <button 
                        onClick={() => toggleFilter(filter)}
                        className="ml-1 text-blue-600 hover:text-blue-800"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                  <button 
                    onClick={clearFilters}
                    className="text-xs text-gray-500 hover:text-gray-700 underline"
                  >
                    Clear all
                  </button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <div className="p-4 border-b flex items-center justify-between">
          <CardTitle>Vehicle Inventory</CardTitle>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search vehicles..."
                className="pl-9 pr-4 w-64"
              />
            </div>
            <Button variant="outline" size="icon" className="h-10 w-10" onClick={() => fetchVehicles()}>
              <RotateCw className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="h-10 w-10">
              <Filter className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="h-10 w-10">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="text-center py-6">Loading vehicles...</div>
          ) : filteredVehicles.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              No vehicles match your criteria. Try adjusting your filters or search term.
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
                    <th className="text-left py-3 px-4 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredVehicles.map((vehicle) => (
                    <tr 
                      key={vehicle.id} 
                      className="border-b hover:bg-muted/50 cursor-pointer" 
                      onClick={() => handleRowClick(vehicle.id)}
                    >
                      <td className="py-3 px-4 text-blue-600 font-medium">{vehicle.vin}</td>
                      <td className="py-3 px-4">{vehicle.lot_number}</td>
                      <td className="py-3 px-4">{vehicle.manufacturer?.name || "Unknown"}</td>
                      <td className="py-3 px-4">{vehicle.model?.name || "Unknown"}</td>
                      <td className="py-3 px-4">{vehicle.year}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          transportStatuses.land.includes(vehicle.current_status || '')
                            ? 'bg-blue-100 text-blue-800'
                            : transportStatuses.sea.includes(vehicle.current_status || '')
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                        }`}>
                          {vehicle.current_status || 'Unknown'}
                        </span>
                      </td>
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
