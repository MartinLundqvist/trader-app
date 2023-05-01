import { useQuery } from '@tanstack/react-query';
import { useTrader } from '../contexts/TraderContext';

export interface Signal {
  id: string;
  name: string;
  date: Date;
  symbol: string;
  signal: string;
  limit: number;
  stop_loss: number;
  take_profit: number;
}

// TODO: Refactor to the same pattern as useStrategies and useTickerSignals
const getSignals = async (strategy: string): Promise<Signal[]> => {
  const url = import.meta.env.VITE_API_URL;
  const response = await fetch(`${url}/signals/${strategy}`);
  const data = await response.json();

  return data as Signal[];
};

export const useSignals = () => {
  // const queryClient = useQueryClient();
  const { strategy } = useTrader();

  const { error, data, isLoading } = useQuery({
    queryKey: ['signals', strategy],
    queryFn: () => getSignals(strategy),
  });

  return { signals: data, isLoading, error };
};
