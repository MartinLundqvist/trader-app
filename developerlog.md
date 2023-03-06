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
