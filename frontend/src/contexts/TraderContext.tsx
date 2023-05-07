import { createContext, useContext, useState } from 'react';

interface Trade {
  id: string;
  symbol: string;
  strategy_id: string;
  take_profit: number;
  stop_loss: number;
  limit: number;
}

interface ITraderContext {
  strategy: string;
  setStrategy: (strategy: string) => void;
  ticker: string;
  setTicker: (ticker: string) => void;
  currentTrade: Trade;
  setCurrentTrade: (trade: Trade) => void;
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
    strategy_id: '',
    take_profit: 0,
    stop_loss: 0,
    limit: 0,
  },
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
  const [currentTrade, setCurrentTrade] = useState(initialState.currentTrade);

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
      }}
    >
      {children}
    </TraderContext.Provider>
  );
};

export default TraderProvider;
