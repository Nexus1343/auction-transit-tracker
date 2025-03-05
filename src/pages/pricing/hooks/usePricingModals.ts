
import { useState } from 'react';
import { TransportPrice, ContainerPrice } from '../types';

export const usePricingModals = () => {
  // State for modals
  const [transportModalOpen, setTransportModalOpen] = useState(false);
  const [containerModalOpen, setContainerModalOpen] = useState(false);
  const [selectedTransportPrice, setSelectedTransportPrice] = useState<TransportPrice | null>(null);
  const [selectedContainerPrice, setSelectedContainerPrice] = useState<ContainerPrice | null>(null);

  const openTransportModal = (price?: TransportPrice) => {
    setSelectedTransportPrice(price || null);
    setTransportModalOpen(true);
  };

  const closeTransportModal = () => {
    setTransportModalOpen(false);
    setSelectedTransportPrice(null);
  };

  const openContainerModal = (price?: ContainerPrice) => {
    setSelectedContainerPrice(price || null);
    setContainerModalOpen(true);
  };

  const closeContainerModal = () => {
    setContainerModalOpen(false);
    setSelectedContainerPrice(null);
  };

  return {
    transportModalOpen,
    containerModalOpen,
    selectedTransportPrice,
    selectedContainerPrice,
    openTransportModal,
    closeTransportModal,
    openContainerModal,
    closeContainerModal
  };
};
