import React, { useState, useEffect, FormEvent } from 'react';
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { 
  Dealer, 
  SubDealer,
  fetchDealers, 
  addDealer,
  addSubDealer,
  updateDealer, 
  deleteDealer,
  fetchTransportPrices,
  fetchContainerPrices
} from "../../services/dealer";

import ViewToggle from './components/ViewToggle';
import DealerActionsBar from './components/DealerActionsBar';
import TableView from './components/TableView';
import HierarchyView from './components/HierarchyView';
import DealerDialog from './components/DealerDialog';

const DealersPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [activeView, setActiveView] = useState<'table' | 'hierarchy'>('table');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDealer, setSelectedDealer] = useState<Dealer | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSubDealer, setIsSubDealer] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit' | 'add-subdealer'>('create');
  const [isAddingSubDealer, setIsAddingSubDealer] = useState(false);
  const [showDealerDialog, setShowDealerDialog] = useState(false);
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

  const { 
    data: transportPrices = []
  } = useQuery({
    queryKey: ['transportPrices'],
    queryFn: fetchTransportPrices
  });

  const { 
    data: containerPrices = []
  } = useQuery({
    queryKey: ['containerPrices'],
    queryFn: fetchContainerPrices
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

  useEffect(() => {
    if (selectedDealer) {
      const isSelectedSubDealer = !!selectedDealer.dealer_id;
      setIsSubDealer(isSelectedSubDealer);
      
      setFormData({
        id: selectedDealer.id,
        name: selectedDealer.name,
        email: selectedDealer.email,
        password: selectedDealer.password,
        mobile: selectedDealer.mobile,
        buyer_id: selectedDealer.buyer_id,
        buyer_id_2: selectedDealer.buyer_id_2,
        dealer_fee: selectedDealer.dealer_fee,
        dealer_fee_2: selectedDealer.dealer_fee_2,
        transport_price_id: selectedDealer.transport_price_id,
        container_price_id: selectedDealer.container_price_id,
        dealer_id: selectedDealer.dealer_id
      });
    } else {
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
    }
  }, [selectedDealer]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? (value === '' ? null : parseFloat(value)) : value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value === 'none' ? null : parseInt(value)
    }));
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    if (name === 'isSubDealer') {
      setIsSubDealer(checked);
      
      if (checked) {
        setFormData(prev => ({
          ...prev,
          transport_price_id: null,
          container_price_id: null,
          buyer_id: '',
          buyer_id_2: '',
          dealer_fee_2: 0
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          dealer_id: null
        }));
      }
    }
  };

  const handleAddDealer = () => {
    setFormMode('create');
    setSelectedDealer({
      name: '',
      email: null,
      password: null,
      mobile: null,
      buyer_id: null,
      buyer_id_2: null,
      dealer_fee: 0,
      dealer_fee_2: 0,
      transport_price_id: null,
      container_price_id: null
    });
    setIsAddingSubDealer(false);
    setShowDealerDialog(true);
  };

  const handleEditDealer = (dealer: Dealer) => {
    const isSubDealer = !!dealer.dealer_id;
    setIsSubDealer(isSubDealer);
    setSelectedDealer(dealer);
    setIsModalOpen(true);
  };

  const handleDealerFormSubmit = async (data: Dealer) => {
    try {
      setIsSubmitting(true);
      
      if (formMode === 'create') {
        let dealerToCreate: Dealer = {
          name: data.name,
          email: data.email,
          password: data.password,
          mobile: data.mobile,
          buyer_id: data.buyer_id,
          buyer_id_2: data.buyer_id_2,
          dealer_fee: data.dealer_fee,
          dealer_fee_2: data.dealer_fee_2,
          transport_price_id: data.transport_price_id,
          container_price_id: data.container_price_id,
        };
        
        if (data.parentDealerId) {
          dealerToCreate = {
            ...dealerToCreate,
            dealer_id: data.parentDealerId
          };
        }
        
        if (data.subDealers && data.subDealers.length > 0) {
          dealerToCreate.subDealers = data.subDealers.map(sub => ({
            name: sub.name,
            email: sub.email,
            password: sub.password,
            mobile: sub.mobile,
            dealer_fee: sub.dealer_fee
          }));
        }
        
        const newDealer = await createDealer(dealerToCreate);
        
        if (newDealer) {
          toast({
            title: "Dealer created",
            description: `${newDealer.name} has been created successfully.`,
          });
          
          const updatedDealers = await getAllDealers();
          setDealers(updatedDealers);
        }
      } else if (formMode === 'edit') {
        const updatedDealer = await updateDealer({
          id: selectedDealer.id,
          name: data.name,
          email: data.email,
          password: data.password,
          mobile: data.mobile,
          buyer_id: data.buyer_id,
          buyer_id_2: data.buyer_id_2,
          dealer_fee: data.dealer_fee,
          dealer_fee_2: data.dealer_fee_2,
          transport_price_id: data.transport_price_id,
          container_price_id: data.container_price_id,
        });
        
        if (updatedDealer) {
          toast({
            title: "Dealer updated",
            description: `${updatedDealer.name} has been updated successfully.`,
          });
          
          const updatedDealers = await getAllDealers();
          setDealers(updatedDealers);
        }
      } else if (formMode === 'add-subdealer' && selectedDealer.id) {
        const updatedDealer = await addSubDealer({
          name: data.name,
          email: data.email,
          password: data.password,
          mobile: data.mobile,
          dealer_fee: data.dealer_fee,
          dealer_id: selectedDealer.id
        });
        
        if (updatedDealer) {
          toast({
            title: "Sub-dealer added",
            description: `${updatedDealer.name} has been added successfully.`,
          });
          
          const updatedDealers = await getAllDealers();
          setDealers(updatedDealers);
        }
      }
      
      setFormMode('create');
      setSelectedDealer(null);
      setIsModalOpen(false);
      setIsAddingSubDealer(false);
      setShowDealerDialog(false);
    } catch (error) {
      console.error('Error submitting dealer form:', error);
      toast.error('Failed to submit dealer form');
    }
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

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dealers</h1>
          <p className="text-gray-600">Manage your dealers and sub-dealers</p>
        </div>
        <ViewToggle 
          activeView={activeView} 
          onViewChange={setActiveView}
        />
      </div>

      <Card>
        <DealerActionsBar
          onAddDealer={handleAddDealer}
          searchTerm={searchTerm}
          onSearchChange={(e) => setSearchTerm(e.target.value)}
          onRefresh={() => refetchDealers()}
          isLoading={isLoading}
        />

        <div className="p-4">
          {isLoading ? (
            <div className="flex justify-center items-center py-10">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
            </div>
          ) : activeView === 'table' ? (
            <TableView 
              dealers={dealers}
              searchTerm={searchTerm}
              onEditDealer={handleEditDealer}
              onDeleteDealer={handleDeleteDealer}
            />
          ) : (
            <HierarchyView 
              dealers={dealers}
              searchTerm={searchTerm}
              onSelectDealer={handleEditDealer}
            />
          )}
        </div>
      </Card>

      <DealerDialog
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        selectedDealer={selectedDealer}
        formData={formData}
        onInputChange={handleInputChange}
        onSelectChange={handleSelectChange}
        onSwitchChange={handleSwitchChange}
        onSubmit={handleDealerFormSubmit}
        isLoading={isLoading}
        transportPrices={transportPrices}
        containerPrices={containerPrices}
        dealers={dealers}
        isSubDealer={isSubDealer}
      />
    </div>
  );
};

export default DealersPage;
