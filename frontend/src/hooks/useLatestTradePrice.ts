import { QueryFunctionContext, useQuery } from '@tanstack/react-query';
import { useState } from 'react';

const getLatestTradePrice = async ({ queryKey }: QueryFunctionContext) => {
  const [_, symbol] = queryKey;

  if (symbol === '') return 0;

  const url = import.meta.env.VITE_API_URL;

  const response = await fetch(`${url}/marketdata/getlatesttrade/${symbol}`);

  if (!response.ok) throw new Error('Error calling API');

  const { price } = await response.json();

  if (typeof price !== 'number') throw new Error('Error parsing response');

  return price;
};

export const useLatestTradePrice = (symbol: string) => {
  const { data, isLoading, isError, error } = useQuery<number, Error>({
    queryKey: ['latestTradePrice', symbol],
    queryFn: getLatestTradePrice,
    networkMode: 'offlineFirst',
    enabled: symbol !== '',
  });

  return {
    latestTradePrice: data,
    isLoading,
    isError,
    error,
  };
};
