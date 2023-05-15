import { useState } from 'react';

export const useRefreshMarketData = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<any | null>(null);

  const triggerRefresh = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const url = import.meta.env.VITE_API_URL;
      const response = await fetch(`${url}/marketdata/refresh`);

      if (!response.ok) throw new Error('Error calling API');

      const result = await response.json();

      setData(result);
    } catch (err) {
      setError(new Error('Error calling API'));
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  return { triggerRefresh, result: data, isLoading, error };
};
