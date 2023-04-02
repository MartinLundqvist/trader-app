import pandas as pd

def reset(df: pd.DataFrame):
    """Prepare dataframe for backtesting"""
    df['date'] = pd.to_datetime(df['date'])
    df.set_index('date', inplace=True)
    df.sort_values(by='date', inplace=True)
    return df

def use_adjusted_prices(df: pd.DataFrame):
    """Use adjusted HLOC prices"""
    df['Close'] = df['adj_close']
    df['Open'] = df['adj_open']
    df['High'] = df['adj_high']
    df['Low'] = df['adj_low']
    df['Volume'] = df['volume']
    return df

def use_unadjusted_prices(df: pd.DataFrame):
    """Use unadjusted HLOC prices"""
    df['Close'] = df['close']
    df['Open'] = df['open']
    df['High'] = df['high']
    df['Low'] = df['low']
    df['Volume'] = df['volume']
    return df

def string_to_df_adjusted(json_data: str):
    """Parse data from json to pandas dataframe and use adjusted HLOC prices"""
    df = pd.read_json(json_data)
    reset(df)
    use_adjusted_prices(df)
    return df

def string_to_df_adjusted(json_data: str):
    """Parse data from json to pandas dataframe and use unadjusted HLOC prices"""
    df = pd.read_json(json_data)
    reset(df)
    use_unadjusted_prices(df)
    return df

def json_to_df_adjusted(json_data: dict):
    """Parse data from json to pandas dataframe and use adjusted HLOC prices"""
    df = pd.json_normalize(json_data)
    reset(df)
    use_adjusted_prices(df)
    return df

def json_to_df_unadjusted(json_data: dict):
    """Parse data from json to pandas dataframe and use unadjusted HLOC prices"""
    df = pd.json_normalize(json_data)
    reset(df)
    use_unadjusted_prices(df)
    return df