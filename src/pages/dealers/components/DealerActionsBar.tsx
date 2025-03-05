
import React from 'react';
import { Plus, Download, RotateCw, Search } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface DealerActionsBarProps {
  onAddDealer: () => void;
  searchTerm: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRefresh: () => void;
  isLoading: boolean;
}

const DealerActionsBar = ({
  onAddDealer,
  searchTerm,
  onSearchChange,
  onRefresh,
  isLoading
}: DealerActionsBarProps) => {
  return (
    <div className="p-4 border-b flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <Button 
          onClick={onAddDealer}
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
            onChange={onSearchChange}
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
          onClick={onRefresh} 
          disabled={isLoading}
        >
          <RotateCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
        </Button>
      </div>
    </div>
  );
};

export default DealerActionsBar;
