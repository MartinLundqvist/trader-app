import { QueryFunctionContext, useQuery } from '@tanstack/react-query';
import { newsSchema } from '@trader/schemas';
import { News } from '@trader/types';
import { useParams } from 'react-router-dom';

const getNews = async ({ queryKey }: QueryFunctionContext): Promise<News> => {
  const [_, ticker] = queryKey;

  if (!ticker) return [];

  const url = import.meta.env.VITE_API_URL;
  const response = await fetch(`${url}/marketdata/getlatestnews/${ticker}`);

  if (!response.ok) {
    throw new Error('Error calling getlatestnews API');
  }

  const data = await response.json();

  const parsedData = newsSchema.safeParse(data.news);

  if (!parsedData.success) throw new Error(parsedData.error.message);

  return parsedData.data;
};

export const useNews = () => {
  const { ticker } = useParams();
  const { data, error, isError, isLoading } = useQuery<News, Error>({
    queryKey: ['news', ticker],
    queryFn: getNews,
    networkMode: 'offlineFirst',
  });

  return { news: data, error, isError, isLoading };
};
