import { useQuery } from '@tanstack/react-query';
import { placedTradesSchema } from '@trader/schemas';
import { PlacedTrade, PlacedTrades } from '@trader/types';
import { createPlacedTradeJobs } from '../utils';

export type PlacedTradeJob = Pick<PlacedTrade, 'job_id' | 'placed_at'> & {
  nrTrades: number;
  nrSuccessful: number;
  nrFailed: number;
  trades: PlacedTrades;
};

const getPlacedTrades = async (): Promise<PlacedTradeJob[]> => {
  const url = import.meta.env.VITE_API_URL;
  const response = await fetch(`${url}/placedtrades`);

  if (!response.ok) throw new Error('Error calling API');

  const data = await response.json();

  const parsed = placedTradesSchema.safeParse(data);

  if (!parsed.success) throw new Error('Error parsing response');

  const reshapedTrades = createPlacedTradeJobs(parsed.data);

  return reshapedTrades;
};

export const usePlacedTradeJobs = () => {
  const { error, data, isLoading } = useQuery<PlacedTradeJob[], Error>({
    queryKey: ['placedtrades'],
    queryFn: getPlacedTrades,
    networkMode: 'offlineFirst',
  });

  return { placedTradeJobs: data, isLoading, error };
};
