import { useQuery } from '@tanstack/react-query';

const getJobs = async () => {
  const url = import.meta.env.VITE_API_URL;
  const response = await fetch(`${url}/jobs`);

  if (!response.ok) {
    throw new Error('Error calling jobs API');
  }

  return await response.json();
};

export const useJobs = () => {
  const { data, error, isError, isLoading } = useQuery<any, Error>({
    queryKey: ['jobs'],
    queryFn: getJobs,
    refetchInterval: 1000,
  });

  return { data, error, isError, isLoading };
};
