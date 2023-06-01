import { useQuery } from '@tanstack/react-query';
import { JobStatus } from '@trader/types';

const getJobs = async () => {
  const url = import.meta.env.VITE_API_URL;
  const response = await fetch(`${url}/jobs`);

  if (!response.ok) {
    throw new Error('Error calling jobs API');
  }

  return await response.json();
};

export const useJobs = () => {
  const { data, error, isError, isLoading } = useQuery<JobStatus, Error>({
    queryKey: ['jobs'],
    queryFn: getJobs,
    refetchInterval: 1000,
  });

  return { jobs: data, error, isError, isLoading };
};
