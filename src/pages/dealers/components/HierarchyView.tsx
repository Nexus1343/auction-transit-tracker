
import React from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Dealer, SubDealer } from "../../../services/dealerService";

interface HierarchyViewProps {
  dealers: Dealer[];
  searchTerm: string;
  onSelectDealer: (dealer: Dealer) => void;
}

const HierarchyView = ({ dealers, searchTerm, onSelectDealer }: HierarchyViewProps) => {
  const filteredDealers = dealers.filter(dealer => 
    dealer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (dealer.username && dealer.username.toLowerCase().includes(searchTerm.toLowerCase())) ||
    // Also include dealers if any of their sub-dealers match search
    (dealer.subDealers && dealer.subDealers.some(subDealer => 
      subDealer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (subDealer.username && subDealer.username.toLowerCase().includes(searchTerm.toLowerCase()))
    ))
  );

  const renderHierarchyItem = (dealer: Dealer, level = 0) => {
    const hasSubDealers = dealer.subDealers && dealer.subDealers.length > 0;
    
    return (
      <div key={dealer.id} className="select-none">
        <div 
          className={`
            flex items-center p-2 hover:bg-gray-50 cursor-pointer
            ${level > 0 ? 'ml-6' : ''}
          `}
          onClick={() => onSelectDealer(dealer)}
        >
          {hasSubDealers ? (
            <ChevronDown className="w-4 h-4 text-gray-400 mr-2" />
          ) : (
            <ChevronRight className="w-4 h-4 text-gray-400 mr-2" />
          )}
          <div className="flex-1">
            <div className="font-medium">{dealer.name}</div>
            <div className="text-sm text-gray-500">{dealer.username}</div>
          </div>
          <div className="text-sm text-gray-500">
            ${dealer.dealer_fee ? dealer.dealer_fee.toFixed(2) : '0.00'}
          </div>
        </div>
        {hasSubDealers && (
          <div className="border-l-2 border-gray-100 ml-3">
            {dealer.subDealers.map((subDealer: SubDealer) => {
              // Convert SubDealer to Dealer with all required properties
              const subDealerAsDealer: Dealer = {
                ...subDealer,
                buyer_id: null,
                buyer_id_2: null,
                dealer_fee_2: null,
                transport_price_id: null,
                container_price_id: null,
                subDealers: []
              };
              return renderHierarchyItem(subDealerAsDealer, level + 1);
            })}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg">
      {filteredDealers.map(dealer => renderHierarchyItem(dealer))}
    </div>
  );
};

export default HierarchyView;
