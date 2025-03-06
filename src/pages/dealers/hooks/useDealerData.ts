
import { useState } from 'react';
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Dealer,
  SubDealer,
  fetchDealers,
  addDealer,
  addSubDealer,
  updateDealer,
  deleteDealer
} from "../../../services/dealer";

export const useDealerData = () => {
  const queryClient = useQueryClient();
  const [selectedDealer, setSelectedDealer] = useState<Dealer | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubDealer, setIsSubDealer] = useState(false);
  
  const [formData, setFormData] = useState<Dealer>({
    name: '',
    email: null,
    password: null,
    mobile: null,
    buyer_id: null,
    buyer_id_2: null,
    dealer_fee: 0,
    dealer_fee_2: 0,
    transport_price_id: null,
    container_price_id: null,
    dealer_id: null
  });

  const { 
    data: dealers = [], 
    isLoading: isDealersLoading,
    refetch: refetchDealers
  } = useQuery({
    queryKey: ['dealers'],
    queryFn: fetchDealers
  });

  const addDealerMutation = useMutation({
    mutationFn: (dealer: Dealer) => isSubDealer ? addSubDealer(dealer as SubDealer) : addDealer(dealer),
    onSuccess: () => {
      toast.success(`${isSubDealer ? 'Sub-dealer' : 'Dealer'} added successfully`);
      queryClient.invalidateQueries({ queryKey: ['dealers'] });
      setIsModalOpen(false);
    },
    onError: (error: any) => {
      console.error(`Error adding ${isSubDealer ? 'sub-dealer' : 'dealer'}:`, error);
      toast.error(`Failed to add ${isSubDealer ? 'sub-dealer' : 'dealer'}`);
    }
  });

  const updateDealerMutation = useMutation({
    mutationFn: updateDealer,
    onSuccess: () => {
      toast.success('Dealer updated successfully');
      queryClient.invalidateQueries({ queryKey: ['dealers'] });
      setIsModalOpen(false);
    },
    onError: (error: any) => {
      console.error('Error updating dealer:', error);
      toast.error('Failed to update dealer');
    }
  });

  const deleteDealerMutation = useMutation({
    mutationFn: deleteDealer,
    onSuccess: () => {
      toast.success('Dealer deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['dealers'] });
    },
    onError: (error: any) => {
      console.error('Error deleting dealer:', error);
      toast.error('Failed to delete dealer');
    }
  });

  const resetFormData = () => {
    setFormData({
      name: '',
      email: null,
      password: null,
      mobile: null,
      buyer_id: null,
      buyer_id_2: null,
      dealer_fee: 0,
      dealer_fee_2: 0,
      transport_price_id: null,
      container_price_id: null,
      dealer_id: null
    });
    setIsSubDealer(false);
  };

  const handleAddDealer = () => {
    setSelectedDealer(null);
    resetFormData();
    setIsModalOpen(true);
  };

  const handleEditDealer = (dealer: Dealer) => {
    const isSubDealer = !!dealer.dealer_id;
    setIsSubDealer(isSubDealer);
    setSelectedDealer(dealer);
    
    setFormData({
      id: dealer.id,
      name: dealer.name,
      email: dealer.email,
      password: dealer.password,
      mobile: dealer.mobile,
      buyer_id: dealer.buyer_id,
      buyer_id_2: dealer.buyer_id_2,
      dealer_fee: dealer.dealer_fee || 0,
      dealer_fee_2: dealer.dealer_fee_2 || 0,
      transport_price_id: dealer.transport_price_id,
      container_price_id: dealer.container_price_id,
      dealer_id: dealer.dealer_id
    });
    
    setIsModalOpen(true);
  };

  const handleDeleteDealer = (id: number) => {
    if (window.confirm('Are you sure you want to delete this dealer?')) {
      deleteDealerMutation.mutate(id);
    }
  };

  const isLoading = isDealersLoading || 
    addDealerMutation.isPending || 
    updateDealerMutation.isPending || 
    deleteDealerMutation.isPending;

  return {
    dealers,
    selectedDealer,
    isModalOpen,
    setIsModalOpen,
    isSubDealer,
    formData,
    isLoading,
    refetchDealers,
    handleAddDealer,
    handleEditDealer,
    handleDeleteDealer,
    setFormData,
    setIsSubDealer,
    addDealerMutation,
    updateDealerMutation
  };
};
