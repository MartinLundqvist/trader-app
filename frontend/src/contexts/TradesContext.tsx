import { Trade } from '@trader/types';
import { createContext, useContext, useEffect, useState } from 'react';

interface ITradesContext {
  trades: Trade[];
  addTrade: (trade: Trade) => void;
  addTrades: (trades: Trade[]) => void;
  updateTrade: (symbol: string, newTrade: Trade) => void;
  removeTrade: (symbol: string) => void;
  tradeExists: (symbol: string) => boolean;
}

const initialState: ITradesContext = {
  trades: [],
  addTrade: () => {},
  addTrades: () => {},
  updateTrade: () => {},
  removeTrade: () => {},
  tradeExists: () => false,
};

const TradesContext = createContext<ITradesContext>(initialState);

export const useTrades = () => useContext(TradesContext);

export const TradesProvider = ({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element => {
  const [trades, setTrades] = useState<Trade[]>(initialState.trades);

  const addTrade = (trade: Trade) => {
    setTrades((prevTrades) => [...prevTrades, trade]);
  };

  const addTrades = (trades: Trade[]) => {
    setTrades((prevTrades) => [...prevTrades, ...trades]);
  };

  const updateTrade = (symbol: string, newTrade: Trade) => {
    setTrades((prevTrades) => {
      const index = prevTrades.findIndex((trade) => trade.symbol === symbol);
      if (index === -1) return prevTrades;
      const updatedTrades = [...prevTrades];
      updatedTrades[index] = newTrade;
      return updatedTrades;
    });
  };

  const removeTrade = (symbol: string) => {
    setTrades((prevTrades) => {
      const index = prevTrades.findIndex((trade) => trade.symbol === symbol);
      if (index === -1) return prevTrades;
      const updatedTrades = [...prevTrades];
      updatedTrades.splice(index, 1);
      return updatedTrades;
    });
  };

  const tradeExists = (symbol: string) => {
    const index = trades.findIndex((trade) => trade.symbol === symbol);

    return index > -1;
  };

  useEffect(() => {
    console.log('Trades changed', trades);
  }, [trades]);

  return (
    <TradesContext.Provider
      value={{
        trades,
        addTrade,
        addTrades,
        updateTrade,
        removeTrade,
        tradeExists,
      }}
    >
      {children}
    </TradesContext.Provider>
  );
};
