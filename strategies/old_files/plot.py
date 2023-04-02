import matplotlib.pyplot as plt
import pandas as pd

# create a new figure and axis
fig, ax = plt.subplots(figsize=(10, 6))

df = pd.read_csv('test.csv', index_col='date', parse_dates=True)

# Define a dictionary to map the expected column names to the actual column names
# key = {'open': 'Open', 'high': 'High', 'low': 'Low', 'close': 'Close', 'volume': 'Volume'}

# plot the closing price
ax.plot(df.index, df['close'], label='Closing Price')



# plot the upper and lower Bollinger Bands
ax.plot(df.index, df['bb_upper'], label='Upper Bollinger Band')
ax.plot(df.index, df['bb_lower'], label='Lower Bollinger Band')

# plot buy and sell signals
buy_signals = df[df['signal'] == 'buy'].index
sell_signals = df[df['signal'] == 'sell'].index
ax.scatter(buy_signals, df.loc[buy_signals]['close'], color='green', label='Buy Signal')
ax.scatter(sell_signals, df.loc[sell_signals]['close'], color='red', label='Sell Signal')


# add titles and labels
ax.set_title(f'Bollinger Bands Strategy for {df["symbol"][0]}')
ax.set_xlabel('Date')
ax.set_ylabel('Price')
ax.legend()

# display the plot
plt.show()