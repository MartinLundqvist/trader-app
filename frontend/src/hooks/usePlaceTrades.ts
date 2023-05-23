import { useMutation } from '@tanstack/react-query';
import { placeTradesResponseSchema } from '@trader/schemas';
import { PlaceTradesResponse, Trade } from '@trader/types';

const postTrades = async (trades: Trade[]) => {
  const url = import.meta.env.VITE_API_URL;
  const response = await fetch(`${url}/trades/place`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(trades),
  });

  if (!response.ok) throw new Error('Error calling API');

  const data = await response.json();

  const parsedResponse = placeTradesResponseSchema.safeParse(data);

  if (!parsedResponse.success) throw new Error('Error parsing response');

  return parsedResponse.data;
};

export const usePlaceTrades = () => {
  const mutation = useMutation<PlaceTradesResponse, Error, Trade[]>(
    postTrades,
    {
      networkMode: 'offlineFirst',
    }
  );

  const placeTrades = (trades: Trade[]) => {
    console.log('Placing trades');
    mutation.mutate(trades);
  };

  return {
    placeTrades,
    isLoading: mutation.isLoading,
    isError: mutation.isError,
    isSuccess: mutation.isSuccess,
    error: mutation.error,
    data: mutation.data,
  };
};
