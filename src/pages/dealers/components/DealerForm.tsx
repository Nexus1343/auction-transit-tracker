
import React, { FormEvent } from 'react';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Dealer } from "../../../services/dealerService";

interface DealerFormProps {
  formData: Dealer;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectChange: (name: string, value: string) => void;
  onSubmit: (e: FormEvent) => void;
  isLoading: boolean;
  onCancel: () => void;
  transportPrices: any[];
  containerPrices: any[];
}

const DealerForm = ({
  formData,
  onInputChange,
  onSelectChange,
  onSubmit,
  isLoading,
  onCancel,
  transportPrices,
  containerPrices
}: DealerFormProps) => {
  return (
    <form onSubmit={onSubmit}>
      <div className="grid grid-cols-2 gap-6 mt-4">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Dealer Name
            </label>
            <Input
              type="text"
              name="name"
              value={formData.name}
              onChange={onInputChange}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username (Email)
            </label>
            <Input
              type="text"
              name="username"
              value={formData.username || ''}
              onChange={onInputChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <Input
              type="password"
              name="password"
              value={formData.password || ''}
              onChange={onInputChange}
              placeholder={formData.id ? "••••••••" : ""}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mobile
            </label>
            <Input
              type="text"
              name="mobile"
              value={formData.mobile || ''}
              onChange={onInputChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Buyer ID
            </label>
            <Input
              type="text"
              name="buyer_id"
              value={formData.buyer_id || ''}
              onChange={onInputChange}
            />
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Buyer ID 2
            </label>
            <Input
              type="text"
              name="buyer_id_2"
              value={formData.buyer_id_2 || ''}
              onChange={onInputChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Dealer Fee
            </label>
            <Input
              type="number"
              step="0.01"
              name="dealer_fee"
              value={formData.dealer_fee || ''}
              onChange={onInputChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Dealer Fee 2
            </label>
            <Input
              type="number"
              step="0.01"
              name="dealer_fee_2"
              value={formData.dealer_fee_2 || ''}
              onChange={onInputChange}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Transportation Price
            </label>
            <Select 
              value={formData.transport_price_id?.toString() || "none"}
              onValueChange={(value) => onSelectChange('transport_price_id', value === "none" ? "" : value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select transportation price" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                {transportPrices && transportPrices.map(price => (
                  <SelectItem key={price.id} value={price.id.toString()}>
                    {price.port || price.city || 'Unnamed'} - ${price.price || 0}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Container Price
            </label>
            <Select 
              value={formData.container_price_id?.toString() || "none"}
              onValueChange={(value) => onSelectChange('container_price_id', value === "none" ? "" : value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select container price" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                {containerPrices && containerPrices.map(price => (
                  <SelectItem key={price.id} value={price.id.toString()}>
                    {price.port || price.vehicle_type || 'Unnamed'} - ${price.price || 0}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <DialogFooter className="mt-6">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? 'Saving...' : 'Save'}
        </Button>
      </DialogFooter>
    </form>
  );
};

export default DealerForm;
