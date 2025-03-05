
import React from 'react';
import { Save } from 'lucide-react';
import { ContainerPrice, portOptions, vehicleTypeOptions } from '../../types';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ContainerPriceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (formData: Omit<ContainerPrice, 'id'>) => void;
  selectedPrice: ContainerPrice | null;
}

const ContainerPriceModal: React.FC<ContainerPriceModalProps> = ({
  isOpen,
  onClose,
  onSave,
  selectedPrice
}) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const priceData: Omit<ContainerPrice, 'id'> = {
      port: formData.get('port') as string,
      vehicleType: formData.get('vehicleType') as string,
      price: parseFloat(formData.get('price') as string)
    };
    
    onSave(priceData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {selectedPrice ? 'Edit Container Price' : 'Add Container Price'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="port">Port</Label>
              <Select name="port" defaultValue={selectedPrice?.port || ''}>
                <SelectTrigger id="port">
                  <SelectValue placeholder="Select Port" />
                </SelectTrigger>
                <SelectContent>
                  {portOptions.map(port => (
                    <SelectItem key={port} value={port}>{port}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="vehicleType">Vehicle Type</Label>
              <Select name="vehicleType" defaultValue={selectedPrice?.vehicleType || ''}>
                <SelectTrigger id="vehicleType">
                  <SelectValue placeholder="Select Vehicle Type" />
                </SelectTrigger>
                <SelectContent>
                  {vehicleTypeOptions.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="price">Price ($)</Label>
              <Input
                id="price"
                name="price"
                type="number"
                step="0.01"
                min="0"
                defaultValue={selectedPrice?.price}
                required
              />
            </div>
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex items-center space-x-1"
              >
                <Save className="w-4 h-4" />
                <span>Save</span>
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ContainerPriceModal;
