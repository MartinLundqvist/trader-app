# import matplotlib.pyplot as plt
import pandas as pd
import matplotlib
matplotlib.use('Agg')
import mplfinance as mpf
# import numpy as np

def generate_candlestick_chart(df_to_chart: pd.DataFrame):

    try:
        df = df_to_chart.copy()
        symbol = df['symbol'][0]


        # df = pd.read_csv('output.csv', index_col='date', parse_dates=True, infer_datetime_format=True)

        # Add a plot of bollinger bands
        aps = [mpf.make_addplot(df['bb_upper'], color='g'), mpf.make_addplot(df['bb_lower'], color='r')]

        # Add a plot of the moving average
        aps = aps + [mpf.make_addplot(df['mavg'], color='b')]

        # Add a scatter plot of buy and sell signals
        buy_signals = df[df['signal'] == 'buy'].index
        sell_signals = df[df['signal'] == 'sell'].index
        marker_buy = "$BUY$"
        marker_sell = "$SELL$"

        if buy_signals.size > 0:
            df_buy = df.loc[buy_signals].reindex(df.index)
            aps = aps + [mpf.make_addplot(df_buy['close'], type='scatter', markersize=200, marker=marker_buy, color='g')]
        
        if sell_signals.size > 0:
            df_sell = df.loc[sell_signals].reindex(df.index)
            aps = aps + [mpf.make_addplot(df_sell['close'], type='scatter', markersize=200, marker=marker_sell, color='r')]
            


        # ap_signals = [mpf.make_addplot(df_sell['close'], type='scatter', markersize=200, marker=marker_sell, color='r'), mpf.make_addplot(df_buy['close'], type='scatter', markersize=200, marker=marker_buy, color='g')]

        # Plot candles
        mpf.plot(df, type='candle', addplot=aps, title=f"\nCandlesticks with Bollinger Bands - {symbol}", style='yahoo', savefig=f"chart_{symbol}.png")
        # mpf.plot(df, type='candle', addplot=ap_bbs+ap_signals+ap_ma, figscale=1, figratio=(16,9), title=f"\nCandlesticks with Bollinger Bands - {symbol}", style='yahoo', savefig=f"chart_{symbol}.png")
        # mpf.plot(df, type='candle', addplot=ap_bbs+ap_signals+ap_ma, figscale=1, figratio=(16,9), title=f"\nCandlesticks with Bollinger Bands - {symbol}", style='yahoo')

    except Exception as e:
        print(f'Error while processing {symbol}.')
        print(e)

