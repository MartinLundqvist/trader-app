import { useQuery } from '@tanstack/react-query';
import { Position } from '@trader/types';

const getPositions = async () => {
  const url = import.meta.env.VITE_API_URL;
  const response = await fetch(`${url}/positions`);

  if (!response.ok) {
    throw new Error('Error calling positions API');
  }

  const data = await response.json();

  return data;
};

export const usePositions = () => {
  const { data, error, isError, isLoading } = useQuery<Position[], Error>({
    queryKey: ['positions'],
    queryFn: getPositions,
    networkMode: 'offlineFirst',
  });

  return { positions: data, error, isError, isLoading };
};
