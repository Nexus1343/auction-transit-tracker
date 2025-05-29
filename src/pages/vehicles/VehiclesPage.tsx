
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Vehicles</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your vehicle inventory and track transportation status</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Add Vehicle
        </Button>
      </div>
      
      {/* Status Filters */}
      <Card className="shadow-sm border-0 bg-white">
        <CardContent className="p-6">
          <div className="space-y-6">
            {/* Land Transportation Filters */}
            <div>
              <div className="flex items-center mb-3">
                <Truck className="w-5 h-5 text-blue-600 mr-2" />
                <h3 className="text-md font-semibold text-gray-900">Land Transportation</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {transportStatuses.land.map((status) => (
                  <button
                    key={status}
                    onClick={() => toggleFilter(status)}
                    className={`px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                      activeFilters.includes(status)
                        ? 'bg-blue-100 text-blue-800 border border-blue-200 shadow-sm'
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            {/* Sea Transportation Filters */}
            <div>
              <div className="flex items-center mb-3">
                <Ship className="w-5 h-5 text-green-600 mr-2" />
                <h3 className="text-md font-semibold text-gray-900">Sea Transportation</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {transportStatuses.sea.map((status) => (
                  <button
                    key={status}
                    onClick={() => toggleFilter(status)}
                    className={`px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                      activeFilters.includes(status)
                        ? 'bg-green-100 text-green-800 border border-green-200 shadow-sm'
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            {/* Active Filters */}
            {activeFilters.length > 0 && (
              <div className="pt-4 border-t border-gray-100">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-medium text-gray-700">Active Filters:</span>
                  {activeFilters.map((filter) => (
                    <span 
                      key={filter} 
                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1"
                    >
                      {filter}
                      <button 
                        onClick={() => toggleFilter(filter)}
                        className="text-blue-600 hover:text-blue-800 ml-1"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                  <button 
                    onClick={clearFilters}
                    className="text-xs text-gray-500 hover:text-gray-700 underline ml-2"
                  >
                    Clear all
                  </button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Vehicle Inventory Table */}
      <Card className="shadow-sm border-0 bg-white">
        <div className="px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle className="text-lg font-semibold text-gray-900">Vehicle Inventory</CardTitle>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search vehicles..."
                className="pl-9 pr-4 w-64 h-10"
              />
            </div>
            <Button variant="outline" size="sm" onClick={() => fetchVehicles()} className="h-10">
              <RotateCw className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" className="h-10">
              <Filter className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" className="h-10">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="text-center py-12 text-gray-500">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              Loading vehicles...
            </div>
          ) : filteredVehicles.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <div className="mb-4">
                <Truck className="h-12 w-12 text-gray-300 mx-auto" />
              </div>
              <p className="text-lg font-medium">No vehicles found</p>
              <p className="text-sm">Try adjusting your filters or search term.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="text-left py-3 px-6 font-medium text-gray-900 text-sm">VIN</th>
                    <th className="text-left py-3 px-6 font-medium text-gray-900 text-sm">Lot Number</th>
                    <th className="text-left py-3 px-6 font-medium text-gray-900 text-sm">Manufacturer</th>
                    <th className="text-left py-3 px-6 font-medium text-gray-900 text-sm">Model</th>
                    <th className="text-left py-3 px-6 font-medium text-gray-900 text-sm">Year</th>
                    <th className="text-left py-3 px-6 font-medium text-gray-900 text-sm">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredVehicles.map((vehicle) => (
                    <tr 
                      key={vehicle.id} 
                      className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors" 
                      onClick={() => handleRowClick(vehicle.id)}
                    >
                      <td className="py-4 px-6 text-blue-600 font-medium text-sm hover:text-blue-800">{vehicle.vin}</td>
                      <td className="py-4 px-6 text-gray-900 text-sm">{vehicle.lot_number}</td>
                      <td className="py-4 px-6 text-gray-900 text-sm">{vehicle.manufacturer?.name || "Unknown"}</td>
                      <td className="py-4 px-6 text-gray-900 text-sm">{vehicle.model?.name || "Unknown"}</td>
                      <td className="py-4 px-6 text-gray-900 text-sm">{vehicle.year}</td>
                      <td className="py-4 px-6">
                        <span className={`px-3 py-1 text-xs font-medium rounded-full ${
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
