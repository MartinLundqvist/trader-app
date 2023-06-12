import { Trade } from '@trader/types';
import { useState } from 'react';

// TODO: URGENT refactor this to use the useRefresh pattern!!!!!!!

export const usePlaceTrades = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<any | null>(null);

  const placeTrades = async (trades: Trade[]) => {
    setIsLoading(true);
    setError(null);

    try {
      const url = import.meta.env.VITE_API_URL;
      const response = await fetch(`${url}/trades/place`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(trades),
      });

      if (!response.ok) throw new Error('Error calling API');

      const result = await response.json();

      setData(result);
    } catch (err) {
      setError(new Error('Error calling API or parsing response'));
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  return { placeTrades, result: data, isLoading, error };
};

// export const usePlaceTrades = () => {
//   const mutation = useMutation<PlaceTradesResponse, Error, Trade[]>(
//     postTrades,
//     {
//       networkMode: 'offlineFirst',
//     }
//   );

//   const placeTrades = (trades: Trade[]) => {
//     console.log('Placing trades');
//     mutation.mutate(trades);
//   };

//   return {
//     placeTrades,
//     isLoading: mutation.isLoading,
//     isError: mutation.isError,
//     isSuccess: mutation.isSuccess,
//     error: mutation.error,
//     data: mutation.data,
//   };
// };
