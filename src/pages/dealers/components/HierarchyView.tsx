
import React, { useMemo } from 'react';
import { ChevronRight, Building, Users } from 'lucide-react';
import { Dealer } from '@/services/dealer/types';

interface HierarchyViewProps {
  dealers: Dealer[];
  searchTerm?: string;
  onSelectDealer: (dealer: Dealer) => void;
}

const HierarchyView: React.FC<HierarchyViewProps> = ({ 
  dealers, 
  searchTerm = '',
  onSelectDealer 
}) => {
  // Filter dealers based on search term
  const filteredDealers = useMemo(() => {
    if (!searchTerm) return dealers;
    
    const searchValue = searchTerm.toLowerCase();
    return dealers.filter(dealer => {
      const matchesSearch = 
        (dealer.name && dealer.name.toLowerCase().includes(searchValue)) ||
        (dealer.email && dealer.email.toLowerCase().includes(searchValue)) ||
        (dealer.mobile && dealer.mobile.toLowerCase().includes(searchValue));
        
      if (matchesSearch) return true;
      
      // Search within subdealers
      if (dealer.subDealers && dealer.subDealers.length > 0) {
        return dealer.subDealers.some(sub => 
          (sub.name && sub.name.toLowerCase().includes(searchValue)) ||
          (sub.email && sub.email.toLowerCase().includes(searchValue)) ||
          (sub.mobile && sub.mobile.toLowerCase().includes(searchValue))
        );
      }
      
      return false;
    });
  }, [dealers, searchTerm]);

  const groupedDealers = useMemo(() => {
    // Group dealers by their parentDealerId (if any)
    const grouped: Record<string, Dealer[]> = {};
    
    // Add top-level dealers (those without a parent)
    filteredDealers.forEach(dealer => {
      if (!dealer.dealer_id) {
        const key = 'root';
        if (!grouped[key]) {
          grouped[key] = [];
        }
        grouped[key].push(dealer);
      } else {
        const key = dealer.dealer_id.toString();
        if (!grouped[key]) {
          grouped[key] = [];
        }
        grouped[key].push(dealer);
      }
    });
    
    return grouped;
  }, [filteredDealers]);

  const renderDealer = (dealer: Dealer, level = 0) => {
    const hasChildren = groupedDealers[dealer.id?.toString() || ''] || 
                       (dealer.subDealers && dealer.subDealers.length > 0);
    
    return (
      <div key={dealer.id}>
        <div 
          className={`
            flex items-center p-3 rounded-md cursor-pointer
            ${level === 0 ? 'bg-blue-50 hover:bg-blue-100' : 'hover:bg-gray-100'}
          `}
          style={{ paddingLeft: `${level * 20 + 12}px` }}
          onClick={() => onSelectDealer(dealer)}
        >
          {hasChildren && <ChevronRight className="w-4 h-4 mr-2 text-gray-400" />}
          
          {level === 0 ? (
            <Building className="w-5 h-5 mr-2 text-blue-500" />
          ) : (
            <Users className="w-5 h-5 mr-2 text-gray-500" />
          )}
          
          <div>
            <div className="font-medium">{dealer.name}</div>
            <div className="text-xs text-gray-500">{dealer.email || 'No email'}</div>
          </div>
        </div>
        
        {/* Render child dealers if any */}
        {groupedDealers[dealer.id?.toString() || ''] && (
          <div className="ml-4">
            {groupedDealers[dealer.id?.toString() || ''].map(childDealer => 
              renderDealer(childDealer, level + 1)
            )}
          </div>
        )}
        
        {/* Render subdealers */}
        {dealer.subDealers && dealer.subDealers.length > 0 && (
          <div className="ml-8">
            {dealer.subDealers.map(subDealer => {
              // Create a full Dealer object from the sub-dealer
              const subDealerAsDealer: Dealer = {
                ...subDealer,
                buyer_id: null,
                buyer_id_2: null,
                dealer_fee_2: 0,
                transport_price_id: null,
                container_price_id: null,
                subDealers: [],
                parentDealerName: dealer.name
              };
              
              return (
                <div 
                  key={subDealer.id} 
                  className="flex items-center p-3 hover:bg-gray-100 rounded-md cursor-pointer"
                  onClick={() => onSelectDealer(subDealerAsDealer)}
                >
                  <Users className="w-5 h-5 mr-2 text-gray-400" />
                  <div>
                    <div className="font-medium">{subDealer.name}</div>
                    <div className="text-xs text-gray-500">{subDealer.email || 'No email'}</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 h-full overflow-auto">
      <div className="mb-4 text-lg font-semibold">Dealer Hierarchy</div>
      <div className="space-y-2">
        {groupedDealers['root']?.map(dealer => renderDealer(dealer))}
      </div>
    </div>
  );
};

export default HierarchyView;
