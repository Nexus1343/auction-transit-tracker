
import React, { useState, useEffect } from 'react';
import { fetchTransportPrices, fetchContainerPrices } from '@/services/dealer/priceService';
import { toast } from '@/components/ui/use-toast';
import PricingTabs from './components/PricingTabs';
import TransportPricesTable from './components/TransportPricesTable';
import ContainerPricesTable from './components/ContainerPricesTable';
import TransportPriceModal from './components/modals/TransportPriceModal';
import ContainerPriceModal from './components/modals/ContainerPriceModal';
import { TransportPrice, ContainerPrice } from './types';

const PricingPage: React.FC = () => {
  // State for tabs
  const [activeTab, setActiveTab] = useState<'transport' | 'container'>('transport');
  
  // State for modals
  const [transportModalOpen, setTransportModalOpen] = useState(false);
  const [containerModalOpen, setContainerModalOpen] = useState(false);
  const [selectedTransportPrice, setSelectedTransportPrice] = useState<TransportPrice | null>(null);
  const [selectedContainerPrice, setSelectedContainerPrice] = useState<ContainerPrice | null>(null);
  
  // State for prices
  const [transportPrices, setTransportPrices] = useState<TransportPrice[]>([]);
  const [transportSearchTerm, setTransportSearchTerm] = useState('');
  const [containerPrices, setContainerPrices] = useState<ContainerPrice[]>([]);
  const [containerSearchTerm, setContainerSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [transportData, containerData] = await Promise.all([
          fetchTransportPrices(),
          fetchContainerPrices()
        ]);
        
        setTransportPrices(transportData as TransportPrice[]);
        setContainerPrices(containerData as ContainerPrice[]);
      } catch (error) {
        console.error('Error loading price data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load pricing data',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Filter transport prices based on search term
  const filteredTransportPrices = transportPrices.filter(price => {
    return !transportSearchTerm || 
      Object.values(price).some(value => 
        value?.toString().toLowerCase().includes(transportSearchTerm.toLowerCase())
      );
  });

  // Filter container prices based on search term
  const filteredContainerPrices = containerPrices.filter(price => {
    return !containerSearchTerm || 
      Object.values(price).some(value => 
        value?.toString().toLowerCase().includes(containerSearchTerm.toLowerCase())
      );
  });

  // Handler for adding/updating a transport price
  const handleSaveTransportPrice = (formData: Omit<TransportPrice, 'id'>) => {
    const priceData = {
      ...formData,
      price: parseFloat(formData.price.toString())
    };
    
    if (selectedTransportPrice) {
      // Update existing price
      setTransportPrices(transportPrices.map(price => 
        price.id === selectedTransportPrice.id 
          ? { ...price, ...priceData } 
          : price
      ));
      toast({
        title: "Success",
        description: "Transportation price updated successfully",
      });
    } else {
      // Add new price
      const nextId = Math.max(...transportPrices.map(p => p.id || 0), 0) + 1;
      setTransportPrices([...transportPrices, { id: nextId, ...priceData }]);
      toast({
        title: "Success",
        description: "New transportation price added successfully",
      });
    }
    
    setTransportModalOpen(false);
    setSelectedTransportPrice(null);
  };

  // Handler for adding/updating a container price
  const handleSaveContainerPrice = (formData: Omit<ContainerPrice, 'id'>) => {
    const priceData = {
      ...formData,
      price: parseFloat(formData.price.toString())
    };
    
    if (selectedContainerPrice) {
      // Update existing price
      setContainerPrices(containerPrices.map(price => 
        price.id === selectedContainerPrice.id 
          ? { ...price, ...priceData } 
          : price
      ));
      toast({
        title: "Success",
        description: "Container price updated successfully",
      });
    } else {
      // Add new price
      const nextId = Math.max(...containerPrices.map(p => p.id || 0), 0) + 1;
      setContainerPrices([...containerPrices, { id: nextId, ...priceData }]);
      toast({
        title: "Success",
        description: "New container price added successfully",
      });
    }
    
    setContainerModalOpen(false);
    setSelectedContainerPrice(null);
  };

  // Handler for deleting a transport price
  const handleDeleteTransportPrice = (id: number) => {
    setTransportPrices(transportPrices.filter(price => price.id !== id));
    toast({
      title: "Success",
      description: "Transportation price deleted successfully",
    });
  };

  // Handler for deleting a container price
  const handleDeleteContainerPrice = (id: number) => {
    setContainerPrices(containerPrices.filter(price => price.id !== id));
    toast({
      title: "Success",
      description: "Container price deleted successfully",
    });
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pricing Management</h1>
          <p className="text-gray-600">Manage transportation and container pricing</p>
        </div>
      </div>

      {/* Tabs */}
      <PricingTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Content based on active tab */}
      {activeTab === 'transport' ? (
        <TransportPricesTable 
          prices={filteredTransportPrices}
          searchTerm={transportSearchTerm}
          setSearchTerm={setTransportSearchTerm}
          onAdd={() => {
            setSelectedTransportPrice(null);
            setTransportModalOpen(true);
          }}
          onEdit={(price) => {
            setSelectedTransportPrice(price);
            setTransportModalOpen(true);
          }}
          onDelete={handleDeleteTransportPrice}
          isLoading={isLoading}
        />
      ) : (
        <ContainerPricesTable 
          prices={filteredContainerPrices}
          searchTerm={containerSearchTerm}
          setSearchTerm={setContainerSearchTerm}
          onAdd={() => {
            setSelectedContainerPrice(null);
            setContainerModalOpen(true);
          }}
          onEdit={(price) => {
            setSelectedContainerPrice(price);
            setContainerModalOpen(true);
          }}
          onDelete={handleDeleteContainerPrice}
          isLoading={isLoading}
        />
      )}

      {/* Modals */}
      <TransportPriceModal 
        isOpen={transportModalOpen} 
        onClose={() => {
          setTransportModalOpen(false);
          setSelectedTransportPrice(null);
        }}
        onSave={handleSaveTransportPrice}
        selectedPrice={selectedTransportPrice}
      />

      <ContainerPriceModal 
        isOpen={containerModalOpen} 
        onClose={() => {
          setContainerModalOpen(false);
          setSelectedContainerPrice(null);
        }}
        onSave={handleSaveContainerPrice}
        selectedPrice={selectedContainerPrice}
      />
    </div>
  );
};

export default PricingPage;
