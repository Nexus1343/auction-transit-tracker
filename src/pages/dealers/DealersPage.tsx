
import React from 'react';
import { Card } from "@/components/ui/card";

import { useDealerData } from './hooks/useDealerData';
import { useDealerForm } from './hooks/useDealerForm';
import { usePricingData } from './hooks/usePricingData';
import { useSearch } from './hooks/useSearch';
import { useViewToggle } from './hooks/useViewToggle';

import ViewToggle from './components/ViewToggle';
import DealerActionsBar from './components/DealerActionsBar';
import TableView from './components/TableView';
import HierarchyView from './components/HierarchyView';
import DealerDialog from './components/DealerDialog';

const DealersPage = () => {
  const { 
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
  } = useDealerData();

  const { searchTerm, handleSearchChange } = useSearch();
  const { activeView, setActiveView } = useViewToggle();
  const { transportPrices, containerPrices } = usePricingData();

  const {
    handleInputChange,
    handleSelectChange,
    handleSwitchChange,
    handleSubmit
  } = useDealerForm(
    formData, 
    setFormData, 
    isSubDealer, 
    setIsSubDealer, 
    selectedDealer,
    addDealerMutation,
    updateDealerMutation
  );

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
          onSearchChange={handleSearchChange}
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
        onSubmit={handleSubmit}
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
