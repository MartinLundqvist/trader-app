import pandas as pd
import ta

def bollinger_backtest(data):
    try:
        df = pd.json_normalize(data)
        df['date'] = pd.to_datetime(df['date'])
        df.set_index('date', inplace=True)
        df.sort_values(by='date', inplace=True)
        symbol = df['symbol'][0]

        df['close'] = df['adj_close']
        df['open'] = df['adj_open']
        df['high'] = df['adj_high']
        df['low'] = df['adj_low']

        # Calculate the 20-day moving average and Bollinger Bands
        indicator_bb = ta.volatility.BollingerBands(close=df["close"], window=50, window_dev=3) # Swing settings
        # indicator_bb = ta.volatility.BollingerBands(close=df["close"], window=20, window_dev=2) # Day settings
        # indicator_bb = ta.volatility.BollingerBands(close=df["close"], window=10, window_dev=1.5) # Scalp settings
        df['mavg'] = indicator_bb.bollinger_mavg()
        df['bb_upper'] = indicator_bb.bollinger_hband()
        df['bb_lower'] = indicator_bb.bollinger_lband()

        # Determine buy and sell signals based on Bollinger Bands
        df['signal'] = None
        df['limit'] = None

        signal_col_idx = df.columns.get_loc('signal')
        limit_col_idx = df.columns.get_loc('limit')


        for i in range(1, len(df)):
            if df['close'][i] > df['bb_upper'][i-1]:
                df.iloc[i, signal_col_idx] = 'sell' #sell
                df.iloc[i, limit_col_idx] = df['close'][i] * 0.98 # 2% below the current price
                
            elif df['close'][i] < df['bb_lower'][i-1]:
                df.iloc[i, signal_col_idx] = 'buy' # Buy
                df.iloc[i, limit_col_idx] = df['close'][i] * 1.02 # 2% above the current price

        return df            

    except Exception as e:
        print(f'Error while processing {symbol}.')
        print(e)

def bollinger_signal(data):
    try:
        df = pd.json_normalize(data)
        df['date'] = pd.to_datetime(df['date'])
        df.set_index('date', inplace=True)
        df.sort_values(by='date', inplace=True)
        symbol = df['symbol'][0]

        # Calculate the 20-day moving average and Bollinger Bands
        indicator_bb = ta.volatility.BollingerBands(close=df["close"], window=50, window_dev=3) # Swing settings
        # indicator_bb = ta.volatility.BollingerBands(close=df["close"], window=20, window_dev=2) # Day settings
        # indicator_bb = ta.volatility.BollingerBands(close=df["close"], window=10, window_dev=1.5) # Scalp settings
        df['mavg'] = indicator_bb.bollinger_mavg()
        df['bb_upper'] = indicator_bb.bollinger_hband()
        df['bb_lower'] = indicator_bb.bollinger_lband()

        # Determine buy and sell signals based on Bollinger Bands
        df['signal'] = None
        df['limit'] = None

        signal_col_idx = df.columns.get_loc('signal')
        limit_col_idx = df.columns.get_loc('limit')

        sendSignal = ""
        sendLimit = 0

        for i in range(len(df) - 2, len(df)):
            if df['close'][i] > df['bb_upper'][i-1]:
                df.iloc[i, signal_col_idx] = 'sell' #sell
                df.iloc[i, limit_col_idx] = df['close'][i] * 0.98 # 2% below the current price
                sendSignal = "sell"
                sendLimit = df['limit'][i]
                
            elif df['close'][i] < df['bb_lower'][i-1]:
                df.iloc[i, signal_col_idx] = 'buy' # Buy
                df.iloc[i, limit_col_idx] = df['close'][i] * 1.02 # 2% above the current price
                sendSignal = "buy"
                sendLimit = df['limit'][i]
                
        # df.to_csv(f'output.csv')

        # if sendSignal != "":
        #     print('Sending signal...')
        #     i = len(df) - 1
        #     result.append({
        #         'date': df.index[i].strftime('%Y-%m-%d %H:%M:%S'),
        #         'symbol': df['symbol'][i],
        #         'signal': sendSignal,
        #         'limit': sendLimit,
        #         'close': df['close'][i],
        #         'strength': 1 / ((df['bb_upper'][i]-df['bb_lower'][i])/df['mavg'][i])
        #     })

        return df, sendSignal, sendLimit

    except Exception as e:
        print(f'Error while processing {symbol}.')
        print(e)