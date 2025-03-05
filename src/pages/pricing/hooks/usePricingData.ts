
import { useState, useEffect } from 'react';
import { 
  fetchTransportPrices, 
  fetchContainerPrices,
  addTransportPrice,
  updateTransportPrice,
  deleteTransportPrice,
  addContainerPrice,
  updateContainerPrice,
  deleteContainerPrice
} from '@/services/dealer/priceService';
import { TransportPrice, ContainerPrice } from '../types';
import { toast } from 'sonner';

export const usePricingData = () => {
  // State for prices
  const [transportPrices, setTransportPrices] = useState<TransportPrice[]>([]);
  const [containerPrices, setContainerPrices] = useState<ContainerPrice[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // State for search terms
  const [transportSearchTerm, setTransportSearchTerm] = useState('');
  const [containerSearchTerm, setContainerSearchTerm] = useState('');

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const [transportData, containerData] = await Promise.all([
          fetchTransportPrices(),
          fetchContainerPrices()
        ]);
        
        // Map the data to match our types
        const mappedTransportData = transportData.map((item: any): TransportPrice => ({
          id: item.id,
          city: item.city || '',
          city2: item.city2 || null,
          zip: item.zip || '',
          state: item.state || '',
          port: item.port || '',
          price: item.price || 0
        }));
        
        const mappedContainerData = containerData.map((item: any): ContainerPrice => ({
          id: item.id,
          port: item.port || '',
          vehicleType: item.vehicle_type || '',
          price: item.price || 0
        }));
        
        setTransportPrices(mappedTransportData);
        setContainerPrices(mappedContainerData);
      } catch (error) {
        console.error('Error loading price data:', error);
        toast.error('Failed to load pricing data');
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
  const handleSaveTransportPrice = async (formData: Omit<TransportPrice, 'id'>, selectedPrice: TransportPrice | null) => {
    const priceData = {
      ...formData,
      price: parseFloat(formData.price.toString())
    };
    
    try {
      if (selectedPrice) {
        // Update existing price
        const updatedPrice = await updateTransportPrice(selectedPrice.id, priceData);
        if (updatedPrice) {
          setTransportPrices(transportPrices.map(price => 
            price.id === selectedPrice.id 
              ? { ...price, ...priceData } 
              : price
          ));
        }
      } else {
        // Add new price
        const newPrice = await addTransportPrice(priceData);
        if (newPrice) {
          setTransportPrices([...transportPrices, {
            id: newPrice.id,
            city: newPrice.city || '',
            city2: newPrice.city2 || null,
            zip: newPrice.zip || '',
            state: newPrice.state || '',
            port: newPrice.port || '',
            price: newPrice.price || 0
          }]);
        }
      }
    } catch (error) {
      console.error('Error saving transport price:', error);
    }
  };

  // Handler for adding/updating a container price
  const handleSaveContainerPrice = async (formData: Omit<ContainerPrice, 'id'>, selectedPrice: ContainerPrice | null) => {
    const priceData = {
      ...formData,
      price: parseFloat(formData.price.toString())
    };
    
    try {
      if (selectedPrice) {
        // Update existing price
        const updatedPrice = await updateContainerPrice(selectedPrice.id, priceData);
        if (updatedPrice) {
          setContainerPrices(containerPrices.map(price => 
            price.id === selectedPrice.id 
              ? { 
                  id: price.id,
                  port: updatedPrice.port || '',
                  vehicleType: updatedPrice.vehicle_type || '',
                  price: updatedPrice.price || 0
                } 
              : price
          ));
        }
      } else {
        // Add new price
        const newPrice = await addContainerPrice(priceData);
        if (newPrice) {
          setContainerPrices([...containerPrices, {
            id: newPrice.id,
            port: newPrice.port || '',
            vehicleType: newPrice.vehicle_type || '',
            price: newPrice.price || 0
          }]);
        }
      }
    } catch (error) {
      console.error('Error saving container price:', error);
    }
  };

  // Handler for deleting a transport price
  const handleDeleteTransportPrice = async (id: number) => {
    const success = await deleteTransportPrice(id);
    if (success) {
      setTransportPrices(transportPrices.filter(price => price.id !== id));
    }
  };

  // Handler for deleting a container price
  const handleDeleteContainerPrice = async (id: number) => {
    const success = await deleteContainerPrice(id);
    if (success) {
      setContainerPrices(containerPrices.filter(price => price.id !== id));
    }
  };

  return {
    transportPrices: filteredTransportPrices,
    containerPrices: filteredContainerPrices,
    isLoading,
    transportSearchTerm,
    containerSearchTerm,
    setTransportSearchTerm,
    setContainerSearchTerm,
    handleSaveTransportPrice,
    handleSaveContainerPrice,
    handleDeleteTransportPrice,
    handleDeleteContainerPrice
  };
};
