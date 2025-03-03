
import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { VehicleDetails, SectionsData, VehicleFormValues } from "../types/vehicleTypes"
import { useParams } from "react-router-dom"
import { useForm } from "react-hook-form"

export const useVehicleDetails = () => {
  const { id } = useParams<{ id: string }>()
  const [vehicle, setVehicle] = useState<VehicleDetails | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()
  
  const [sectionsData, setSectionsData] = useState<SectionsData>({
    transport: null,
    dealer: null,
    documents: null,
    auction: null,
    landTransport: null
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
      purchase_date: "",
      storage_start_date: "",
      pickup_date: "",
      pickup_date_status: "",
      delivery_date: "",
      delivery_date_status: "",
      transport_listed_price: 0,
      balance_payment_time: "",
      balance_payment_method: "",
      storage_fee: 0,
      company_name: "",
      mc_number: "",
      transporter_name: "",
      transporter_phone: "",
      transporter_payment_date: ""
    }
  })

  useEffect(() => {
    const fetchVehicleDetails = async () => {
      if (!id) return
      
      setIsLoading(true)
      try {
        // First, fetch vehicle data
        const { data: vehicleData, error: vehicleError } = await supabase
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
        
        if (vehicleError) throw vehicleError
        
        // Next, check if there's land transportation data for this vehicle
        const { data: landTransportData, error: landTransportError } = await supabase
          .from('land_transportation')
          .select(`
            storage_start_date,
            pickup_date,
            pickup_date_status,
            delivery_date,
            delivery_date_status,
            transport_listed_price,
            balance_payment_time,
            balance_payment_method,
            storage_fee,
            company_name,
            mc_number,
            transporter_name,
            transporter_phone,
            transporter_payment_date
          `)
          .eq('vehicle_id', parseInt(id))
          .maybeSingle()
        
        if (landTransportError) {
          console.error('Error fetching land transport data:', landTransportError)
        }
        
        // Combine the data
        const combinedData = {
          ...vehicleData,
          ...(landTransportData || {})
        }
        
        setVehicle(combinedData)
        
        form.reset({
          vin: combinedData.vin || "",
          lot_number: combinedData.lot_number || "",
          stock_number: combinedData.stock_number || "",
          year: combinedData.year || 0,
          destination: combinedData.destination || "",
          client_name: combinedData.client_name || "",
          client_phone_number: combinedData.client_phone_number || "",
          client_passport_number: combinedData.client_passport_number || "",
          client_buyer_id: combinedData.client_buyer_id || "",
          address: combinedData.address || "",
          city: combinedData.city || "",
          state: combinedData.state || "",
          zip_code: combinedData.zip_code || "",
          receiver_port_id: combinedData.receiver_port_id || 0,
          warehouse_id: combinedData.warehouse_id || 0,
          gate_pass_pin: combinedData.gate_pass_pin || "",
          is_sublot: combinedData.is_sublot || false,
          manufacturer_id: combinedData.manufacturer_id || 0,
          model_id: combinedData.model_id || 0,
          generation_id: combinedData.generation_id || 0,
          body_type_id: combinedData.body_type_id || 0,
          has_key: combinedData.has_key || false,
          highlights: combinedData.highlights || "",
          auction_id: combinedData.auction_id || 0,
          dealer_id: combinedData.dealer_id || 0,
          sub_dealer_id: combinedData.sub_dealer_id || 0,
          pay_due_date: combinedData.pay_due_date || "",
          auction_won_price: combinedData.auction_won_price || 0,
          auction_final_price: combinedData.auction_final_price || 0,
          auction_pay_date: combinedData.auction_pay_date || "",
          purchase_date: combinedData.purchase_date || "",
          storage_start_date: combinedData.storage_start_date || "",
          pickup_date: combinedData.pickup_date || "",
          pickup_date_status: combinedData.pickup_date_status || "",
          delivery_date: combinedData.delivery_date || "",
          delivery_date_status: combinedData.delivery_date_status || "",
          transport_listed_price: combinedData.transport_listed_price || 0,
          balance_payment_time: combinedData.balance_payment_time || "",
          balance_payment_method: combinedData.balance_payment_method || "",
          storage_fee: combinedData.storage_fee || 0,
          company_name: combinedData.company_name || "",
          mc_number: combinedData.mc_number || "",
          transporter_name: combinedData.transporter_name || "",
          transporter_phone: combinedData.transporter_phone || "",
          transporter_payment_date: combinedData.transporter_payment_date || ""
        })

        // Initialize sections based on data presence
        const updatedSectionsData = { 
          transport: null,
          dealer: null, 
          documents: null,
          auction: null,
          landTransport: null
        };

        if (combinedData.destination || combinedData.receiver_port_id || combinedData.warehouse_id) {
          updatedSectionsData.transport = {};
        }
        
        if (combinedData.client_name || combinedData.client_phone_number || combinedData.client_passport_number || 
            combinedData.client_buyer_id || combinedData.dealer_id || combinedData.sub_dealer_id || 
            combinedData.pay_due_date) {
          updatedSectionsData.dealer = {};
        }

        // Check if auction data exists
        if (combinedData.auction_id || combinedData.lot_number || combinedData.address || 
            combinedData.purchase_date || combinedData.auction_won_price || 
            combinedData.auction_final_price || combinedData.auction_pay_date) {
          updatedSectionsData.auction = {};
        }
        
        // Check if land transport data exists
        if (combinedData.storage_start_date || combinedData.pickup_date || combinedData.delivery_date || 
            combinedData.transport_listed_price || combinedData.company_name || 
            combinedData.transporter_name || combinedData.balance_payment_method) {
          updatedSectionsData.landTransport = {};
        }
        
        setSectionsData(updatedSectionsData);
        
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

  return {
    id,
    vehicle,
    isLoading,
    isSaving,
    setIsSaving,
    form,
    sectionsData,
    setSectionsData,
    setVehicle
  }
}
