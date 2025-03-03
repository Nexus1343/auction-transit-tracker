import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { Form } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { VehicleDetails, SectionsData, VehicleFormValues } from "./types/vehicleTypes"
import { VehicleHeader } from "./components/VehicleHeader"
import { VehicleBasicInfo } from "./components/VehicleBasicInfo"
import { AuctionSection } from "./components/AuctionSection"
import { DealerSection } from "./components/DealerSection"
import { DocumentsSection } from "./components/DocumentsSection"
import { useVehicleHistory } from "./hooks/useVehicleHistory"

const VehicleDetailsPage = () => {
  const { id } = useParams<{ id: string }>()
  const [vehicle, setVehicle] = useState<VehicleDetails | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const navigate = useNavigate()
  const { toast } = useToast()
  
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
  
  const [sectionsData, setSectionsData] = useState<SectionsData>({
    transport: null,
    dealer: null,
    documents: null
  })

  const form = useForm<VehicleFormValues>({
    defaultValues: {
      vin: "",
      lot_number: "",
      stock_number: "",
      year: 0,
      destination: "",
      client_name: "",
      client_phone_number: "",
      client_passport_number: "",
      client_buyer_id: "",
      address: "",
      city: "",
      state: "",
      zip_code: "",
      receiver_port_id: 0,
      warehouse_id: 0,
      gate_pass_pin: "",
      is_sublot: false,
      manufacturer_id: 0,
      model_id: 0,
      generation_id: 0,
      body_type_id: 0,
      has_key: false,
      highlights: "",
      auction_id: 0,
      dealer_id: 0,
      sub_dealer_id: 0,
      pay_due_date: "",
      auction_won_price: 0,
      auction_final_price: 0,
      auction_pay_date: "",
      purchase_date: ""
    }
  })
  
  // Use the custom hook for history management
  const { history, addHistoryEvent } = useVehicleHistory(vehicle?.id || null)
  
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
            client_buyer_id,
            address,
            city,
            state,
            zip_code,
            receiver_port_id,
            warehouse_id,
            gate_pass_pin,
            is_sublot,
            manufacturer_id,
            model_id,
            generation_id,
            body_type_id,
            has_key,
            highlights,
            auction_id,
            dealer_id,
            sub_dealer_id,
            pay_due_date,
            auction_won_price,
            auction_final_price,
            auction_pay_date,
            purchase_date,
            manufacturer:manufacturer_id(name),
            model:model_id(name)
          `)
          .eq('id', parseInt(id))
          .single()
        
        if (error) throw error
        
        setVehicle(data)
        
        // Set form values from the fetched data
        form.reset({
          vin: data.vin || "",
          lot_number: data.lot_number || "",
          stock_number: data.stock_number || "",
          year: data.year || 0,
          destination: data.destination || "",
          client_name: data.client_name || "",
          client_phone_number: data.client_phone_number || "",
          client_passport_number: data.client_passport_number || "",
          client_buyer_id: data.client_buyer_id || "",
          address: data.address || "",
          city: data.city || "",
          state: data.state || "",
          zip_code: data.zip_code || "",
          receiver_port_id: data.receiver_port_id || 0,
          warehouse_id: data.warehouse_id || 0,
          gate_pass_pin: data.gate_pass_pin || "",
          is_sublot: data.is_sublot || false,
          manufacturer_id: data.manufacturer_id || 0,
          model_id: data.model_id || 0,
          generation_id: data.generation_id || 0,
          body_type_id: data.body_type_id || 0,
          has_key: data.has_key || false,
          highlights: data.highlights || "",
          auction_id: data.auction_id || 0,
          dealer_id: data.dealer_id || 0,
          sub_dealer_id: data.sub_dealer_id || 0,
          pay_due_date: data.pay_due_date || "",
          auction_won_price: data.auction_won_price || 0,
          auction_final_price: data.auction_final_price || 0,
          auction_pay_date: data.auction_pay_date || "",
          purchase_date: data.purchase_date || ""
        })

        if (data.destination) {
          setSectionsData(prev => ({...prev, transport: {}}))
        }
        
        if (data.client_name || data.client_phone_number || data.client_passport_number || data.client_buyer_id) {
          setSectionsData(prev => ({...prev, dealer: {}}))
        }
        
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

  const onSubmit = async (data: VehicleFormValues) => {
    if (!vehicle || !id) return
    
    setIsSaving(true)
    try {
      console.log("Saving data:", data);
      
      // Make explicit data object to ensure all fields are included
      // Convert ID values of 0 to null to avoid foreign key constraint errors
      const updateData = {
        vin: data.vin,
        lot_number: data.lot_number,
        stock_number: data.stock_number,
        year: data.year,
        destination: data.destination,
        client_name: data.client_name,
        client_phone_number: data.client_phone_number,
        client_passport_number: data.client_passport_number,
        client_buyer_id: data.client_buyer_id,
        // Auction Location fields
        address: data.address,
        city: data.city,
        state: data.state,
        zip_code: data.zip_code,
        receiver_port_id: data.receiver_port_id > 0 ? data.receiver_port_id : null,
        warehouse_id: data.warehouse_id > 0 ? data.warehouse_id : null,
        gate_pass_pin: data.gate_pass_pin,
        is_sublot: data.is_sublot,
        // Added vehicle fields
        manufacturer_id: data.manufacturer_id > 0 ? data.manufacturer_id : null,
        model_id: data.model_id > 0 ? data.model_id : null, 
        generation_id: data.generation_id > 0 ? data.generation_id : null,
        body_type_id: data.body_type_id > 0 ? data.body_type_id : null,
        has_key: data.has_key,
        highlights: data.highlights,
        // Auction fields
        auction_id: data.auction_id > 0 ? data.auction_id : null,
        // Purchase fields
        auction_won_price: data.auction_won_price || null,
        auction_final_price: data.auction_final_price || null,
        auction_pay_date: data.auction_pay_date || null,
        purchase_date: data.purchase_date || null,
        // Dealer fields
        dealer_id: data.dealer_id > 0 ? data.dealer_id : null,
        sub_dealer_id: data.sub_dealer_id > 0 ? data.sub_dealer_id : null,
        pay_due_date: data.pay_due_date || null
      };
      
      const { error } = await supabase
        .from('vehicles')
        .update(updateData)
        .eq('id', vehicle.id)
      
      if (error) {
        console.error('Supabase update error:', error);
        throw error;
      }
      
      try {
        await addHistoryEvent(vehicle.id, "Vehicle details updated")
        
        // Fetch the updated vehicle data to update our local state
        const { data: updatedVehicle, error: fetchError } = await supabase
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
            client_buyer_id,
            address,
            city,
            state,
            zip_code,
            receiver_port_id,
            warehouse_id,
            gate_pass_pin,
            is_sublot,
            manufacturer_id,
            model_id,
            generation_id,
            body_type_id,
            has_key,
            highlights,
            auction_id,
            dealer_id,
            sub_dealer_id,
            pay_due_date,
            auction_won_price,
            auction_final_price,
            auction_pay_date,
            purchase_date,
            manufacturer:manufacturer_id(name),
            model:model_id(name)
          `)
          .eq('id', vehicle.id)
          .single()
          
        if (fetchError) throw fetchError
          
        // Update the vehicle state with fresh data
        setVehicle(updatedVehicle)
      } catch (historyError) {
        console.error('Error updating history:', historyError)
      }
      
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
      await addHistoryEvent(vehicle.id, `Changed status to "${newStatus}"`)
      
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

  const addSection = async (section: keyof typeof sectionsData) => {
    setSectionsData(prev => ({
      ...prev,
      [section]: {}
    }));
    
    if (vehicle) {
      await addHistoryEvent(vehicle.id, `Added ${section} information`)
    }
  }

  const removeSection = async (section: keyof typeof sectionsData) => {
    setSectionsData(prev => ({
      ...prev,
      [section]: null
    }));
    
    if (vehicle) {
      await addHistoryEvent(vehicle.id, `Removed ${section} information`)
    }
  }

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
      <VehicleHeader
        vehicle={vehicle}
        currentStatus={currentStatus}
        statuses={statuses}
        updateStatus={updateStatus}
        getProgressPercentage={getProgressPercentage}
      />

      <div className="max-w-5xl mx-auto p-6 space-y-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <VehicleBasicInfo form={form} />
            <AuctionSection form={form} />
            <DealerClientSection 
              form={form}
              sectionsData={sectionsData}
              addSection={addSection}
              removeSection={removeSection}
            />
            <DocumentsSection
              sectionsData={sectionsData}
              addSection={addSection}
              removeSection={removeSection}
            />

            <div className="flex justify-end mb-8">
              <Button
                type="submit"
                disabled={isSaving}
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}

export default VehicleDetailsPage
