
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

export const useLandTransportClosing = (
  form: UseFormReturn<VehicleFormValues>,
  removeSection: (section: keyof SectionsData) => void
) => {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const { toast } = useToast();

  // Fields that are part of the land transportation section
  const landTransportFields = [
    'receiver_port_id',
    'warehouse_id',
    'destination',
    'storage_start_date',
    'pickup_date',
    'pickup_date_status',
    'delivery_date',
    'delivery_date_status',
    'transport_listed_price',
    'balance_payment_time',
    'balance_payment_method',
    'storage_fee',
    'company_name',
    'mc_number',
    'transporter_name',
    'transporter_phone',
    'transporter_payment_date'
  ] as const;

  // Check if any land transport fields have data
  const hasLandTransportData = () => {
    const values = form.getValues();
    return landTransportFields.some(field => {
      const value = values[field];
      if (typeof value === 'string') return value.trim() !== '';
      if (typeof value === 'number') return value !== 0;
      return false;
    });
  };

  const confirmClose = (section: keyof SectionsData) => {
    if (section !== 'landTransport') {
      removeSection(section);
      return;
    }

    if (hasLandTransportData()) {
      setIsConfirmOpen(true);
    } else {
      removeSection('landTransport');
    }
  };

  const handleConfirmClose = () => {
    // Reset land transport fields
    const defaultValues: Partial<VehicleFormValues> = {};
    
    landTransportFields.forEach(field => {
      if (['receiver_port_id', 'warehouse_id', 'transport_listed_price', 'storage_fee'].includes(field)) {
        defaultValues[field] = 0;
      } else {
        defaultValues[field] = '';
      }
    });

    form.reset({ ...form.getValues(), ...defaultValues });
    removeSection('landTransport');
    setIsConfirmOpen(false);
    
    toast({
      title: "Land Transportation Information Cleared",
      description: "The land transportation information has been reset and the section closed."
    });
  };

  const ConfirmationDialog = () => (
    <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Close</DialogTitle>
          <DialogDescription>
            You have unsaved land transportation information. Are you sure you want to close this section? 
            All entered land transportation data will be lost.
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
