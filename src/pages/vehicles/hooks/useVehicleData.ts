
import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { VehicleDetails, SectionsData } from "../types/vehicleTypes"
import { useParams } from "react-router-dom"

export const useVehicleData = () => {
  const { id } = useParams<{ id: string }>()
  const [vehicle, setVehicle] = useState<VehicleDetails | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()
  
  const [sectionsData, setSectionsData] = useState<SectionsData>({
    transport: null,
    dealer: null,
    documents: null,
    auction: null,
    landTransport: null,
    seaTransport: null
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
        
        // Next, check if there's sea transportation data for this vehicle
        const { data: seaTransportData, error: seaTransportError } = await supabase
          .from('sea_transportation')
          .select(`
            shipping_company_name,
            shipping_line_id,
            booking_number,
            container_number,
            receiving_company,
            container_load_date,
            planned_arrival_date,
            container_entry_date,
            container_open_date,
            green_date
          `)
          .eq('vehicle_id', parseInt(id))
          .maybeSingle()
        
        if (seaTransportError) {
          console.error('Error fetching sea transport data:', seaTransportError)
        }
        
        // Combine the data
        const combinedData = {
          ...vehicleData,
          ...(landTransportData || {}),
          ...(seaTransportData || {})
        }
        
        setVehicle(combinedData)
        
        // Initialize sections based on data presence
        const updatedSectionsData = { 
          transport: null,
          dealer: null, 
          documents: null,
          auction: null,
          landTransport: null,
          seaTransport: null
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
        
        // Check if sea transport data exists
        if (combinedData.shipping_company_name || combinedData.shipping_line_id || combinedData.booking_number ||
            combinedData.container_number || combinedData.receiving_company || combinedData.container_load_date ||
            combinedData.planned_arrival_date || combinedData.container_entry_date || combinedData.container_open_date ||
            combinedData.green_date) {
          updatedSectionsData.seaTransport = {};
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
  }, [id, toast])

  return {
    id,
    vehicle,
    isLoading,
    setVehicle,
    sectionsData,
    setSectionsData
  }
}
