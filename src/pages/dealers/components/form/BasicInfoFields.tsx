
import React from 'react';
import { Input } from "@/components/ui/input";
import { Dealer } from "../../../../services/dealer";

interface BasicInfoFieldsProps {
  formData: Dealer;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isSubDealer: boolean;
}

const BasicInfoFields = ({ formData, onInputChange, isSubDealer }: BasicInfoFieldsProps) => {
  return (
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
      {!isSubDealer && (
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
      )}
    </div>
  );
};

export default BasicInfoFields;
