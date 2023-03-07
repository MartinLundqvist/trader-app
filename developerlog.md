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
