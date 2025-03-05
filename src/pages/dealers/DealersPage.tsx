
import React, { useState, useEffect, FormEvent } from 'react';
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
import { toast } from "sonner";

import { 
  Dealer, 
  SubDealer,
  fetchDealers, 
  addDealer, 
  updateDealer, 
  deleteDealer,
  fetchTransportPrices,
  fetchContainerPrices
} from "../../services/dealerService";

const DealersPage = () => {
  const [activeView, setActiveView] = useState('table'); // 'table' or 'hierarchy'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDealer, setSelectedDealer] = useState<Dealer | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [dealers, setDealers] = useState<Dealer[]>([]);
  const [transportPrices, setTransportPrices] = useState<any[]>([]);
  const [containerPrices, setContainerPrices] = useState<any[]>([]);
  
  // Form state
  const [formData, setFormData] = useState<Dealer>({
    name: '',
    username: '',
    password: '',
    mobile: '',
    buyer_id: '',
    buyer_id_2: '',
    dealer_fee: 0,
    dealer_fee_2: 0,
    transport_price_id: null,
    container_price_id: null
  });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    // Reset form when selected dealer changes
    if (selectedDealer) {
      setFormData({
        id: selectedDealer.id,
        name: selectedDealer.name,
        username: selectedDealer.username || '',
        password: selectedDealer.password || '',
        mobile: selectedDealer.mobile || '',
        buyer_id: selectedDealer.buyer_id || '',
        buyer_id_2: selectedDealer.buyer_id_2 || '',
        dealer_fee: selectedDealer.dealer_fee || 0,
        dealer_fee_2: selectedDealer.dealer_fee_2 || 0,
        transport_price_id: selectedDealer.transport_price_id,
        container_price_id: selectedDealer.container_price_id
      });
    } else {
      // Reset form for new dealer
      setFormData({
        name: '',
        username: '',
        password: '',
        mobile: '',
        buyer_id: '',
        buyer_id_2: '',
        dealer_fee: 0,
        dealer_fee_2: 0,
        transport_price_id: null,
        container_price_id: null
      });
    }
  }, [selectedDealer]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [dealersData, transportData, containerData] = await Promise.all([
        fetchDealers(),
        fetchTransportPrices(),
        fetchContainerPrices()
      ]);
      
      setDealers(dealersData);
      setTransportPrices(transportData);
      setContainerPrices(containerData);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? (value === '' ? null : parseFloat(value)) : value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value === '' ? null : parseInt(value)
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (selectedDealer) {
        // Update existing dealer
        await updateDealer(formData);
      } else {
        // Add new dealer
        await addDealer(formData);
      }
      
      // Reload data after update
      await loadData();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving dealer:', error);
      toast.error('Failed to save dealer');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteDealer = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this dealer?')) {
      setIsLoading(true);
      try {
        await deleteDealer(id);
        await loadData();
      } catch (error) {
        console.error('Error deleting dealer:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const renderHierarchyItem = (dealer: Dealer, level = 0) => {
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
            ${dealer.dealer_fee ? dealer.dealer_fee.toFixed(2) : '0.00'}
          </div>
        </div>
        {hasSubDealers && (
          <div className="border-l-2 border-gray-100 ml-3">
            {dealer.subDealers.map((subDealer: SubDealer) => 
              renderHierarchyItem({
                ...subDealer,
                subDealers: []
              }, level + 1)
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
              disabled={isLoading}
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
            <Button 
              variant="outline" 
              size="icon" 
              onClick={loadData} 
              disabled={isLoading}
            >
              <RotateCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {isLoading ? (
            <div className="flex justify-center items-center py-10">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
            </div>
          ) : activeView === 'table' ? (
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
                    (dealer.username && dealer.username.toLowerCase().includes(searchTerm.toLowerCase()))
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
                      <td className="px-4 py-3 text-gray-600">
                        ${dealer.dealer_fee ? dealer.dealer_fee.toFixed(2) : '0.00'}
                      </td>
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
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => dealer.id && handleDeleteDealer(dealer.id)}
                          >
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
                  (dealer.username && dealer.username.toLowerCase().includes(searchTerm.toLowerCase()))
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
          
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-6 mt-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Dealer Name
                  </label>
                  <Input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Username (Email)
                  </label>
                  <Input
                    type="text"
                    name="username"
                    value={formData.username || ''}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <Input
                    type="password"
                    name="password"
                    value={formData.password || ''}
                    onChange={handleInputChange}
                    placeholder={selectedDealer ? "••••••••" : ""}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mobile
                  </label>
                  <Input
                    type="text"
                    name="mobile"
                    value={formData.mobile || ''}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Buyer ID
                  </label>
                  <Input
                    type="text"
                    name="buyer_id"
                    value={formData.buyer_id || ''}
                    onChange={handleInputChange}
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
                    name="buyer_id_2"
                    value={formData.buyer_id_2 || ''}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Dealer Fee
                  </label>
                  <Input
                    type="number"
                    step="0.01"
                    name="dealer_fee"
                    value={formData.dealer_fee || ''}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Dealer Fee 2
                  </label>
                  <Input
                    type="number"
                    step="0.01"
                    name="dealer_fee_2"
                    value={formData.dealer_fee_2 || ''}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Transportation Price
                  </label>
                  <Select 
                    value={formData.transport_price_id?.toString() || ""}
                    onValueChange={(value) => handleSelectChange('transport_price_id', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select transportation price" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">None</SelectItem>
                      {transportPrices.map(price => (
                        <SelectItem key={price.id} value={price.id.toString()}>
                          {price.port || price.city} - ${price.price}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Container Price
                  </label>
                  <Select 
                    value={formData.container_price_id?.toString() || ""}
                    onValueChange={(value) => handleSelectChange('container_price_id', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select container price" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">None</SelectItem>
                      {containerPrices.map(price => (
                        <SelectItem key={price.id} value={price.id.toString()}>
                          {price.port || price.vehicle_type} - ${price.price}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <DialogFooter className="mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsModalOpen(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? 'Saving...' : 'Save'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DealersPage;
