
import React, { useState } from 'react';
import PricingTabs from './components/PricingTabs';
import TransportPricesTable from './components/TransportPricesTable';
import ContainerPricesTable from './components/ContainerPricesTable';
import TransportPriceModal from './components/modals/TransportPriceModal';
import ContainerPriceModal from './components/modals/ContainerPriceModal';
import { usePricingData } from './hooks/usePricingData';
import { usePricingModals } from './hooks/usePricingModals';
import { TransportPrice, ContainerPrice } from './types';

const PricingPage: React.FC = () => {
  // State for tabs
  const [activeTab, setActiveTab] = useState<'transport' | 'container'>('transport');
  
  // Use custom hooks for data and modals
  const {
    transportPrices,
    containerPrices,
    isLoading,
    transportSearchTerm,
    containerSearchTerm,
    setTransportSearchTerm,
    setContainerSearchTerm,
    handleSaveTransportPrice,
    handleSaveContainerPrice,
    handleDeleteTransportPrice,
    handleDeleteContainerPrice
  } = usePricingData();

  const {
    transportModalOpen,
    containerModalOpen,
    selectedTransportPrice,
    selectedContainerPrice,
    openTransportModal,
    closeTransportModal,
    openContainerModal,
    closeContainerModal
  } = usePricingModals();

  // Handler functions that combine the modal and data operations
  const onSaveTransportPrice = (formData: Omit<TransportPrice, 'id'>) => {
    handleSaveTransportPrice(formData, selectedTransportPrice);
    closeTransportModal();
  };

  const onSaveContainerPrice = (formData: Omit<ContainerPrice, 'id'>) => {
    handleSaveContainerPrice(formData, selectedContainerPrice);
    closeContainerModal();
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
          prices={transportPrices}
          searchTerm={transportSearchTerm}
          setSearchTerm={setTransportSearchTerm}
          onAdd={() => openTransportModal()}
          onEdit={(price) => openTransportModal(price)}
          onDelete={handleDeleteTransportPrice}
          isLoading={isLoading}
        />
      ) : (
        <ContainerPricesTable 
          prices={containerPrices}
          searchTerm={containerSearchTerm}
          setSearchTerm={setContainerSearchTerm}
          onAdd={() => openContainerModal()}
          onEdit={(price) => openContainerModal(price)}
          onDelete={handleDeleteContainerPrice}
          isLoading={isLoading}
        />
      )}

      {/* Modals */}
      <TransportPriceModal 
        isOpen={transportModalOpen} 
        onClose={closeTransportModal}
        onSave={onSaveTransportPrice}
        selectedPrice={selectedTransportPrice}
      />

      <ContainerPriceModal 
        isOpen={containerModalOpen} 
        onClose={closeContainerModal}
        onSave={onSaveContainerPrice}
        selectedPrice={selectedContainerPrice}
      />
    </div>
  );
};

export default PricingPage;
