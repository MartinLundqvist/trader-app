import { useQuery } from '@tanstack/react-query';

const getStrategies = async () => {
  const url = import.meta.env.VITE_API_URL;
  const response = await fetch(`${url}/strategies`);

  if (!response.ok) return Promise.reject(new Error('Error calling API'));

  return response.json() as Promise<string[]>;
};

export const useStrategies = () => {
  const { error, data, isLoading } = useQuery({
    queryKey: ['strategies'],
    queryFn: getStrategies,
  });

  return { strategies: data, isLoading, error };
};
