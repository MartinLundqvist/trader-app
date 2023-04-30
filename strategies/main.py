from utils.data_parser import json_to_df_adjusted
from strategies.conservative import get_signal
from flask import Flask, request, jsonify
app = Flask(__name__)


@app.route('/conservative/signal', methods=['POST'])
def fn_conservative_signal():
    data = request.get_json()
    df = json_to_df_adjusted(data)
    df, result, signal = get_signal(df, backcandles=2)
    filename = None

    # if signal:
    #     filename = create_plot(df)

    response = result.copy()
    # response['graph'] = filename
    response['date'] = response.name
    response['limit'] = response['Limit']
    response['signal'] = response['Signal']
    response['stop_loss'] = response['Stop_loss']
    response['take_profit'] = response['Take_profit']

    # return response.to_json(orient='records', date_format='iso')
    return response.to_json()


@app.route('/conservative', methods=['POST'])
def fn_conservative():
    data = request.get_json()
    df = json_to_df_adjusted(data)
    df, result, signal = get_signal(df, backcandles=2)
    df['date'] = df.index

    return df.to_json(orient='records', date_format='iso')


if __name__ == '__main__':
    app.run(debug=True, port=4000)
