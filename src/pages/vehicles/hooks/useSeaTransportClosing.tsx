
import { useState } from "react"
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

export const useSeaTransportClosing = (
  form: UseFormReturn<VehicleFormValues>,
  removeSection: (section: keyof SectionsData) => void
) => {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  
  const confirmClose = () => {
    // Check if any sea transportation fields have values
    const formValues = form.getValues()
    
    const hasSeaTransportData = 
      !!formValues.shipping_company_name ||
      !!formValues.shipping_line_id ||
      !!formValues.booking_number ||
      !!formValues.container_number ||
      !!formValues.receiving_company ||
      !!formValues.container_load_date ||
      !!formValues.planned_arrival_date ||
      !!formValues.container_entry_date ||
      !!formValues.container_open_date ||
      !!formValues.green_date
    
    if (hasSeaTransportData) {
      setIsConfirmOpen(true)
    } else {
      removeSection("seaTransport")
    }
  }
  
  const handleConfirm = () => {
    setIsConfirmOpen(false)
    
    // Reset sea transportation related fields
    form.setValue("shipping_company_name", "")
    form.setValue("shipping_line_id", 0)
    form.setValue("booking_number", "")
    form.setValue("container_number", "")
    form.setValue("receiving_company", "")
    form.setValue("container_load_date", "")
    form.setValue("planned_arrival_date", "")
    form.setValue("container_entry_date", "")
    form.setValue("container_open_date", "")
    form.setValue("green_date", "")
    
    removeSection("seaTransport")
  }
  
  const handleCancel = () => {
    setIsConfirmOpen(false)
  }
  
  const ConfirmationDialog = () => (
    <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Remove Sea Transportation Information?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This will remove all sea transportation information for this vehicle. This action cannot be undone.
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
