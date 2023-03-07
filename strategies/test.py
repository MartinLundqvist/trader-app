from flask import Flask, request, jsonify
import pandas as pd
import ta
app = Flask(__name__)



@app.route('/test', methods=['POST'])
def test():
    data = request.get_json()
    df = pd.json_normalize(data)
    df['date'] = pd.to_datetime(df['date'])
    df.set_index('date', inplace=True)
    # df = add_all_ta_features(df, open="open", high="high", low="low", close="close", volume="volume", fillna=True)

    # Calculate the 20-day moving average and Bollinger Bands
    df['MA20'] = ta.volatility.bollinger_mavg(df['close'], window=20)
    df['Upper'] = ta.volatility.bollinger_hband(df['close'], window=20)
    df['Lower'] = ta.volatility.bollinger_lband(df['close'], window=20)

    # Determine buy and sell signals based on Bollinger Bands
    df['Signal'] = None
    for i in range(1, len(df)):
        if df['close'][i] > df['Upper'][i-1]:
            df['Signal'][i] = 0 # Sell
            
        elif df['close'][i] < df['Lower'][i-1]:
            df['Signal'][i] = 1 # Buy
            

    # Forward fill the signals to create a holding column
    df['Holding'] = df['Signal'].fillna(method='ffill')

    # Calculate daily returns based on holding column
    df['Returns'] = df['close'].pct_change() * df['Holding'].shift(1)

    # Calculate cumulative returns
    df['Cumulative Returns'] = (1 + df['Returns']).cumprod()

    df.to_csv('strategies/test.csv')

    # print(df)
    return jsonify(data)

if __name__ == '__main__':
    app.run(debug=True, port=4000)