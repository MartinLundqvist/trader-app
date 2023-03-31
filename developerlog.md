# March 2nd

Initiated the project and started working on the MarketDataProvider.
Quickly ended up with the problem that I couldn't get the ESM modules to work with TypeScript.

## Learned how to get ESM moduels to work with Node.js and TypeScript. You need to:

- Add `"type": "module"` to your package.json
- Replace `"main": "index.js"` with `"exports": "./build/index.js"` in your package.json
- Add `"engines": { "node": ">=16.6.0" }` to your package.json
- Add `"module": "esnext"` or higher to your tsconfig.json
- Add `"moduleResolution": "node16"` to your tsconfig.json
- Modify the ts-node script to `"ts-node --esm ./src/index.js"` to your tsconfig.json
- Always use complete, relative file paths when importing modules, and use the `.js` extension (!!)

# March 6th

Finalized a working version of the MarketDataProvider. It is still not abstracted enough, but it works for the Marketstack API. I also added schema validation with Zod as well as a test suite with Jest. Getting Jest to work with ESM modules in Typescript was a bit of a pain, but I got it to work in the end.

## Learned how to configure Jest to work with ESM modules. You need to:

- Go through the tutorial for Jest and TypeScript: https://jestjs.io/docs/getting-started#using-typescript
- Follow these steps: https://kulshekhar.github.io/ts-jest/docs/guides/esm-support/ (but you can exclude the "transform" part of the configuration)

## Learned how to use Zod as a validator for the MarketDataProvider.

The problem that occured was in parsing the JSON date strings from the API to a Date using the Zod package. The solution:

- Use the z.coerce.date() function to when defining the schema

# March 7th

Created a new folder for the python part of the project ./strategies.
It is not clear to me yet how this will nicely co-exist with in the VSCode workspace, but we will see

- Created a new python project in the ./strategies folder and a virtual environment
- Created a simple flask server that listens to the localhost:4000/test port and returns a simple JSON object with the request body inside

I also bootstrapped the position_computer service to throw data at the above end point as a test

Later, I implemented a "Bollinger Bands" strategy in the python script using the ta (Technical Analysis) library, as well as a simple plotting script to visualize the results.

In order to collect more data, I implemented pagination support in the MarketDataProvider.

# March 12th

Was working several evenings to create an end-to-end workflow from the position_computer -> output chart diagram from the python scripts. Several problems had to be fixed.

## Learned how to configure the mplfinance library to work with the ta library

Most tricky item was how to learn to create additional plots on top of the main candlestick top.

- Need to use the `make_addplot` function to create each additional plot
- The shape of the data for each additional plot needs to be the same as the main plot
- The `reindex` function is needed to make sure the data is aligned correctly

## Learned how to make the mplfinance library work in a headless mode to create a png file

- Need to use the `savefig` function to save the plot to a file
- Need to import matplotlib and set the backend to `Agg` before importing mplfinance. (`matplotlib.use('Agg')`)

## Learned how to avoid the Pandas warnings about assigning values to a slice of a dataframe

- Need to use the `loc`or `iloc` functions to assign values to a dataframe.
- I finally opted for the `iloc` function, as i need to iterate over array row positions.
- Then had to use `get_loc`on the df.column.index to get the column position

## Discovered that the Marketplace API has issues with splits and dividends

I have found Tiingo to be a much better API for this purpose, BUT it does not cover stocks from outside the US...

# March 13

Read up on postgres and timescale. Opted to go for vanille postgres for now - not sure I will need the performance of timescale right now
Created a simple script for spinning up a postgres db in a docker container locally. Also looked at whether to use an ORM or not, and which to pick. Ended up with Sequelize - let's see if I stay that path. I had a problem with SSL (as always) - ended up disabling SSL on the client side. I should learn how to work with certificates on the server programatically.

Also had issues with importin .json files in ESM mode... Ended up just parsing the files, but I should make an attempt to update to Node 18.

Finally I did implmement a client to interact with the Tiingo API - AND I'm paying 10 bucks / month to circumvent their API rate limits

## Updated to Node 18.5 (latest Hydrogen LTS)

Had to update the tsconfig.json to increase support for ESM and importing the .json files

- Changed to `"module": "NodeNext"` to the tsconfig.json
- Changed to `"moduleResolution": "nodenext"` to the tsconfig.json
- Added `"resolveJsonModule": true` to the tsconfig.json
- Used the "trick" `import json from "./file.json" assert {type: "json"}` to import the .json files - gotta read up on what that actually means

# March 18th

Lots of work on the schemas and database models, as well as several utility scripts to collect and parse data. In the end I created two database tables. One containing the tickers of the 3,500 larest US companies, and then one containing 10 years of historical EOD data for all those companies.

## Downloaded significant amount of data for US lsited comapnies

- `top_3500_US.json` contains the list of the 3,500 largest US companies. I cross examined this list against available tickers in the Tiingo API, and ended up with 3,500 tickers. These are imported into the local `tickerdata_3500` table
- `top_3500/` folder contains one `.json` file for each ticker with 10 years worth of historical data

I created the following index in the `marketdata_3500` table in order to accelerate queries:

- `CREATE INDEX marketdata_3500_symbol_date ON marketdata_3500 (symbol, date)`

# March 19th

Thinking about how to backtest. I am leaning towards creating a massive database where I run all tickers through the "strategizer". We could create a separate end-point called `backtest` that creates signal back in time. Then I need to simulate the day-to-day decision making.

## Created a backtesting strategy

- Collect marketdata for a list of tickers
- Iterate through them, and generate a backtesting result for each ticker
- Store the backtesting result in an array
- Do some stats on the performance of the backtesting results

## Refactored the python script to be easier to scale

- Created separate file for the "bollinger" strategy scripts
- Created separate end-points and functions for backtest vs signal

# March 27-28th

Lots of trial and error around figuring out how to efficiently do backtesting at scale. I am leaning towards letting the Python world deal with running backtests using the `backtesting` library. I am worried about consistency about whatever the `backtesting` library does, and how the actual trades will be generated in production. I think the next steps now should be:

- Update the "backtesting" end-point that runs the backtesting library on a list of tickers with associated data. It should return a list of backtesting results, such that they can be used to optimize parameters across thousands of tickers
-

## Figured out how to get Jupyter notebooks to work within the VSCode workspace

- Learned, reasonably, about the issue of hooking up plotting capabilities with the right "backend", but found no good solution.
- Using `matplotlib.use('MacOSX')` is the "official" solution, but the external Python window hangs and crashes the Python Kernel
- Using defaults does genereate a graph, but it remains non-interactice (basically a static image)
- In the meantime, the `backtesting` library automatically loads a `BokehJS` backend which does work beautifully also inline. I will stick with that for the time being.

## Learned how to use the `backtesting` library to do backtesting

- The library is very easy to use, and the documentation is OK.
- I had to read up on Classes in Python.
- It was a bit tricky to figure out how to integrate the `ta` library into the `backtesting` concept, but it seems to work now.
- As a next step, I want to figure out a way in which to code the strategy ONCE and then reuse the logic while both backtesting and running in production.

# March 31st

I've studied more examples of coding trading strategies and integrating them with backtests. These are the criteria for the Python code structure:

- Write the function which generates the signal ONCE.
- The function should be able to run in both backtesting, optimization and production mode, and should be able to be called with different parameters.
- This means the function has to return the necessary information to inform a a production trader, as well as a backtester.

Next step is to figure out what the trading API needs. Time to hook up to Alpaca

## Got an Alpaca account and API going

This was a motherf-cker. The Alpaca suggested trading api `@alpacahq/alpaca-trade-api` ended up NOT being ESM modules ready. The alternative community built `@master-chief/alpaca-ts` did not work properly with the latest Node and Typescript versions. I ended up:

- Copy pasting the entire `alpaca-ts` code into my project. That's now in the `src/broker_provider/alpaca` folder.
- Updating the code to work with the latest Node and Typescript versions
- Removing some features that I don't think I will use (to limit the amount of refactoring)
