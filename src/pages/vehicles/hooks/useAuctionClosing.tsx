
import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { VehicleFormValues, SectionsData } from "../types/vehicleTypes";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export const useAuctionClosing = (
  form: UseFormReturn<VehicleFormValues>,
  removeSection: (section: keyof SectionsData) => void
) => {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const { toast } = useToast();

  // Fields that are part of the auction section
  const auctionFields = [
    'auction_id',
    'lot_number',
    'address',
    'city',
    'state',
    'zip_code',
    'gate_pass_pin',
    'is_sublot',
    'receiver_port_id',
    'warehouse_id',
    'destination',
    'purchase_date',
    'auction_won_price',
    'auction_final_price',
    'auction_pay_date'
  ] as const; // This makes the array readonly and allows TypeScript to narrow the type

  // Check if any auction fields have data
  const hasAuctionData = () => {
    const values = form.getValues();
    return auctionFields.some(field => {
      const value = values[field];
      if (typeof value === 'string') return value.trim() !== '';
      if (typeof value === 'number') return value !== 0;
      if (typeof value === 'boolean') return value === true;
      return false;
    });
  };

  const confirmClose = (section: keyof SectionsData) => {
    if (section !== 'auction') {
      removeSection(section);
      return;
    }

    if (hasAuctionData()) {
      setIsConfirmOpen(true);
    } else {
      removeSection('auction');
    }
  };

  const handleConfirmClose = () => {
    // Reset auction fields
    const defaultValues: Partial<VehicleFormValues> = {};
    
    auctionFields.forEach(field => {
      if (['auction_id', 'receiver_port_id', 'warehouse_id', 'auction_won_price', 'auction_final_price'].includes(field)) {
        // For numeric fields
        defaultValues[field] = 0;
      } else if (field === 'is_sublot') {
        // For boolean fields
        defaultValues[field] = false;
      } else {
        // For string fields
        defaultValues[field] = '';
      }
    });

    form.reset({ ...form.getValues(), ...defaultValues });
    removeSection('auction');
    setIsConfirmOpen(false);
    
    toast({
      title: "Auction Information Cleared",
      description: "The auction information has been reset and the section closed."
    });
  };

  const ConfirmationDialog = () => (
    <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Close</DialogTitle>
          <DialogDescription>
            You have unsaved auction information. Are you sure you want to close this section? 
            All entered auction data will be lost.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex justify-between sm:justify-between">
          <Button variant="outline" onClick={() => setIsConfirmOpen(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleConfirmClose}>
            Yes, Clear Data
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  return {
    confirmClose,
    ConfirmationDialog,
    isConfirmOpen
  };
};
