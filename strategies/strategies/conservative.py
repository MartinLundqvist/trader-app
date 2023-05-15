from ta.volatility import BollingerBands
from ta.momentum import RSIIndicator
from ta.trend import EMAIndicator, SMAIndicator, ADXIndicator, MACD
import pandas as pd
import plotly.offline as pyo
import plotly.graph_objects as go
import datetime

# For this strategy template, we will use very conservative parameters. The idea is to find very rare but good signals, and then apply to thousands of stocks.

ema_window = 200
sma_window_slow = 20
sma_window_fast = 10
rsi_window = 14
bb_window = 20
bb_std = 2.5
adx_window = 14
macd_window_slow = 26
macd_window_fast = 12
macd_window_signal = 9
limit = 0.00
stop_loss = 0.01  # This is in fractions of the current closing price
take_profit = 0.1
quantity = 0.9


def add_trend_indicator(df: pd.DataFrame, rsi_buy_threshold=50, rsi_sell_threshold=50, trend_window=9):
    """
    This function adds a trend indicator to the dataframe, called "Trend"
    - It returns 1 if there is an up-trend
    - It returns -1 if there is a down-trend
    - It returns 0 if there is no trend

    An up-trend is defined by the following conditions:
    - The fast SMA is above the slow SMA
    - The MACD signal line is above the MACD line
    - The RSI is above 50

    """

    df["Trend"] = 0

    df.loc[(df['SMA_fast'] > df['SMA_slow']) & (df['MACD_signal'] >
                                                df['MACD_line']) & (df['RSI'] > rsi_buy_threshold), 'Trend'] = 1
    df.loc[(df['SMA_fast'] < df['SMA_slow']) & (df['MACD_signal'] <
                                                df['MACD_line']) & (df['RSI'] < rsi_sell_threshold), 'Trend'] = -1

    # We will then smooth the trend indicator with a rolling mean
    df['Trend'] = df['Trend'].rolling(trend_window).mean()

    return df


def add_indicators(df: pd.DataFrame,
                   ema_window=ema_window,
                   sma_window_slow=sma_window_slow,
                   sma_window_fast=sma_window_fast,
                   rsi_window=rsi_window,
                   bb_window=bb_window,
                   bb_std=bb_std,
                   adx_window=adx_window,
                   macd_window_slow=macd_window_slow,
                   macd_window_fast=macd_window_fast,
                   macd_window_signal=macd_window_signal):

    df['BB_high'] = BollingerBands(
        df['Close'], window=bb_window, window_dev=bb_std).bollinger_hband()
    df['BB_low'] = BollingerBands(
        df['Close'], window=bb_window, window_dev=bb_std).bollinger_lband()
    df['BB_width'] = BollingerBands(
        df['Close'], window=bb_window, window_dev=bb_std).bollinger_wband()
    df['RSI'] = RSIIndicator(df['Close'], window=rsi_window).rsi()
    df['EMA'] = EMAIndicator(df['Close'], window=ema_window).ema_indicator()
    df['SMA_slow'] = SMAIndicator(
        df['Close'], window=sma_window_slow).sma_indicator()
    df['SMA_fast'] = SMAIndicator(
        df['Close'], window=sma_window_fast).sma_indicator()
    df['ADX_pos'] = ADXIndicator(
        df['High'], df['Low'], df['Close'],  window=adx_window).adx_pos()
    df['ADX_neg'] = ADXIndicator(
        df['High'], df['Low'], df['Close'],  window=adx_window).adx_neg()
    df['ADX_index'] = ADXIndicator(
        df['High'], df['Low'], df['Close'],  window=adx_window).adx()
    df['MACD_line'] = MACD(df['Close'], window_slow=macd_window_slow,
                           window_fast=macd_window_fast, window_sign=macd_window_signal).macd()
    df['MACD_signal'] = MACD(df['Close'], window_slow=macd_window_slow,
                             window_fast=macd_window_fast, window_sign=macd_window_signal).macd_signal()
    df['MACD_hist'] = MACD(df['Close'], window_slow=macd_window_slow,
                           window_fast=macd_window_fast, window_sign=macd_window_signal).macd_diff()
    add_trend_indicator(df)

    return df


def create_signals(df: pd.DataFrame):
    """
    This is a super conservative strategy looking for rare but good signals.
    We will createa a Buy signal when the following conditions are met:
    - There is a general uptrend in the market: The fast moving SMA is above the slow moving SMA and the MACD Signal is above the MACD Line 
    - And, the lastest closing price is below the lower Bollinger Band.
    We apply the converse logic for Sell signals.
    """
    df['Signal'] = ''

    df.loc[(df['Close'] < df['BB_low']) & (
        df['Trend'] > 0.2), 'Signal'] = 'Buy'
    df.loc[(df['Close'] > df['BB_high']) & (
        df['Trend'] < -0.2), 'Signal'] = 'Sell'
    return df


def process_buy(row: pd.Series):
    row['Limit'] = row['Close'] * (1+limit)
    row['Stop_loss'] = row['Close'] * (1-stop_loss)
    # row['Stop_loss']=row['Close'] - (row['BB_high'] - row['BB_low']) * stop_loss
    row['Quantity'] = quantity
    row['Take_profit'] = row['Close'] * (1 + take_profit)
    return row


def process_sell(row: pd.Series):
    row['Limit'] = row['Close'] * (1-limit)
    row['Stop_loss'] = row['Close'] * (1+stop_loss)
    # row['Stop_loss']=row['Close'] + (row['BB_high'] - row['BB_low']) * stop_loss
    row['Quantity'] = quantity
    row['Take_profit'] = row['Close'] * (1 - take_profit)
    return row


def add_trades(df: pd.DataFrame):
    df['Limit'] = None
    df['Stop_loss'] = None
    df['Quantity'] = None
    df['Take_profit'] = None
    df['Expiry'] = None

    dfSignal = df[df['Signal'] != '']

    for index, row in dfSignal.iterrows():
        if row['Signal'] == 'Buy':
            df.loc[index] = process_buy(row)
        elif row['Signal'] == 'Sell':
            df.loc[index] = process_sell(row)

    return df


def get_latest_signal(df: pd.DataFrame, backcandles: int = 1):
    df_slice = df.tail(backcandles)
    df_slice = df_slice.sort_index(ascending=False)
    signal = False
    result = df_slice.iloc[0]
    signals_rows = df_slice[df_slice['Signal'] != '']

    if (len(signals_rows) > 0):
        result = signals_rows.iloc[0]
        signal = True

    return result, signal


def add_buy_sell_points(df: pd.DataFrame):
    df['sell_dp'] = None
    df['buy_dp'] = None
    df['sell_sl'] = None
    df['buy_sl'] = None
    df.loc[df['Signal'] == 'Sell', 'sell_dp'] = df['Limit']
    df.loc[df['Signal'] == 'Buy', 'buy_dp'] = df['Limit']
    df.loc[df['Signal'] == 'Sell', 'sell_sl'] = df['Stop_loss']
    df.loc[df['Signal'] == 'Buy', 'buy_sl'] = df['Stop_loss']
    return df


def create_plot(df: pd.DataFrame):

    dfpl = df.copy()
    dfpl = add_buy_sell_points(dfpl)

    data = [go.Candlestick(x=dfpl.index,
                           open=dfpl['Open'],
                           high=dfpl['High'],
                           low=dfpl['Low'],
                           close=dfpl['Close'], yaxis='y1'),
            go.Scatter(x=dfpl.index, y=dfpl['EMA'], line=dict(
                color='orange', width=2), name="EMA", yaxis='y1'),
            go.Scatter(x=dfpl.index, y=dfpl['SMA_slow'], line=dict(
                color='yellow', width=2), name="SMA Slow", yaxis='y1'),
            go.Scatter(x=dfpl.index, y=dfpl['SMA_fast'], line=dict(
                color='yellow', width=2, dash='dash'), name="SMA Fast", yaxis='y1'),
            go.Scatter(x=dfpl.index, y=dfpl['BB_low'], line=dict(
                color='blue', width=1), name="BBL", yaxis='y1'),
            go.Scatter(x=dfpl.index, y=dfpl['BB_high'], line=dict(
                color='blue', width=1), name="BBH", yaxis='y1'),
            go.Scatter(x=dfpl.index, y=dfpl['sell_dp'], mode="markers", marker=dict(
                size=10, color="darkorange", symbol="triangle-down"), name="Sell", hovertemplate='Sell: %{y:.2f}', yaxis='y1'),
            go.Scatter(x=dfpl.index, y=dfpl['buy_dp'], mode="markers", marker=dict(
                size=10, color="darkgreen", symbol="triangle-up"), name="Buy", hovertemplate='Buy: %{y:.2f}', yaxis='y1'),
            go.Scatter(x=dfpl.index, y=dfpl['Stop_loss'], mode="markers", marker=dict(
                size=10, color="red", symbol="square-open"), name="Stop loss", hovertemplate='Stop loss: %{y:.2f}', yaxis='y1'),
            go.Scatter(x=dfpl.index, y=dfpl['MACD_line'], line=dict(
                color='black', width=1), name="MACD", yaxis='y3'),
            go.Scatter(x=dfpl.index, y=dfpl['MACD_signal'], line=dict(
                color='red', width=1), name="MACD Signal", yaxis='y3'),
            go.Scatter(x=dfpl.index, y=dfpl['Trend'], line=dict(
                color='blue', width=1), name="Trend", yaxis='y2'),
            go.Scatter(x=dfpl.index, y=dfpl['RSI'], line=dict(color='black', width=2), name="RSI", yaxis='y4')]

    layout = go.Layout(title=f"Strategy for {df['symbol'][0]} found {len(df[df['Signal'] != ''])} signals", yaxis_title='Price', dragmode='pan',
                       xaxis=dict(rangeslider=dict(visible=False)),
                       yaxis=dict(fixedrange=False, domain=[
                                  0.3, 1], anchor='y1'),
                       yaxis2=dict(domain=[0.20, 0.29],
                                   anchor='y2', fixedrange=True),
                       yaxis3=dict(domain=[0.10, 0.19],
                                   anchor='y3', fixedrange=False),
                       yaxis4=dict(domain=[0, 0.09], anchor='y4', fixedrange=True))

    fig = go.Figure(data=data, layout=layout)

    # Configure x-axis to enable spikelines
    fig.update_xaxes(showspikes=True, spikecolor='gray', spikemode='across',
                     spikesnap='cursor', spikedash='solid', spikethickness=1)

    # Configure y-axes to enable spikelines
    fig.update_yaxes(showspikes=True, spikecolor='gray', spikemode='across',
                     spikesnap='cursor', spikedash='solid', spikethickness=1)

    current_date = datetime.datetime.now()
    date_string = current_date.strftime("%Y-%m-%d")
    symbol_str = df['symbol'][0]
    filename = f'conservative_{date_string}_{symbol_str}'

    pyo.plot(fig, filename=f'plots/{filename}.html', auto_open=False)

    return filename


def get_signal(df: pd.DataFrame, backcandles: int = 1):
    """Get the current signal for the given dataframe. Returns:
        df: The dataframe with the indicators and signals
        result: The current signal as a json string
        has_signal: True if there is a signal, False otherwise
    """
    df = add_indicators(df)
    df = create_signals(df)
    df = add_trades(df)
    df['name'] = 'conservative'
    result, has_signal = get_latest_signal(df, backcandles)
    return df, result, has_signal
