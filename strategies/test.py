from flask import Flask, request, jsonify
import pandas as pd
import ta
from plot_candlesticks import generate_candlestick_chart
app = Flask(__name__)



@app.route('/test', methods=['POST'])
def test():
    data = request.get_json()

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

        signal_col_idx = df.columns.get_loc('signal')

        for i in range(1, len(df)):
            if df['close'][i] > df['bb_upper'][i-1]:
                df.iloc[i, signal_col_idx] = 'sell' #sell
                
            elif df['close'][i] < df['bb_lower'][i-1]:
                df.iloc[i, signal_col_idx] = 'buy' # Buy
                
        
        df.to_csv(f'output.csv')
        
    except Exception as e:
        print(f'Error while processing {symbol}.')
        print(e)

    generate_candlestick_chart(df_to_chart = df)

    # print(df)
    return jsonify(data)

if __name__ == '__main__':
    app.run(debug=True, port=4000)