<div align="center">
  <img width="200px" src="https://github.com/user-attachments/assets/a621ed86-c8a0-41ee-92e8-0a576c20e2e5">
  <h1>CSS Mangle Webpack Plugin</h1>
  <table>
        <thead>
          <tr>
            <th>Version</th>
            <th>v1.0.0-alpha18</th>
          </tr>
        </tbody>
    </table>
</div>

# Introduction
This webpack plugin package is a CSS mangler that globally optimizes and shortens identifier names.

> in brief, It primarily converts identifiers used in CSS (e.g., variables, class names, IDs) into shorter names to reduce file size and improve performance. 🚀

> [!IMPORTANT]
> This package is more developing and fixing..., And this package current version is alpha. And refer to [Change Log](CHANGELOG.md) for details.

## Support Current Status
| Type | Status | Support |
| ---- | ------ | ------- |
| Variable | Alpha and tested for required dev-enviorment. | ✅ |
| Class | Not supported by default currently, but experimental stage. | 🟧 |
| Id | Not supported by default currently, but experimental stage. | 🟧 |
| Minify | Alpha and tested for required dev-enviorment, but this is optional. | 🟨 |
| Others | Not supported | 🟥 |

# Install by NPM
To install this package in your project, enter the following command.

> When you want to update this package, enter `npm update css-mangle-webpack-plugin --save` in the terminal to run it.

```
npm install css-mangle-webpack-plugin --save-dev
```

## And then In webpack.config.js
```cjs
// In webpack.config.js
const CSSManglePlugin = require("css-mangle-webpack-plugin");

module.exports = {
  // Add an instance of CSSManglePlugin to plugins property value.
  plugins: [new CSSManglePlugin({...})]
}
```

## How is a bundle transpiled when this plugin applyed?
The example below demonstrates the simplest of many possible transformations. In practice, all CSS identifiers written in the script, including JSX, are also transpiled.

### From
```css
:root {
  --background: white;
  --foreground: black;
}

/* Supoort Custom Property Registration. */
@property --reaground { ... }

body {
  background-color: var(--background);
  color: var(--foreground)
}
```
```js
const property = "var(--background, white)";
const literals = "--background";
```

### To
```css
:root {
  --a: white;
  --b: black;
}

/* Supoort Custom Property Registration. */
@property --c { ... }

body {
  background-color: var(--a);
  color: var(--b)
}
```
```js
const property = "var(--a, white)";
const literals = "--a";
```

## Properties of CSSMangleWebpackPluginOptions
| Name | Description | Type |
| ---- | ----- | ------- |
| ignoreScript | Whether unique identifiers in JavaScript and JSX should not be targets for transpilation. | boolean
| processStage | This option value defines which bundle process stage of Webpack to proceed with optimization task. | "OPTIMIZE" \| "OPTIMIZE_INLINE";
| printLogs | Not ready a comment about this. | "ALL" \| "WARNING" \| "NONE"
| debugLogs | Not ready a comment about this. | "ALL" \| "TIMEOUT" \| "NONE"
| reserved | Not ready a comment about this. | string[]
| minify | Not ready a comment about this. | boolean \| Partial<CSSMinificationManglerOptions>
| mangle | Not ready a comment about this. | { variableName?: boolean \| CSSVariableManglerOptions, className?: boolean, idName?: boolean, options: ... } \| boolean
