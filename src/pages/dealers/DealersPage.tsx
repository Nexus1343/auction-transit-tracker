
import React, { useState } from 'react';
import { 
  Plus, 
  Download, 
  RotateCw, 
  Search, 
  ChevronDown, 
  ChevronRight, 
  Copy,
  Edit2,
  Trash2
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";

const DealersPage = () => {
  const [activeView, setActiveView] = useState('table'); // 'table' or 'hierarchy'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDealer, setSelectedDealer] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Sample data - replace with your actual data
  const dealers = [
    {
      id: 133,
      name: 'Mirian kazaishvili',
      username: 'Mkazaishvili@americars.ge',
      password: 'mk123',
      mobile: '',
      buyer_id: 'Atlantic',
      buyer_id_2: 'Atlantic',
      dealer_fee: 290.00,
      dealer_fee_2: 350.00,
      transport_price_id: 1,
      container_price_id: 2,
      subDealers: []
    },
    {
      id: 132,
      name: 'Dealer1',
      username: 'Dealer1@americars.ge',
      password: 'dealer1',
      mobile: '',
      buyer_id: 'Atlantic',
      buyer_id_2: 'Atlantic',
      dealer_fee: 390.00,
      dealer_fee_2: 410.00,
      transport_price_id: 3,
      container_price_id: 1,
      subDealers: []
    },
    {
      id: 131,
      name: 'Giga Chumburidze',
      username: 'gigachumburidze@americars.ge',
      password: 'giga123',
      mobile: '577038877',
      buyer_id: 'Atlantic',
      buyer_id_2: 'Atlantic',
      dealer_fee: 650.00,
      dealer_fee_2: 700.00,
      transport_price_id: 2,
      container_price_id: 3,
      subDealers: [
        {
          id: 134,
          name: 'Makho Khidasheli',
          username: 'makhok@americars.ge',
          dealer_fee: 420.00
        },
        {
          id: 135,
          name: 'Giorgi didebashvili',
          username: 'giorgid@americars.ge',
          dealer_fee: 490.00
        }
      ]
    }
  ];

  // Sample data for dropdowns
  const transportPrices = [
    { id: 1, name: 'Standard Transport' },
    { id: 2, name: 'Express Transport' },
    { id: 3, name: 'Economy Transport' }
  ];

  const containerPrices = [
    { id: 1, name: 'Standard Container' },
    { id: 2, name: 'Large Container' },
    { id: 3, name: 'Premium Container' }
  ];

  const renderHierarchyItem = (dealer: any, level = 0) => {
    const hasSubDealers = dealer.subDealers && dealer.subDealers.length > 0;
    
    return (
      <div key={dealer.id} className="select-none">
        <div 
          className={`
            flex items-center p-2 hover:bg-gray-50 cursor-pointer
            ${level > 0 ? 'ml-6' : ''}
          `}
          onClick={() => {
            setSelectedDealer(dealer);
            setIsModalOpen(true);
          }}
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
            ${dealer.dealer_fee.toFixed(2)}
          </div>
        </div>
        {hasSubDealers && (
          <div className="border-l-2 border-gray-100 ml-3">
            {dealer.subDealers.map((subDealer: any) => 
              renderHierarchyItem(subDealer, level + 1)
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dealers</h1>
          <p className="text-gray-600">Manage your dealers and sub-dealers</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            onClick={() => setActiveView('table')}
            variant={activeView === 'table' ? 'default' : 'outline'}
            size="sm"
          >
            Table View
          </Button>
          <Button
            onClick={() => setActiveView('hierarchy')}
            variant={activeView === 'hierarchy' ? 'default' : 'outline'}
            size="sm"
          >
            Hierarchy View
          </Button>
        </div>
      </div>

      {/* Controls */}
      <Card>
        <div className="p-4 border-b flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button 
              onClick={() => {
                setSelectedDealer(null);
                setIsModalOpen(true);
              }}
              className="flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Dealer</span>
            </Button>
            <Select defaultValue="20">
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Show entries" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="20">20 entries</SelectItem>
                <SelectItem value="50">50 entries</SelectItem>
                <SelectItem value="100">100 entries</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search dealers..."
                className="pl-9 w-64"
              />
            </div>
            <Button variant="outline" size="icon">
              <Download className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="icon">
              <RotateCw className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {activeView === 'table' ? (
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
                {dealers
                  .filter(dealer => 
                    dealer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    dealer.username.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map(dealer => (
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
                      <td className="px-4 py-3 text-gray-600">${dealer.dealer_fee.toFixed(2)}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end space-x-2">
                          <Button 
                            onClick={() => {
                              setSelectedDealer(dealer);
                              setIsModalOpen(true);
                            }}
                            variant="ghost"
                            size="icon"
                          >
                            <Edit2 className="w-4 h-4 text-gray-400" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Trash2 className="w-4 h-4 text-gray-400" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          ) : (
            <div className="bg-white rounded-lg">
              {dealers
                .filter(dealer => 
                  dealer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  dealer.username.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map(dealer => renderHierarchyItem(dealer))}
            </div>
          )}
        </div>
      </Card>

      {/* Add/Edit Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              {selectedDealer ? 'Edit Dealer' : 'Add New Dealer'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="grid grid-cols-2 gap-6 mt-4">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Dealer Name
                </label>
                <Input
                  type="text"
                  defaultValue={selectedDealer?.name}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Username (Email)
                </label>
                <Input
                  type="text"
                  defaultValue={selectedDealer?.username}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <Input
                  type="password"
                  defaultValue={selectedDealer?.password}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mobile
                </label>
                <Input
                  type="text"
                  defaultValue={selectedDealer?.mobile}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Buyer ID
                </label>
                <Input
                  type="text"
                  defaultValue={selectedDealer?.buyer_id}
                />
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Buyer ID 2
                </label>
                <Input
                  type="text"
                  defaultValue={selectedDealer?.buyer_id_2}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Dealer Fee
                </label>
                <Input
                  type="number"
                  step="0.01"
                  defaultValue={selectedDealer?.dealer_fee}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Dealer Fee 2
                </label>
                <Input
                  type="number"
                  step="0.01"
                  defaultValue={selectedDealer?.dealer_fee_2}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Transportation Price
                </label>
                <Select defaultValue={selectedDealer?.transport_price_id?.toString()}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select transportation price" />
                  </SelectTrigger>
                  <SelectContent>
                    {transportPrices.map(price => (
                      <SelectItem key={price.id} value={price.id.toString()}>
                        {price.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Container Price
                </label>
                <Select defaultValue={selectedDealer?.container_price_id?.toString()}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select container price" />
                  </SelectTrigger>
                  <SelectContent>
                    {containerPrices.map(price => (
                      <SelectItem key={price.id} value={price.id.toString()}>
                        {price.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button
              variant="outline"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={() => setIsModalOpen(false)}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DealersPage;
