import { useQuery } from '@tanstack/react-query';
import { jobsResponseSchema } from '@trader/schemas';
import { JobsResponse } from '@trader/types';

const getJobs = async () => {
  const url = import.meta.env.VITE_API_URL;
  const response = await fetch(`${url}/jobs`);

  if (!response.ok) {
    throw new Error('Error calling jobs API');
  }

  const data = await response.json();

  const parsedData = jobsResponseSchema.safeParse(data);

  if (!parsedData.success) throw new Error(parsedData.error.message);

  return parsedData.data;
};

export const useJobs = () => {
  const { data, error, isError, isLoading } = useQuery<JobsResponse, Error>({
    queryKey: ['jobs'],
    queryFn: getJobs,
    refetchInterval: 1000,
  });

  return { jobs: data, error, isError, isLoading };
};
