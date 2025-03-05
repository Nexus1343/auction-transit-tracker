
import React from 'react';
import { Save } from 'lucide-react';
import { TransportPrice, stateOptions, portOptions } from '../../types';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface TransportPriceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (formData: Omit<TransportPrice, 'id'>) => void;
  selectedPrice: TransportPrice | null;
}

const TransportPriceModal: React.FC<TransportPriceModalProps> = ({
  isOpen,
  onClose,
  onSave,
  selectedPrice
}) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const priceData: Omit<TransportPrice, 'id'> = {
      city: formData.get('city') as string,
      city2: formData.get('city2') as string || null,
      zip: formData.get('zip') as string,
      state: formData.get('state') as string,
      port: formData.get('port') as string,
      price: parseFloat(formData.get('price') as string)
    };
    
    onSave(priceData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {selectedPrice ? 'Edit Transportation Price' : 'Add Transportation Price'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  name="city"
                  defaultValue={selectedPrice?.city}
                  required
                />
              </div>
              <div>
                <Label htmlFor="city2">City 2 (Optional)</Label>
                <Input
                  id="city2"
                  name="city2"
                  defaultValue={selectedPrice?.city2 || ''}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="zip">ZIP Code</Label>
                <Input
                  id="zip"
                  name="zip"
                  defaultValue={selectedPrice?.zip}
                />
              </div>
              <div>
                <Label htmlFor="state">State</Label>
                <Select name="state" defaultValue={selectedPrice?.state || ''}>
                  <SelectTrigger id="state">
                    <SelectValue placeholder="Select State" />
                  </SelectTrigger>
                  <SelectContent>
                    {stateOptions.map(state => (
                      <SelectItem key={state} value={state}>{state}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
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

export default TransportPriceModal;
