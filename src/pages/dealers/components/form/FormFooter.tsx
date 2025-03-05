
import React from 'react';
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";

interface FormFooterProps {
  isLoading: boolean;
  onCancel: () => void;
}

const FormFooter = ({ isLoading, onCancel }: FormFooterProps) => {
  return (
    <DialogFooter className="mt-6">
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
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
  );
};

export default FormFooter;
