from flask import Flask, request, jsonify
from plot_candlesticks import generate_candlestick_chart
from bollinger import bollinger_backtest, bollinger_signal
app = Flask(__name__)


@app.route('/bollinger/signal', methods=['POST'])
def test():
    data = request.get_json()
    df, sendSignal, sendLimit = bollinger_signal(data)

    # df.to_csv(f'output.csv')

    result = []

    createPNG = False

    if sendSignal != "":
        print('Sending signal...')
        createPNG = True
        i = len(df) - 1
        result.append({
            'date': df.index[i].strftime('%Y-%m-%d %H:%M:%S'),
            'symbol': df['symbol'][i],
            'signal': sendSignal,
            'limit': sendLimit,
            'close': df['close'][i],
            'strength': 1 / ((df['bb_upper'][i]-df['bb_lower'][i])/df['mavg'][i])
        })

    if createPNG == True:
        generate_candlestick_chart(df_to_chart = df)

    # print(df)
    return result

@app.route('/bollinger/backtest', methods=['POST'])
def backtest():
    print('Executing /backtest')
    data = request.get_json()
    df = bollinger_backtest(data)
    
    # generate_candlestick_chart(df_to_chart = df)

    # Need to bring back the date column again to be able to convert to JSON
    df['date'] = df.index.astype(str)
    return df.to_json(orient='records')

if __name__ == '__main__':
    app.run(debug=True, port=4000)