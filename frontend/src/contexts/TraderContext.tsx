import { Trade } from '@trader/types';
import { createContext, useContext, useState } from 'react';

interface ITraderContext {
  strategy: string;
  setStrategy: (strategy: string) => void;
  ticker: string;
  setTicker: (ticker: string) => void;
  currentTrade: Trade;
  setCurrentTrade: React.Dispatch<React.SetStateAction<Trade>>;
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
    take_profit: {
      limit_price: 0,
    },
    stop_loss: {
      stop_price: 0,
    },
    order_class: 'bracket',
    side: 'buy',
    qty: 0,
    type: 'market',
    time_in_force: 'gtc',
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
  const [currentTrade, setCurrentTrade] = useState<Trade>(
    initialState.currentTrade
  );

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
