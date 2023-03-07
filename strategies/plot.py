import matplotlib.pyplot as plt
import pandas as pd

# create a new figure and axis
fig, ax = plt.subplots(figsize=(10, 6))

df = pd.read_csv('strategies/test.csv')

# plot the closing price
ax.plot(df.index, df['close'], label='Closing Price')

# plot the upper and lower Bollinger Bands
ax.plot(df.index, df['Upper'], label='Upper Bollinger Band')
ax.plot(df.index, df['Lower'], label='Lower Bollinger Band')

# plot buy and sell signals
buy_signals = df[df['Holding'] == 1].index
sell_signals = df[df['Holding'] == 0].index
ax.scatter(buy_signals, df.loc[buy_signals]['close'], color='green', label='Buy Signal')
ax.scatter(sell_signals, df.loc[sell_signals]['close'], color='red', label='Sell Signal')


# add titles and labels
ax.set_title('Bollinger Bands Strategy')
ax.set_xlabel('Date')
ax.set_ylabel('Price')
ax.legend()

# display the plot
plt.show()