import React, { useState, useEffect, FormEvent } from 'react';
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

import { 
  Dealer, 
  fetchDealers, 
  addDealer, 
  updateDealer, 
  deleteDealer,
  fetchTransportPrices,
  fetchContainerPrices
} from "../../services/dealerService";

import ViewToggle from './components/ViewToggle';
import DealerActionsBar from './components/DealerActionsBar';
import TableView from './components/TableView';
import HierarchyView from './components/HierarchyView';
import DealerDialog from './components/DealerDialog';

const DealersPage = () => {
  const [activeView, setActiveView] = useState<'table' | 'hierarchy'>('table');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDealer, setSelectedDealer] = useState<Dealer | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [dealers, setDealers] = useState<Dealer[]>([]);
  const [transportPrices, setTransportPrices] = useState<any[]>([]);
  const [containerPrices, setContainerPrices] = useState<any[]>([]);
  
  // Form state
  const [formData, setFormData] = useState<Dealer>({
    name: '',
    username: '',
    password: '',
    mobile: '',
    buyer_id: '',
    buyer_id_2: '',
    dealer_fee: 0,
    dealer_fee_2: 0,
    transport_price_id: null,
    container_price_id: null
  });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    // Reset form when selected dealer changes
    if (selectedDealer) {
      setFormData({
        id: selectedDealer.id,
        name: selectedDealer.name,
        username: selectedDealer.username || '',
        password: selectedDealer.password || '',
        mobile: selectedDealer.mobile || '',
        buyer_id: selectedDealer.buyer_id || '',
        buyer_id_2: selectedDealer.buyer_id_2 || '',
        dealer_fee: selectedDealer.dealer_fee || 0,
        dealer_fee_2: selectedDealer.dealer_fee_2 || 0,
        transport_price_id: selectedDealer.transport_price_id,
        container_price_id: selectedDealer.container_price_id
      });
    } else {
      // Reset form for new dealer
      setFormData({
        name: '',
        username: '',
        password: '',
        mobile: '',
        buyer_id: '',
        buyer_id_2: '',
        dealer_fee: 0,
        dealer_fee_2: 0,
        transport_price_id: null,
        container_price_id: null
      });
    }
  }, [selectedDealer]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [dealersData, transportData, containerData] = await Promise.all([
        fetchDealers(),
        fetchTransportPrices(),
        fetchContainerPrices()
      ]);
      
      setDealers(dealersData);
      setTransportPrices(transportData);
      setContainerPrices(containerData);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (selectedDealer) {
        // Update existing dealer
        await updateDealer(formData);
      } else {
        // Add new dealer
        await addDealer(formData);
      }
      
      // Reload data after update
      await loadData();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving dealer:', error);
      toast.error('Failed to save dealer');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteDealer = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this dealer?')) {
      setIsLoading(true);
      try {
        await deleteDealer(id);
        await loadData();
      } catch (error) {
        console.error('Error deleting dealer:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleAddDealer = () => {
    setSelectedDealer(null);
    setIsModalOpen(true);
  };
  
  const handleEditDealer = (dealer: Dealer) => {
    setSelectedDealer(dealer);
    setIsModalOpen(true);
  };

  return (
    <div className="p-6">
      {/* Header */}
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

      {/* Controls and Content */}
      <Card>
        <DealerActionsBar
          onAddDealer={handleAddDealer}
          searchTerm={searchTerm}
          onSearchChange={(e) => setSearchTerm(e.target.value)}
          onRefresh={loadData}
          isLoading={isLoading}
        />

        {/* Content */}
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

      {/* Add/Edit Modal */}
      <DealerDialog
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        selectedDealer={selectedDealer}
        formData={formData}
        onInputChange={handleInputChange}
        onSelectChange={handleSelectChange}
        onSubmit={handleSubmit}
        isLoading={isLoading}
        transportPrices={transportPrices}
        containerPrices={containerPrices}
      />
    </div>
  );
};

export default DealersPage;
