import { tradesSchema } from '@trader/schemas';
import { Trade } from '@trader/types';
import { createContext, useContext, useEffect, useState } from 'react';

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
  // placeTrades: () => void;
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
  // placeTrades: () => {},
};

const TradesContext = createContext<ITradesContext>(initialState);

export const useTrades = () => useContext(TradesContext);

export const TradesProvider = ({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element => {
  const [trades, setTrades] = useState<Trade[]>(initialState.trades);

  const getTrade = (symbol: string): Trade | null => {
    return trades.find((trade) => trade.symbol === symbol) || null;
  };

  const addTrade = (newTrade: Trade) => {
    setTrades((prevTrades) => {
      const updatedTrades = [...prevTrades, newTrade];
      updateLocalStorage(updatedTrades);
      return updatedTrades;
    });
  };

  const addTrades = (newTrades: Trade[]) => {
    setTrades((prevTrades) => {
      const updatedTrades = [...prevTrades, ...newTrades];
      updateLocalStorage(updatedTrades);
      return updatedTrades;
    });
  };

  const updateTrade = (symbol: string, newTrade: Trade) => {
    setTrades((prevTrades) => {
      const index = prevTrades.findIndex((trade) => trade.symbol === symbol);
      if (index === -1) return prevTrades;
      const updatedTrades = [...prevTrades];
      updatedTrades[index] = newTrade;
      updateLocalStorage(updatedTrades);
      return updatedTrades;
    });
  };

  const removeTrade = (symbol: string) => {
    setTrades((prevTrades) => {
      const index = prevTrades.findIndex((trade) => trade.symbol === symbol);
      if (index === -1) return prevTrades;
      const updatedTrades = [...prevTrades];
      updatedTrades.splice(index, 1);
      updateLocalStorage(updatedTrades);
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

  const placeTrades = () => {
    console.log('Placing trades', trades);
  };

  const updateLocalStorage = (allTrades: Trade[]) => {
    console.log('Updating local storage');
    console.log(allTrades);

    window.localStorage.setItem('trades', JSON.stringify(allTrades));
  };

  useEffect(() => {
    // Upon first render, collect trades from the localStorage
    console.log('First render, fetching local storage');
    const localTrades = window.localStorage.getItem('trades') || '';
    let parsedTrades: Trade[] = [];

    try {
      parsedTrades = tradesSchema.parse(JSON.parse(localTrades));
    } catch (err) {
      console.log('Error parsing localStorage trades!');
      console.log(err);
    } finally {
      setTrades(parsedTrades);
    }

    console.log(parsedTrades);
  }, []);

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
        // placeTrades,
      }}
    >
      {children}
    </TradesContext.Provider>
  );
};
