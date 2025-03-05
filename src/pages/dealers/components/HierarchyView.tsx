
import React, { useMemo } from 'react';
import { ChevronRight, Building, Users } from 'lucide-react';
import { Dealer } from '@/services/dealer/types';

interface HierarchyViewProps {
  dealers: Dealer[];
  onSelectDealer: (dealer: Dealer) => void;
}

const HierarchyView: React.FC<HierarchyViewProps> = ({ dealers, onSelectDealer }) => {
  const groupedDealers = useMemo(() => {
    // Group dealers by their parentDealerId (if any)
    const grouped: Record<string, Dealer[]> = {};
    
    // Add top-level dealers (those without a parent)
    dealers.forEach(dealer => {
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
  }, [dealers]);

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
            {dealer.subDealers.map(subDealer => (
              <div 
                key={subDealer.id} 
                className="flex items-center p-3 hover:bg-gray-100 rounded-md cursor-pointer"
                onClick={() => onSelectDealer({ 
                  ...dealer, 
                  name: subDealer.name,
                  email: subDealer.email,
                  mobile: subDealer.mobile,
                  dealer_fee: subDealer.dealer_fee,
                  id: subDealer.id,
                  subDealerId: subDealer.id,
                  isSubDealer: true
                } as any)}
              >
                <Users className="w-5 h-5 mr-2 text-gray-400" />
                <div>
                  <div className="font-medium">{subDealer.name}</div>
                  <div className="text-xs text-gray-500">{subDealer.email || 'No email'}</div>
                </div>
              </div>
            ))}
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
