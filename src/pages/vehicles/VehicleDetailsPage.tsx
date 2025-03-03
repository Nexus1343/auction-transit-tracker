import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  ChevronLeft, 
  Car,
  FileText,
  Ship,
  Users,
  Camera,
  Clock,
  Check,
  Upload,
  AlertCircle,
  Plus,
  X,
  MapPin
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { useForm } from "react-hook-form"

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
  stock_number?: string
  body_type_id?: number
  has_key?: boolean
  destination?: string
  client_name?: string
  client_phone_number?: string
  client_passport_number?: string
  address?: string
  city?: string
  state?: string
  zip_code?: string
  receiver_port_id?: number
  warehouse_id?: number
  gate_pass_pin?: string
  is_sublot?: boolean
}

interface StatusHistoryEvent {
  date: string
  user: string
  action: string
}

const VehicleDetailsPage = () => {
  const { id } = useParams<{ id: string }>()
  const [vehicle, setVehicle] = useState<VehicleDetails | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const navigate = useNavigate()
  const { toast } = useToast()
  const [history, setHistory] = useState<StatusHistoryEvent[]>([])
  
  const statuses = [
    'At Auction',
    'Ready to List',
    'Listed on Central',
    'Assigned',
    'Picked Up',
    'Delivered',
    'Sail Warehouse',
    'Loaded',
    'Sailed',
    'Delivered to Dest Port',
    'Delivered'
  ]
  
  const [currentStatus, setCurrentStatus] = useState(statuses[0])
  
  const [sectionsData, setSectionsData] = useState({
    transport: null,
    dealer: null,
    documents: null
  })

  const form = useForm({
    defaultValues: {
      vin: "",
      lot_number: "",
      stock_number: "",
      year: 0,
      destination: "",
      client_name: "",
      client_phone_number: "",
      client_passport_number: "",
      address: "",
      city: "",
      state: "",
      zip_code: "",
      receiver_port_id: 0,
      warehouse_id: 0,
      gate_pass_pin: "",
      is_sublot: false
    }
  })
  
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
            stock_number,
            year,
            destination,
            client_name,
            client_phone_number,
            client_passport_number,
            address,
            city,
            state,
            zip_code,
            receiver_port_id,
            warehouse_id,
            gate_pass_pin,
            is_sublot,
            manufacturer:manufacturer_id(name),
            model:model_id(name)
          `)
          .eq('id', parseInt(id))
          .single()
        
        if (error) throw error
        
        setVehicle(data)
        
        form.reset({
          vin: data.vin || "",
          lot_number: data.lot_number || "",
          stock_number: data.stock_number || "",
          year: data.year || 0,
          destination: data.destination || "",
          client_name: data.client_name || "",
          client_phone_number: data.client_phone_number || "",
          client_passport_number: data.client_passport_number || "",
          address: data.address || "",
          city: data.city || "",
          state: data.state || "",
          zip_code: data.zip_code || "",
          receiver_port_id: data.receiver_port_id || 0,
          warehouse_id: data.warehouse_id || 0,
          gate_pass_pin: data.gate_pass_pin || "",
          is_sublot: data.is_sublot || false
        })

        if (data.destination) {
          setSectionsData(prev => ({...prev, transport: {}}))
        }
        
        if (data.client_name || data.client_phone_number || data.client_passport_number) {
          setSectionsData(prev => ({...prev, dealer: {}}))
        }
        
        supabase
          .from('vehicle_status_history')
          .select(`
            id,
            created_at,
            notes,
            status_id,
            changed_by
          `)
          .eq('vehicle_id', parseInt(id))
          .order('created_at', { ascending: false })
          .then(({ data: historyData, error: historyError }) => {
            if (!historyError && historyData) {
              const formattedHistory = historyData.map(item => ({
                date: new Date(item.created_at).toLocaleString(),
                user: "Admin", // Replace with actual user when available
                action: item.notes || "Status updated"
              }))
              setHistory(formattedHistory)
            }
          })
          .catch(error => {
            console.error('Error fetching history:', error)
          })
        
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
  }, [id, toast, form])

  const onSubmit = async (data: any) => {
    if (!vehicle) return
    
    setIsSaving(true)
    try {
      const { error } = await supabase
        .from('vehicles')
        .update({
          vin: data.vin,
          lot_number: data.lot_number,
          stock_number: data.stock_number,
          year: data.year,
          destination: data.destination,
          client_name: data.client_name,
          client_phone_number: data.client_phone_number,
          client_passport_number: data.client_passport_number,
          address: data.address,
          city: data.city,
          state: data.state,
          zip_code: data.zip_code,
          receiver_port_id: data.receiver_port_id,
          warehouse_id: data.warehouse_id,
          gate_pass_pin: data.gate_pass_pin,
          is_sublot: data.is_sublot
        })
        .eq('id', vehicle.id)
      
      if (error) throw error
      
      await supabase
        .from('vehicle_status_history')
        .insert({
          vehicle_id: vehicle.id,
          notes: "Vehicle details updated",
          created_at: new Date().toISOString()
        })
        .then(({ data, error }) => {
          if (error) {
            console.error('Error updating history:', error)
            return null
          }
          
          return supabase
            .from('vehicle_status_history')
            .select(`
              id,
              created_at,
              notes,
              status_id,
              changed_by
            `)
            .eq('vehicle_id', vehicle.id)
            .order('created_at', { ascending: false })
        })
        .then(result => {
          if (!result) return
          
          const { data: historyData, error: historyError } = result
          
          if (historyError) {
            console.error('Error refreshing history:', historyError)
            return
          }
          
          if (historyData) {
            const formattedHistory = historyData.map(item => ({
              date: new Date(item.created_at).toLocaleString(),
              user: "Admin", // Replace with actual user when available
              action: item.notes || "Status updated"
            }))
            setHistory(formattedHistory)
          }
        })
        .catch(error => {
          console.error('Error in promise chain:', error)
        })
      
      toast({
        title: "Success",
        description: "Vehicle details updated successfully.",
      })
      
    } catch (error) {
      console.error('Error updating vehicle details:', error)
      toast({
        title: "Error",
        description: "Failed to update vehicle details. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const updateStatus = async (newStatus: string) => {
    if (!vehicle) return

    setCurrentStatus(newStatus)
    
    try {
      await supabase
        .from('vehicle_status_history')
        .insert({
          vehicle_id: vehicle.id,
          notes: `Changed status to "${newStatus}"`,
          created_at: new Date().toISOString()
        })
        .then(({ data, error }) => {
          if (error) {
            console.error('Error updating history:', error)
            return null
          }
          
          return supabase
            .from('vehicle_status_history')
            .select(`
              id,
              created_at,
              notes,
              status_id,
              changed_by
            `)
            .eq('vehicle_id', vehicle.id)
            .order('created_at', { ascending: false })
        })
        .then(result => {
          if (!result) return
          
          const { data: historyData, error: historyError } = result
          
          if (historyError) {
            console.error('Error refreshing history:', historyError)
            return
          }
          
          if (historyData) {
            const formattedHistory = historyData.map(item => ({
              date: new Date(item.created_at).toLocaleString(),
              user: "Admin", // Replace with actual user when available
              action: item.notes || "Status updated"
            }))
            setHistory(formattedHistory)
          }
        })
        .catch(error => {
          console.error('Error in promise chain:', error)
        })
      
      toast({
        title: "Status Updated",
        description: `Vehicle status changed to ${newStatus}`,
      })
    } catch (error) {
      console.error('Error updating status:', error)
      toast({
        title: "Error",
        description: "Failed to update status. Please try again.",
        variant: "destructive",
      })
    }
  }

  const getProgressPercentage = () => {
    const currentIndex = statuses.indexOf(currentStatus);
    return ((currentIndex + 1) / statuses.length) * 100;
  }

  const addSection = (section: keyof typeof sectionsData) => {
    setSectionsData(prev => ({
      ...prev,
      [section]: {}
    }));
    
    if (vehicle) {
      supabase
        .from('vehicle_status_history')
        .insert({
          vehicle_id: vehicle.id,
          notes: `Added ${section} information`,
          created_at: new Date().toISOString()
        })
        .then(({ data, error }) => {
          if (error) {
            console.error('Error updating history:', error)
            return null
          }
          
          return supabase
            .from('vehicle_status_history')
            .select(`
              id,
              created_at,
              notes,
              status_id,
              changed_by
            `)
            .eq('vehicle_id', vehicle.id)
            .order('created_at', { ascending: false })
        })
        .then(result => {
          if (!result) return
          
          const { data: historyData, error: historyError } = result
          
          if (historyError) {
            console.error('Error refreshing history:', historyError)
            return
          }
          
          if (historyData) {
            const formattedHistory = historyData.map(item => ({
              date: new Date(item.created_at).toLocaleString(),
              user: "Admin", // Replace with actual user when available
              action: item.notes || "Status updated"
            }))
            setHistory(formattedHistory)
          }
        })
        .catch(error => {
          console.error('Error in promise chain:', error)
        })
    }
  }

  const removeSection = (section: keyof typeof sectionsData) => {
    setSectionsData(prev => ({
      ...prev,
      [section]: null
    }));
    
    if (vehicle) {
      supabase
        .from('vehicle_status_history')
        .insert({
          vehicle_id: vehicle.id,
          notes: `Removed ${section} information`,
          created_at: new Date().toISOString()
        })
        .then(({ data, error }) => {
          if (error) {
            console.error('Error updating history:', error)
            return null
          }
          
          return supabase
            .from('vehicle_status_history')
            .select(`
              id,
              created_at,
              notes,
              status_id,
              changed_by
            `)
            .eq('vehicle_id', vehicle.id)
            .order('created_at', { ascending: false })
        })
        .then(result => {
          if (!result) return
          
          const { data: historyData, error: historyError } = result
          
          if (historyError) {
            console.error('Error refreshing history:', historyError)
            return
          }
          
          if (historyData) {
            const formattedHistory = historyData.map(item => ({
              date: new Date(item.created_at).toLocaleString(),
              user: "Admin", // Replace with actual user when available
              action: item.notes || "Status updated"
            }))
            setHistory(formattedHistory)
          }
        })
        .catch(error => {
          console.error('Error in promise chain:', error)
        })
    }
  }

  const renderEmptyState = (section: keyof typeof sectionsData, title: string, description: string) => (
    <div className="py-8 flex flex-col items-center justify-center text-center">
      <div className="text-sm text-gray-500 mb-4">{description}</div>
      <button
        onClick={() => addSection(section)}
        className="flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add {title}
      </button>
    </div>
  )

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p>Loading vehicle details...</p>
      </div>
    )
  }

  if (!vehicle) {
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

  return (
    <div className="min-h-screen bg-gray-50">
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

      <div className="max-w-5xl mx-auto p-6 space-y-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="bg-white rounded-lg shadow mb-6">
              <div className="p-6">
                <h2 className="text-lg font-semibold mb-6 flex items-center">
                  <Car className="w-5 h-5 text-gray-500 mr-2" />
                  Vehicle Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="stock_number"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="block text-sm font-medium text-gray-700 mb-1">
                              Stock #
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="Stock number"
                                className="w-full p-2 border rounded-lg"
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="vin"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="block text-sm font-medium text-gray-700 mb-1">
                              VIN
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="Vehicle VIN"
                                className="w-full p-2 border rounded-lg"
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="year"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="block text-sm font-medium text-gray-700 mb-1">
                              Year
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="number"
                                className="w-full p-2 border rounded-lg"
                                onChange={e => field.onChange(parseInt(e.target.value) || 0)}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="lot_number"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="block text-sm font-medium text-gray-700 mb-1">
                              Lot Number
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="Lot number"
                                className="w-full p-2 border rounded-lg"
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  <div className="border-2 border-dashed rounded-lg p-6 text-center">
                    <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <div className="text-sm text-gray-600 mb-2">
                      Drop photos here or click to upload
                    </div>
                    <button type="button" className="bg-blue-50 text-blue-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-100">
                      Browse Files
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow mb-6">
              <div className="p-6">
                <h2 className="text-lg font-semibold mb-6 flex items-center">
                  <MapPin className="w-5 h-5 text-gray-500 mr-2" />
                  Auction Location
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="block text-sm font-medium text-gray-700 mb-1">
                            Address
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Address"
                              className="w-full p-2 border rounded-lg"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="block text-sm font-medium text-gray-700 mb-1">
                              City
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="City"
                                className="w-full p-2 border rounded-lg"
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="state"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="block text-sm font-medium text-gray-700 mb-1">
                              State
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="State"
                                className="w-full p-2 border rounded-lg"
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="zip_code"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="block text-sm font-medium text-gray-700 mb-1">
                            Zip Code
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Zip Code"
                              className="w-full p-2 border rounded-lg"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="receiver_port_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="block text-sm font-medium text-gray-700 mb-1">
                            Receiver Port
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              onChange={e => field.onChange(parseInt(e.target.value) || 0)}
                              placeholder="Receiver Port ID"
                              className="w-full p-2 border rounded-lg"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="warehouse_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="block text-sm font-medium text-gray-700 mb-1">
                            Warehouse
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              {...field}
                              onChange={e => field.onChange(parseInt(e.target.value) || 0)}
                              placeholder="Warehouse ID"
                              className="w-full p-2 border rounded-lg"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="gate_pass_pin"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="block text-sm font-medium text-gray-700 mb-1">
                              Gate Pass PIN
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="Gate Pass PIN"
                                className="w-full p-2 border rounded-lg"
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="is_sublot"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="block text-sm font-medium text-gray-700 mb-1">
                              Is Sublot
                            </FormLabel>
                            <FormControl>
                              <div className="flex items-center h-10 mt-2">
                                <input
                                  type="checkbox"
                                  checked={field.value}
                                  onChange={e => field.onChange(e.target.checked)}
                                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <span className="ml-2 text-sm text-gray-600">
                                  Yes
                                </span>
                              </div>
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow mb-6">
              <div className="p-6">
                <h2 className="text-lg font-semibold flex items-center">
                  <Ship className="w-5 h-5 text-gray-500 mr-2" />
                  Transport Details
                </h2>
                {!sectionsData.transport ? (
                  renderEmptyState(
                    'transport',
                    'transport details',
                    'No transport information has been added yet'
                  )
                ) : (
                  <div className="mt-6">
                    <div className="flex justify-between items-start mb-6">
                      <div className="text-sm text-gray-500">Transport information added</div>
                      <button
                        type="button"
                        onClick={() => removeSection('transport')}
                        className="p-1 text-gray-400 hover:text-gray-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <FormField
                          control={form.control}
                          name="destination"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="block text-sm font-medium text-gray-700 mb-1">
                                Destination
                              </FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  placeholder="Enter destination"
                                  className="w-full p-2 border rounded-lg"
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow mb-6">
              <div className="p-6">
                <h2 className="text-lg font-semibold flex items-center">
                  <Users className="w-5 h-5 text-gray-500 mr-2" />
                  Dealer Information
                </h2>
                {!sectionsData.dealer ? (
                  renderEmptyState(
                    'dealer',
                    'dealer information',
                    'No dealer information has been added yet'
                  )
                ) : (
                  <div className="mt-6">
                    <div className="flex justify-between items-start mb-6">
                      <div className="text-sm text-gray-500">Dealer information added</div>
                      <button
                        type="button"
                        onClick={() => removeSection('dealer')}
                        className="p-1 text-gray-400 hover:text-gray-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <FormField
                          control={form.control}
                          name="client_name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="block text-sm font-medium text-gray-700 mb-1">
                                Name
                              </FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  placeholder="Enter name"
                                  className="w-full p-2 border rounded-lg"
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="client_phone_number"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="block text-sm font-medium text-gray-700 mb-1">
                                Phone Number
                              </FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  placeholder="Enter phone number"
                                  className="w-full p-2 border rounded-lg"
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="space-y-4">
                        <FormField
                          control={form.control}
                          name="client_passport_number"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="block text-sm font-medium text-gray-700 mb-1">
                                Passport Number
                              </FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  placeholder="Enter passport number"
                                  className="w-full p-2 border rounded-lg"
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow mb-6">
              <div className="p-6">
                <h2 className="text-lg font-semibold flex items-center">
                  <FileText className="w-5 h-5 text-gray-500 mr-2" />
                  Documents
                </h2>
                {!sectionsData.documents ? (
                  renderEmptyState(
                    'documents',
                    'documents',
                    'No documents have been uploaded yet'
                  )
                ) : (
                  <div className="mt-6">
                    <div className="flex justify-between items-start mb-6">
                      <div className="text-sm text-gray-500">Documents section added</div>
                      <button
                        type="button"
                        onClick={() => removeSection('documents')}
                        className="p-1 text-gray-400 hover:text-gray-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="border-2 border-dashed rounded-lg p-6 text-center">
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <div className="text-sm text-gray-500 mb-4">
                        Drop files here or click to upload
                      </div>
                      <button type="button" className="bg-blue-50 text-blue-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-100">
                        Browse Files
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end mb-6">
              <Button type="submit" disabled={isSaving}>
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </Form>

        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h2 className="text-lg font-semibold flex items-center mb-4">
              <Clock className="w-5 h-5 text-gray-500 mr-2" />
              History
            </h2>
            <div className="space-y-4">
              {history.length > 0 ? (
                history.map((event, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <AlertCircle className="w-4 h-4 text-blue-600" />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center text-sm">
                        <span className="font-medium">{event.user}</span>
                        <span className="mx-2">•</span>
                        <span className="text-gray-500">{event.date}</span>
                      </div>
                      <p className="mt-1 text-sm text-gray-600">{event.action}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-gray-500">
                  No history records available
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VehicleDetailsPage
