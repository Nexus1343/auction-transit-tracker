
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dealer } from "../../../../services/dealer";

interface ParentDealerSelectorProps {
  formData: Dealer;
  onSelectChange: (name: string, value: string) => void;
  dealers: Dealer[];
}

const ParentDealerSelector = ({ formData, onSelectChange, dealers }: ParentDealerSelectorProps) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Parent Dealer
      </label>
      <Select 
        value={formData.dealer_id?.toString() || "none"}
        onValueChange={(value) => onSelectChange('dealer_id', value === "none" ? "" : value)}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select parent dealer" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">None</SelectItem>
          {dealers && dealers.map(dealer => (
            <SelectItem key={dealer.id} value={dealer.id?.toString() || ""}>
              {dealer.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default ParentDealerSelector;
