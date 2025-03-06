
import { useState } from 'react';

export const useSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  return {
    searchTerm,
    handleSearchChange
  };
};
