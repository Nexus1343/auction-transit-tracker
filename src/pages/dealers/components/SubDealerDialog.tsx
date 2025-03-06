
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import DealerForm from './DealerForm';
import { Dealer } from "../../../services/dealer";

interface SubDealerDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedDealer: Dealer | null;
  formData: Dealer;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectChange: (name: string, value: string) => void;
  onSwitchChange: (name: string, checked: boolean) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  transportPrices: any[];
  containerPrices: any[];
  dealers: Dealer[];
  isSubDealer: boolean;
}

const SubDealerDialog = ({
  isOpen,
  onOpenChange,
  selectedDealer,
  formData,
  onInputChange,
  onSelectChange,
  onSwitchChange,
  onSubmit,
  isLoading,
  transportPrices,
  containerPrices,
  dealers,
  isSubDealer
}: SubDealerDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>
            {selectedDealer ? 'Edit Sub-Dealer' : 'Add New Sub-Dealer'}
          </DialogTitle>
          <DialogDescription>
            Manage sub-dealer information and settings
          </DialogDescription>
        </DialogHeader>
        
        <DealerForm
          formData={formData}
          onInputChange={onInputChange}
          onSelectChange={onSelectChange}
          onSwitchChange={onSwitchChange}
          onSubmit={onSubmit}
          isLoading={isLoading}
          onCancel={() => onOpenChange(false)}
          transportPrices={transportPrices}
          containerPrices={containerPrices}
          dealers={dealers}
          isSubDealer={isSubDealer}
        />
      </DialogContent>
    </Dialog>
  );
};

export default SubDealerDialog;
