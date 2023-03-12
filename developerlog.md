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

## Learned how to make the mplfinance library work in a headless move to create a png file

- Need to use the `savefig` function to save the plot to a file
- Need to import matplotlib and set the backend to `Agg` before importing mplfinance. (`matplotlib.use('Agg')`)

## Learned how to avoid the Pandas warnings about assigning values to a slice of a dataframe

- Need to use the `loc`or `iloc` functions to assign values to a slice of a dataframe.
- I finally opted for the `iloc` function, as i need to iterate over array row positions.
- Then had to use `get_loc`on the df.column.index to get the column position

## Discovered that the Marketplace API has issues with splits and dividends

I have found Tiingo to be a much better API for this purpose, BUT it does not cover stocks from outside the US...
