
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dealer } from '@/services/dealer/types';

interface BasicInfoFieldsProps {
  name: string;
  email: string | null;
  password: string | null;
  mobile: string | null;
  isEditing: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isSubDealer?: boolean;
}

// Alternative props for DealerForm usage
interface DealerFormBasicInfoProps {
  formData: Dealer;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isSubDealer: boolean;
}

const BasicInfoFields: React.FC<BasicInfoFieldsProps | DealerFormBasicInfoProps> = (props) => {
  // Check which props interface is being used
  const isUsingFormData = 'formData' in props;
  
  // Extract values based on props type
  const name = isUsingFormData ? props.formData.name : props.name;
  const email = isUsingFormData ? props.formData.email : props.email;
  const password = isUsingFormData ? props.formData.password : props.password;
  const mobile = isUsingFormData ? props.formData.mobile : props.mobile;
  const isSubDealer = isUsingFormData ? props.isSubDealer : props.isSubDealer || false;
  const onChange = isUsingFormData ? props.onInputChange : props.onChange;
  const isEditing = isUsingFormData ? true : props.isEditing;
  
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
