import { useState } from 'react';

export const useRefreshSignals = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const triggerRefresh = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const url = import.meta.env.VITE_API_URL;
      const response = await fetch(`${url}/strategies/refresh/conservative`);

      if (!response.ok) throw new Error('Error calling API');

      const data = await response.json();

      return data;
    } catch (err) {
      setError(new Error('Error calling API'));
      console.log('Problemas');
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  return { triggerRefresh, isLoading, error };
};
