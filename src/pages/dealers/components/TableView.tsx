
import React from 'react';
import { Edit2, Trash2, Copy } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Dealer } from "../../../services/dealerService";

interface TableViewProps {
  dealers: Dealer[];
  searchTerm: string;
  onEditDealer: (dealer: Dealer) => void;
  onDeleteDealer: (id: number) => void;
}

const TableView = ({ dealers, searchTerm, onEditDealer, onDeleteDealer }: TableViewProps) => {
  const filteredDealers = dealers.filter(dealer => 
    dealer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (dealer.username && dealer.username.toLowerCase().includes(searchTerm.toLowerCase()))
  );

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
        {filteredDealers.map(dealer => (
          <tr key={dealer.id} className="border-b hover:bg-gray-50">
            <td className="px-4 py-3">
              <div className="font-medium">{dealer.name}</div>
              {dealer.subDealers?.length > 0 && (
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
            <td className="px-4 py-3 text-gray-600">{dealer.buyer_id}</td>
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
        ))}
      </tbody>
    </table>
  );
};

export default TableView;
