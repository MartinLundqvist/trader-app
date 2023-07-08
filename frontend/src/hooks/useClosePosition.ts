import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

export const useClosePosition = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  //   const [data, setData] = useState<any | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);

  const queryClient = useQueryClient();

  const closePosition = async (symbol: string) => {
    setIsLoading(true);
    setIsError(false);
    setIsSuccess(false);
    setError(null);

    try {
      const url = import.meta.env.VITE_API_URL;
      const response = await fetch(`${url}/positions/close/${symbol}`);

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      setIsSuccess(true);
      queryClient.refetchQueries(['positions']);
    } catch (err) {
      if (err instanceof Error) {
        setError(err);
      } else {
        setError(new Error('An unknown error occurred'));
      }
      setIsError(true);
      setIsSuccess(false);
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  return { closePosition, isLoading, isError, isSuccess, error };
};
