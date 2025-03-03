
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
