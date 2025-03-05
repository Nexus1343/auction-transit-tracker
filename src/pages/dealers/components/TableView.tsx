
import React from 'react';
import { Edit2, Trash2, Copy } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Dealer } from "../../../services/dealer";

interface TableViewProps {
  dealers: Dealer[];
  searchTerm: string;
  onEditDealer: (dealer: Dealer) => void;
  onDeleteDealer: (id: number) => void;
}

const TableView = ({ dealers, searchTerm, onEditDealer, onDeleteDealer }: TableViewProps) => {
  // Get all top-level dealers
  const topLevelDealers = dealers.filter(dealer => 
    dealer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (dealer.username && dealer.username.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Create a flat array of all sub-dealers
  const allSubDealers = dealers.reduce((acc, dealer) => {
    if (dealer.subDealers && dealer.subDealers.length > 0) {
      const filteredSubDealers = dealer.subDealers.filter(subDealer => 
        subDealer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (subDealer.username && subDealer.username.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      
      // Convert sub-dealers to dealers for consistent rendering, but add parent dealer info
      const mappedSubDealers = filteredSubDealers.map(subDealer => ({
        ...subDealer,
        buyer_id: null,
        buyer_id_2: null,
        dealer_fee_2: null,
        transport_price_id: null,
        container_price_id: null,
        parentDealerName: dealer.name, // Add parent dealer name
        parentDealerId: dealer.id // Add parent dealer id
      }));
      
      return [...acc, ...mappedSubDealers];
    }
    return acc;
  }, [] as Dealer[]);

  // Combine dealers and sub-dealers for display
  const filteredDealers = [...topLevelDealers, ...allSubDealers];

  return (
    <table className="w-full">
      <thead>
        <tr className="border-b">
          <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Name</th>
          <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Username</th>
          <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Mobile</th>
          <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Buyer ID</th>
          <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Dealer Fee</th>
          <th className="px-4 py-2 text-right text-sm font-medium text-gray-500">Actions</th>
        </tr>
      </thead>
      <tbody>
        {filteredDealers.map(dealer => {
          // Check if dealer has the property 'subDealers'
          const hasSubDealers = 'subDealers' in dealer && dealer.subDealers && dealer.subDealers.length > 0;
          
          return (
            <tr key={`${dealer.dealer_id ? 'sub-' : ''}${dealer.id}`} className="border-b hover:bg-gray-50">
              <td className="px-4 py-3">
                <div className="font-medium">{dealer.name}</div>
                
                {'parentDealerName' in dealer && dealer.parentDealerName && (
                  <div className="text-sm text-gray-500">
                    Sub-dealer of {dealer.parentDealerName}
                  </div>
                )}
                
                {!dealer.dealer_id && hasSubDealers && (
                  <div className="text-sm text-gray-500">
                    {dealer.subDealers.length} sub-dealers
                  </div>
                )}
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center space-x-2">
                  <span className="text-gray-600">{dealer.username}</span>
                  <button className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <Copy className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                  </button>
                </div>
              </td>
              <td className="px-4 py-3 text-gray-600">{dealer.mobile || '-'}</td>
              <td className="px-4 py-3 text-gray-600">{dealer.buyer_id || '-'}</td>
              <td className="px-4 py-3 text-gray-600">
                ${dealer.dealer_fee ? dealer.dealer_fee.toFixed(2) : '0.00'}
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-end space-x-2">
                  <Button 
                    onClick={() => onEditDealer(dealer)}
                    variant="ghost"
                    size="icon"
                  >
                    <Edit2 className="w-4 h-4 text-gray-400" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => dealer.id && onDeleteDealer(dealer.id)}
                  >
                    <Trash2 className="w-4 h-4 text-gray-400" />
                  </Button>
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default TableView;
