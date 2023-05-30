import { Trade } from '@trader/types';
import { createContext, useContext, useState } from 'react';
import { useLocalStorageState } from '../hooks/useLocalStorageState';

interface ITradesContext {
  trades: Trade[];
  getTrade: (symbol: string) => Trade | null;
  addTrade: (trade: Trade) => void;
  addTrades: (trades: Trade[]) => void;
  updateTrade: (symbol: string, newTrade: Trade) => void;
  removeTrade: (symbol: string) => void;
  removeTrades: (symbols: string[]) => void;
  removeAllTrades: () => void;
  tradeExists: (symbol: string) => boolean;
  currentTrade: Trade;
  setCurrentTrade: React.Dispatch<React.SetStateAction<Trade>>;
}

const initialState: ITradesContext = {
  trades: [],
  getTrade: () => null,
  addTrade: () => {},
  addTrades: () => {},
  updateTrade: () => {},
  removeTrade: () => {},
  removeTrades: () => {},
  removeAllTrades: () => {},
  tradeExists: () => false,
  currentTrade: {
    id: '',
    symbol: '',
    strategy: '',
    take_profit: 0,
    stop_loss: 0,
    side: 'buy',
    qty: 0,
    limit: 0,
  },
  setCurrentTrade: () => {},
};

const TradesContext = createContext<ITradesContext>(initialState);

export const useTrades = () => useContext(TradesContext);

export const TradesProvider = ({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element => {
  const [trades, setTrades] = useLocalStorageState<Trade[]>(
    'trades',
    initialState.trades
  );

  const [currentTrade, setCurrentTrade] = useState<Trade>(
    initialState.currentTrade
  );

  const getTrade = (symbol: string): Trade | null => {
    return trades.find((trade) => trade.symbol === symbol) || null;
  };

  const addTrade = (newTrade: Trade) => {
    setTrades((prevTrades) => {
      const updatedTrades = [...prevTrades, newTrade];
      return updatedTrades;
    });
  };

  const addTrades = (newTrades: Trade[]) => {
    setTrades((prevTrades) => {
      const updatedTrades = [...prevTrades, ...newTrades];
      return updatedTrades;
    });
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

  const removeTrades = (symbols: string[]) => {
    symbols.forEach((symbol) => removeTrade(symbol));
  };

  const removeAllTrades = () => {
    setTrades([]);
  };

  const tradeExists = (symbol: string) => {
    const index = trades.findIndex((trade) => trade.symbol === symbol);

    return index > -1;
  };

  return (
    <TradesContext.Provider
      value={{
        trades,
        getTrade,
        addTrade,
        addTrades,
        updateTrade,
        removeTrade,
        removeTrades,
        removeAllTrades,
        tradeExists,
        currentTrade,
        setCurrentTrade,
      }}
    >
      {children}
    </TradesContext.Provider>
  );
};
