
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { UseFormReturn } from "react-hook-form"
import { VehicleFormValues, SectionsData } from "../types/vehicleTypes"

export const useLandTransportClosing = (
  form: UseFormReturn<VehicleFormValues>,
  removeSection: (section: keyof SectionsData) => void
) => {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  
  const confirmClose = () => {
    // Check if any land transportation fields have values
    const formValues = form.getValues()
    
    const hasLandTransportData = 
      formValues.receiver_port_id !== 0 ||
      formValues.warehouse_id !== 0 ||
      !!formValues.destination ||
      !!formValues.storage_start_date ||
      !!formValues.pickup_date ||
      !!formValues.pickup_date_status ||
      !!formValues.delivery_date ||
      !!formValues.delivery_date_status ||
      formValues.transport_listed_price !== 0 ||
      !!formValues.balance_payment_time ||
      !!formValues.balance_payment_method ||
      formValues.storage_fee !== 0 ||
      !!formValues.company_name ||
      !!formValues.mc_number ||
      !!formValues.transporter_name ||
      !!formValues.transporter_phone ||
      !!formValues.transporter_payment_date
    
    if (hasLandTransportData) {
      setIsConfirmOpen(true)
    } else {
      removeSection("landTransport")
    }
  }
  
  const handleConfirm = () => {
    setIsConfirmOpen(false)
    
    // Reset land transportation related fields
    form.setValue("receiver_port_id", 0)
    form.setValue("warehouse_id", 0)
    form.setValue("destination", "")
    form.setValue("storage_start_date", "")
    form.setValue("pickup_date", "")
    form.setValue("pickup_date_status", "")
    form.setValue("delivery_date", "")
    form.setValue("delivery_date_status", "")
    form.setValue("transport_listed_price", 0)
    form.setValue("balance_payment_time", "")
    form.setValue("balance_payment_method", "")
    form.setValue("storage_fee", 0)
    form.setValue("company_name", "")
    form.setValue("mc_number", "")
    form.setValue("transporter_name", "")
    form.setValue("transporter_phone", "")
    form.setValue("transporter_payment_date", "")
    
    removeSection("landTransport")
  }
  
  const handleCancel = () => {
    setIsConfirmOpen(false)
  }
  
  const ConfirmationDialog = () => (
    <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Remove Land Transportation Information?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This will remove all land transportation information for this vehicle. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancel}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm}>
            Remove
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
  
  return {
    confirmClose,
    ConfirmationDialog
  }
}
