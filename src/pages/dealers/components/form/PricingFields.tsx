
import React from 'react';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dealer } from "../../../../services/dealer";

interface PricingFieldsProps {
  formData: Dealer;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectChange: (name: string, value: string) => void;
  isSubDealer: boolean;
  transportPrices: any[];
  containerPrices: any[];
}

const PricingFields = ({ 
  formData, 
  onInputChange, 
  onSelectChange, 
  isSubDealer,
  transportPrices,
  containerPrices
}: PricingFieldsProps) => {
  return (
    <div className="space-y-4">
      {!isSubDealer && (
        <>
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
        </>
      )}
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
      {!isSubDealer && (
        <>
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
        </>
      )}
    </div>
  );
};

export default PricingFields;
