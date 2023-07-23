from utils.data_parser import json_to_df_adjusted
from strategies.conservative import get_signal
from flask import Flask, request
from waitress import serve
# import warnings
app = Flask(__name__)

# warnings.filterwarnings('ignore', category=RuntimeWarning)


@app.route('/conservative/signal', methods=['POST'])
def fn_conservative_signal():

    data = request.get_json()
    df = json_to_df_adjusted(data)
    df, result, signal = get_signal(df, backcandles=1)

    response = result.copy()
    response['date'] = response.name
    response['limit'] = response['Limit']
    response['signal'] = response['Signal']
    response['stop_loss'] = response['Stop_loss']
    response['take_profit'] = response['Take_profit']

    return response.to_json()


@app.route('/conservative', methods=['POST'])
def fn_conservative():
    data = request.get_json()
    df = json_to_df_adjusted(data)
    df, result, signal = get_signal(df, backcandles=2)
    df['date'] = df.index

    return df.to_json(orient='records', date_format='iso')


if __name__ == '__main__':
    serve(app, host='0.0.0.0', port=4000, threads=500, connection_limit=1000)
