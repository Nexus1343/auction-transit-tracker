
import React from 'react';
import { Plus, Search, Filter, Download, RotateCw, Edit2, Trash2 } from 'lucide-react';
import { ContainerPrice } from '../types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

interface ContainerPricesTableProps {
  prices: ContainerPrice[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onAdd: () => void;
  onEdit: (price: ContainerPrice) => void;
  onDelete: (id: number) => void;
  isLoading: boolean;
}

const ContainerPricesTable: React.FC<ContainerPricesTableProps> = ({
  prices,
  searchTerm,
  setSearchTerm,
  onAdd,
  onEdit,
  onDelete,
  isLoading
}) => {
  return (
    <Card>
      {/* Controls */}
      <div className="p-4 border-b flex items-center justify-between flex-col sm:flex-row gap-4 sm:gap-0">
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <Button 
            onClick={onAdd}
            className="flex items-center space-x-2"
            disabled={isLoading}
          >
            <Plus className="w-4 h-4" />
            <span>Add Container Price</span>
          </Button>
          <select className="border rounded-lg px-3 py-2">
            <option>20 entries</option>
            <option>50 entries</option>
            <option>100 entries</option>
          </select>
        </div>
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <Input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search port, vehicle type..."
              className="pl-9 pr-4 w-full sm:w-64"
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Download className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="icon" disabled={isLoading}>
            <RotateCw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Container Prices Table */}
      <div className="p-4 overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">#</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Port</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Vehicle Type</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Price ($)</th>
              <th className="px-4 py-2 text-center text-sm font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={5} className="text-center py-4">Loading...</td>
              </tr>
            ) : prices.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-4">No container prices found</td>
              </tr>
            ) : (
              prices.map((price) => (
                <tr key={price.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-600">{price.id}</td>
                  <td className="px-4 py-3 text-gray-600">{price.port}</td>
                  <td className="px-4 py-3 text-gray-600">{price.vehicleType}</td>
                  <td className="px-4 py-3 font-medium">${price.price.toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center space-x-2">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => onEdit(price)}
                      >
                        <Edit2 className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => onDelete(price.id)}
                      >
                        <Trash2 className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      <div className="px-4 py-3 border-t flex items-center justify-between flex-col sm:flex-row gap-4 sm:gap-0">
        <div className="text-sm text-gray-500">
          Showing 1 to {prices.length} of {prices.length} entries
        </div>
        <div className="flex space-x-1">
          <button className="px-3 py-1 border rounded bg-blue-500 text-white">1</button>
          <button className="px-3 py-1 border rounded text-gray-600 hover:bg-gray-50">2</button>
          <button className="px-3 py-1 border rounded text-gray-600 hover:bg-gray-50">Next</button>
        </div>
      </div>
    </Card>
  );
};

export default ContainerPricesTable;
