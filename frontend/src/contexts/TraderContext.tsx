import { createContext, useContext, useState } from 'react';

interface ITraderContext {
  strategy: string;
  setStrategy: (strategy: string) => void;
  ticker: string;
  setTicker: (ticker: string) => void;
}

const initialState: ITraderContext = {
  strategy: '',
  setStrategy: () => {},
  ticker: '',
  setTicker: () => {},
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

  console.log(`CONTEXT: Strategy is ${strategy} and ticker is ${ticker}`);

  return (
    <TraderContext.Provider
      value={{
        strategy,
        setStrategy,
        ticker,
        setTicker,
      }}
    >
      {children}
    </TraderContext.Provider>
  );
};

export default TraderProvider;
