
import { useState, FormEvent } from 'react';
import { Dealer } from "../../../services/dealer";

export const useDealerForm = (
  formData: Dealer, 
  setFormData: (data: Dealer) => void, 
  isSubDealer: boolean, 
  setIsSubDealer: (value: boolean) => void, 
  selectedDealer: Dealer | null,
  addDealerMutation: any,
  updateDealerMutation: any
) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    
    setFormData({
      ...formData,
      [name]: type === 'number' ? (value === '' ? null : parseFloat(value)) : value
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value === 'none' ? null : parseInt(value)
    });
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    if (name === 'isSubDealer') {
      setIsSubDealer(checked);
      
      if (checked) {
        setFormData({
          ...formData,
          transport_price_id: null,
          container_price_id: null,
          buyer_id: null,
          buyer_id_2: null,
          dealer_fee_2: 0
        });
      } else {
        setFormData({
          ...formData,
          dealer_id: null
        });
      }
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (selectedDealer) {
      updateDealerMutation.mutate(formData);
    } else {
      const subDealerData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        mobile: formData.mobile,
        dealer_fee: formData.dealer_fee,
        dealer_id: formData.dealer_id
      };
      
      isSubDealer 
        ? addDealerMutation.mutate(subDealerData as Dealer) 
        : addDealerMutation.mutate(formData);
    }
  };

  return {
    handleInputChange,
    handleSelectChange,
    handleSwitchChange,
    handleSubmit
  };
};
