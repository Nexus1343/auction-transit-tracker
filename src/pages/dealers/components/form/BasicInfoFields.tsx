
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface BasicInfoFieldsProps {
  name: string;
  email: string | null;
  password: string | null;
  mobile: string | null;
  isEditing: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isSubDealer?: boolean;
}

const BasicInfoFields: React.FC<BasicInfoFieldsProps> = ({
  name,
  email,
  password,
  mobile,
  isEditing,
  onChange,
  isSubDealer = false
}) => {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          name="name"
          value={name || ''}
          onChange={onChange}
          readOnly={!isEditing}
          className={!isEditing ? 'bg-gray-100' : ''}
        />
      </div>
      
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          value={email || ''}
          onChange={onChange}
          readOnly={!isEditing}
          className={!isEditing ? 'bg-gray-100' : ''}
        />
      </div>
      
      {isEditing && (
        <div>
          <Label htmlFor="password">
            {isSubDealer ? 'Password' : 'Password (Optional)'}
          </Label>
          <Input
            id="password"
            name="password"
            type="password"
            value={password || ''}
            onChange={onChange}
            placeholder={isSubDealer ? 'Required' : 'Leave empty to keep unchanged'}
          />
        </div>
      )}
      
      <div>
        <Label htmlFor="mobile">Mobile Number</Label>
        <Input
          id="mobile"
          name="mobile"
          value={mobile || ''}
          onChange={onChange}
          readOnly={!isEditing}
          className={!isEditing ? 'bg-gray-100' : ''}
        />
      </div>
    </div>
  );
};

export default BasicInfoFields;
