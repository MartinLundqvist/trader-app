import { useQuery } from '@tanstack/react-query';
import { Account } from '@trader/types';

const getAccount = async () => {
  const url = import.meta.env.VITE_API_URL;
  const response = await fetch(`${url}/account`);

  if (!response.ok) {
    throw new Error('Error calling account API');
  }

  const data = await response.json();

  // const parsedData = jobsResponseSchema.safeParse(data);

  // if (!parsedData.success) throw new Error(parsedData.error.message);

  return data;
};

export const useAccount = () => {
  const { data, error, isError, isLoading } = useQuery<Account, Error>({
    queryKey: ['account'],
    queryFn: getAccount,
    networkMode: 'offlineFirst',
  });

  return { account: data, error, isError, isLoading };
};
