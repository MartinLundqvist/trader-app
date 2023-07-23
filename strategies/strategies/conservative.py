from ta.volatility import BollingerBands
from ta.momentum import RSIIndicator
from ta.trend import EMAIndicator, SMAIndicator, ADXIndicator, MACD
import pandas as pd

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
stop_loss = 0.03  # This is in fractions of the current closing price
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

    bb = BollingerBands(df['Close'], window=bb_window, window_dev=bb_std)
    df['BB_high'] = bb.bollinger_hband()
    df['BB_low'] = bb.bollinger_lband()
    df['BB_width'] = bb.bollinger_wband()

    rsi = RSIIndicator(df['Close'], window=rsi_window)
    df['RSI'] = rsi.rsi()

    ema = EMAIndicator(df['Close'], window=ema_window)
    df['EMA'] = ema.ema_indicator()

    sma_slow = SMAIndicator(df['Close'], window=sma_window_slow)
    df['SMA_slow'] = sma_slow.sma_indicator()

    sma_fast = SMAIndicator(df['Close'], window=sma_window_fast)
    df['SMA_fast'] = sma_fast.sma_indicator()

    adx = ADXIndicator(df['High'], df['Low'], df['Close'],  window=adx_window)
    df['ADX_pos'] = adx.adx_pos()
    df['ADX_neg'] = adx.adx_neg()
    df['ADX_index'] = adx.adx()

    macd = MACD(df['Close'], window_slow=macd_window_slow, window_fast=macd_window_fast,
                window_sign=macd_window_signal)

    df['MACD_line'] = macd.macd()
    df['MACD_signal'] = macd.macd_signal()
    df['MACD_hist'] = macd.macd_diff()

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

    buy_mask = df['Signal'] == 'Buy'
    sell_mask = df['Signal'] == 'Sell'

    df.loc[buy_mask] = df[buy_mask].apply(process_buy, axis=1)
    df.loc[sell_mask] = df[sell_mask].apply(process_sell, axis=1)

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


def get_signal(df: pd.DataFrame, backcandles: int = 1):
    """Get the current signal for the given dataframe. Returns:
        df: The dataframe with the indicators and signals
        result: The current signal as a json string
        has_signal: True if there is a signal, False otherwise
    """
    df = add_indicators(df)
    df = create_signals(df)
    df = add_trades(df)
    df['strategy'] = 'conservative'
    result, has_signal = get_latest_signal(df, backcandles)
    return df, result, has_signal
