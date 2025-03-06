
import { useState } from 'react';

export const useViewToggle = () => {
  const [activeView, setActiveView] = useState<'table' | 'hierarchy'>('table');
  
  return {
    activeView,
    setActiveView
  };
};
