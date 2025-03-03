
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

export const useAuctionClosing = (
  form: UseFormReturn<VehicleFormValues>,
  removeSection: (section: keyof SectionsData) => void
) => {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  
  const confirmClose = () => {
    // Check if any auction fields have values
    const formValues = form.getValues()
    
    const hasAuctionData = 
      formValues.auction_id !== 0 ||
      !!formValues.pay_due_date ||
      formValues.auction_won_price !== 0 ||
      formValues.auction_final_price !== 0 ||
      !!formValues.auction_pay_date ||
      !!formValues.purchase_date
    
    if (hasAuctionData) {
      setIsConfirmOpen(true)
    } else {
      removeSection("auction")
    }
  }
  
  const handleConfirm = () => {
    setIsConfirmOpen(false)
    
    // Reset auction related fields
    form.setValue("auction_id", 0)
    form.setValue("pay_due_date", "")
    form.setValue("auction_won_price", 0)
    form.setValue("auction_final_price", 0)
    form.setValue("auction_pay_date", "")
    form.setValue("purchase_date", "")
    
    removeSection("auction")
  }
  
  const handleCancel = () => {
    setIsConfirmOpen(false)
  }
  
  const ConfirmationDialog = () => (
    <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Remove Auction Information?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This will remove all auction information for this vehicle. This action cannot be undone.
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
