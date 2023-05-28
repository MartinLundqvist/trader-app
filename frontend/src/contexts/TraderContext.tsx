import { Trade } from '@trader/types';
import { createContext, useContext, useEffect, useState } from 'react';

interface ITraderContext {
  strategy: string;
  setStrategy: (strategy: string) => void;
  ticker: string;
  setTicker: (ticker: string) => void;
  currentTrade: Trade;
  setCurrentTrade: React.Dispatch<React.SetStateAction<Trade>>;
  setCurrentTradeSL: (stop_price: number) => void;
  setCurrentTradeTP: (limit_price: number) => void;
  setCurrentTradeQty: (qty: number) => void;
  setCurrentTradeSide: (side: string) => void;
  setCurrentTradeSymbol: (symbol: string) => void;
  // setCurrentTrade: (trade: Trade) => void;
  // trades: Trade[];
  // addTrade: (trade: Trade) => void;
  // updateTrade: (trade_id: string, newTrade: Trade) => void;
}

const initialState: ITraderContext = {
  strategy: '',
  setStrategy: () => {},
  ticker: '',
  setTicker: () => {},
  currentTrade: {
    id: '',
    symbol: '',
    take_profit: 0,
    stop_loss: 0,
    side: 'buy',
    qty: 0,
    limit: 0,
  },
  setCurrentTradeSL: () => {},
  setCurrentTradeTP: () => {},
  setCurrentTradeQty: () => {},
  setCurrentTradeSide: () => {},
  setCurrentTradeSymbol: () => {},
  setCurrentTrade: () => {},
};

const TraderContext = createContext<ITraderContext>(initialState);

export const useTrader = () => useContext(TraderContext);

export const TraderProvider = ({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element => {
  const [ticker, setTicker] = useState(initialState.ticker);
  const [strategy, setStrategy] = useState(initialState.strategy);
  const [currentTrade, setCurrentTrade] = useState<Trade>(
    initialState.currentTrade
  );

  const setCurrentTradeSL = (stop_price: number) => {
    let value = Number(Number(stop_price).toFixed(2));

    setCurrentTrade((prev) => ({
      ...prev,
      stop_loss: value,
    }));
  };

  const setCurrentTradeTP = (limit_price: number) => {
    let value = Number(Number(limit_price).toFixed(2));

    setCurrentTrade((prev) => ({
      ...prev,
      take_profit: value,
    }));
  };

  const setCurrentTradeQty = (qty: number) => {
    let value = Number(Number(qty).toFixed(0));
    setCurrentTrade((prev) => ({
      ...prev,
      qty: value,
    }));
  };

  const setCurrentTradeSide = (side: string) => {
    if (side !== 'buy' && side !== 'sell') return;

    setCurrentTrade((prev) => ({
      ...prev,
      side,
    }));
  };

  const setCurrentTradeSymbol = (symbol: string) => {
    setCurrentTrade((prev) => ({
      ...prev,
      symbol,
    }));
  };

  // console.log(`CONTEXT: Strategy is ${strategy} and ticker is ${ticker}`);

  return (
    <TraderContext.Provider
      value={{
        strategy,
        setStrategy,
        ticker,
        setTicker,
        currentTrade,
        setCurrentTrade,
        setCurrentTradeSL,
        setCurrentTradeTP,
        setCurrentTradeQty,
        setCurrentTradeSide,
        setCurrentTradeSymbol,
      }}
    >
      {children}
    </TraderContext.Provider>
  );
};

export default TraderProvider;
