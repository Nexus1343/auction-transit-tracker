
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import DealerForm from './DealerForm';
import { Dealer } from "../../../services/dealerService";

interface DealerDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedDealer: Dealer | null;
  formData: Dealer;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectChange: (name: string, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  transportPrices: any[];
  containerPrices: any[];
}

const DealerDialog = ({
  isOpen,
  onOpenChange,
  selectedDealer,
  formData,
  onInputChange,
  onSelectChange,
  onSubmit,
  isLoading,
  transportPrices,
  containerPrices
}: DealerDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>
            {selectedDealer ? 'Edit Dealer' : 'Add New Dealer'}
          </DialogTitle>
        </DialogHeader>
        
        <DealerForm
          formData={formData}
          onInputChange={onInputChange}
          onSelectChange={onSelectChange}
          onSubmit={onSubmit}
          isLoading={isLoading}
          onCancel={() => onOpenChange(false)}
          transportPrices={transportPrices}
          containerPrices={containerPrices}
        />
      </DialogContent>
    </Dialog>
  );
};

export default DealerDialog;
