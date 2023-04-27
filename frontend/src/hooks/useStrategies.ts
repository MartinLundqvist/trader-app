import { useEffect, useState } from 'react';
import json from '../development_assets/strategies.json';

export const useStrategies = () => {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    setData(json);
  }, []);

  const strategies = data.map((s) => ({
    symbol: s[0].symbol,
    graph: s[0].graph,
  }));

  return { strategies };
};
