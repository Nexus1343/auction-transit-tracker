
import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import { Dealer, SubDealer } from '@/services/dealer/types';

interface TableViewProps {
  dealers: Dealer[];
  searchTerm?: string;
  onEditDealer: (dealer: Dealer) => void;
  onDeleteDealer: (dealer: Dealer) => void;
}

interface DealerDisplayRow extends Dealer {
  isSubDealer: boolean;
  parentDealerName: string;
}

const TableView: React.FC<TableViewProps> = ({ 
  dealers, 
  searchTerm = '', 
  onEditDealer, 
  onDeleteDealer 
}) => {
  const allDealers: DealerDisplayRow[] = dealers.flatMap(dealer => {
    const mainDealer: DealerDisplayRow = {
      ...dealer,
      isSubDealer: false,
      parentDealerName: dealer.parentDealerName || '-'
    };
    
    const subDealers = dealer.subDealers?.map(sub => ({
      ...sub,
      isSubDealer: true,
      parentDealerName: dealer.name,
      buyer_id: null,
      buyer_id_2: null,
      dealer_fee_2: null,
      transport_price_id: null,
      container_price_id: null
    } as DealerDisplayRow)) || [];
    
    return [mainDealer, ...subDealers];
  });

  const filteredDealers = allDealers.filter(dealer => {
    if (!searchTerm) return true;
    
    const searchValue = searchTerm.toLowerCase();
    return (
      (dealer.name && dealer.name.toLowerCase().includes(searchValue)) ||
      (dealer.email && dealer.email.toLowerCase().includes(searchValue)) ||
      (dealer.mobile && dealer.mobile.toLowerCase().includes(searchValue)) ||
      (dealer.parentDealerName && dealer.parentDealerName.toLowerCase().includes(searchValue))
    );
  });
  
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mobile
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Dealer Fee
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Parent
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredDealers.map((dealer) => (
              <tr key={`${dealer.isSubDealer ? 'sub-' : ''}${dealer.id}`} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{dealer.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{dealer.email || '-'}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{dealer.mobile || '-'}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">
                    {dealer.dealer_fee ? `$${dealer.dealer_fee}` : '-'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{dealer.parentDealerName}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    dealer.isSubDealer 
                      ? 'bg-yellow-100 text-yellow-800' 
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {dealer.isSubDealer ? 'Sub-Dealer' : 'Dealer'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => onEditDealer(dealer)}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDeleteDealer(dealer)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableView;
