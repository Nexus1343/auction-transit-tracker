
import React from 'react';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface SubDealerToggleProps {
  isSubDealer: boolean;
  onSwitchChange: (name: string, checked: boolean) => void;
}

const SubDealerToggle = ({ isSubDealer, onSwitchChange }: SubDealerToggleProps) => {
  return (
    <div className="flex items-center space-x-2 mb-4">
      <Switch 
        id="is-sub-dealer"
        checked={isSubDealer}
        onCheckedChange={(checked) => onSwitchChange('isSubDealer', checked)}
      />
      <Label htmlFor="is-sub-dealer">This is a sub-dealer</Label>
    </div>
  );
};

export default SubDealerToggle;
