
import { useQuery } from "@tanstack/react-query";
import { fetchTransportPrices, fetchContainerPrices } from "../../../services/dealer";

export const usePricingData = () => {
  const { 
    data: transportPrices = []
  } = useQuery({
    queryKey: ['transportPrices'],
    queryFn: fetchTransportPrices
  });

  const { 
    data: containerPrices = []
  } = useQuery({
    queryKey: ['containerPrices'],
    queryFn: fetchContainerPrices
  });

  return {
    transportPrices,
    containerPrices
  };
};
