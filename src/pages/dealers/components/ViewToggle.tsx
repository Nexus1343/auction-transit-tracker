
import React from 'react';
import { Button } from "@/components/ui/button";

interface ViewToggleProps {
  activeView: 'table' | 'hierarchy';
  onViewChange: (view: 'table' | 'hierarchy') => void;
}

const ViewToggle = ({ activeView, onViewChange }: ViewToggleProps) => {
  return (
    <div className="flex items-center space-x-2">
      <Button
        onClick={() => onViewChange('table')}
        variant={activeView === 'table' ? 'default' : 'outline'}
        size="sm"
      >
        Table View
      </Button>
      <Button
        onClick={() => onViewChange('hierarchy')}
        variant={activeView === 'hierarchy' ? 'default' : 'outline'}
        size="sm"
      >
        Hierarchy View
      </Button>
    </div>
  );
};

export default ViewToggle;
