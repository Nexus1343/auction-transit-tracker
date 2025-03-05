
import React, { FormEvent } from 'react';
import { Dealer } from "../../../services/dealer";
import SubDealerToggle from './form/SubDealerToggle';
import ParentDealerSelector from './form/ParentDealerSelector';
import BasicInfoFields from './form/BasicInfoFields';
import PricingFields from './form/PricingFields';
import FormFooter from './form/FormFooter';

interface DealerFormProps {
  formData: Dealer;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectChange: (name: string, value: string) => void;
  onSwitchChange: (name: string, checked: boolean) => void;
  onSubmit: (e: FormEvent) => void;
  isLoading: boolean;
  onCancel: () => void;
  transportPrices: any[];
  containerPrices: any[];
  dealers: Dealer[];
  isSubDealer: boolean;
}

const DealerForm = ({
  formData,
  onInputChange,
  onSelectChange,
  onSwitchChange,
  onSubmit,
  isLoading,
  onCancel,
  transportPrices,
  containerPrices,
  dealers,
  isSubDealer
}: DealerFormProps) => {
  return (
    <form onSubmit={onSubmit}>
      <SubDealerToggle
        isSubDealer={isSubDealer}
        onSwitchChange={onSwitchChange}
      />

      {isSubDealer && (
        <ParentDealerSelector
          formData={formData}
          onSelectChange={onSelectChange}
          dealers={dealers}
        />
      )}

      <div className="grid grid-cols-2 gap-6 mt-4">
        <BasicInfoFields
          formData={formData}
          onInputChange={onInputChange}
          isSubDealer={isSubDealer}
        />
        
        <PricingFields
          formData={formData}
          onInputChange={onInputChange}
          onSelectChange={onSelectChange}
          isSubDealer={isSubDealer}
          transportPrices={transportPrices}
          containerPrices={containerPrices}
        />
      </div>

      <FormFooter 
        isLoading={isLoading} 
        onCancel={onCancel} 
      />
    </form>
  );
};

export default DealerForm;
