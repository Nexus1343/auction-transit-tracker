
import React from 'react';
import { Truck, Ship } from 'lucide-react';

interface PricingTabsProps {
  activeTab: 'transport' | 'container';
  setActiveTab: (tab: 'transport' | 'container') => void;
}

const PricingTabs: React.FC<PricingTabsProps> = ({ activeTab, setActiveTab }) => {
  return (
    <div className="flex border-b mb-6">
      <button
        className={`px-4 py-2 font-medium ${activeTab === 'transport' 
          ? 'border-b-2 border-blue-500 text-blue-500' 
          : 'text-gray-500 hover:text-gray-700'}`}
        onClick={() => setActiveTab('transport')}
      >
        <div className="flex items-center">
          <Truck className="w-4 h-4 mr-2" />
          Transportation Prices
        </div>
      </button>
      <button
        className={`px-4 py-2 font-medium ${activeTab === 'container' 
          ? 'border-b-2 border-blue-500 text-blue-500' 
          : 'text-gray-500 hover:text-gray-700'}`}
        onClick={() => setActiveTab('container')}
      >
        <div className="flex items-center">
          <Ship className="w-4 h-4 mr-2" />
          Container Prices
        </div>
      </button>
    </div>
  );
};

export default PricingTabs;
