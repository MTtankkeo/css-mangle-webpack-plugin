<div align="center">
  <img width="200px" src="https://github.com/user-attachments/assets/75212c43-14de-471d-aa38-7630a2103510">
  <h1>CSS Mangle Webpack Plugin</h1>
  <table>
        <thead>
          <tr>
            <th>Version</th>
            <th>v1.0.0-alpha5</th>
          </tr>
        </tbody>
    </table>
</div>

# Description
This webpack plugin package is a CSS mangler that globally optimizes and shortens identifier names.

> in brief, It primarily converts identifiers used in CSS (e.g., variables, class names, IDs) into shorter names to reduce file size and improve performance. 🚀

> [!IMPORTANT]
> This package is more developing and fixing..., And this package current version is alpha. And refer to [Change Log](CHANGELOG.md) for details.

## Support Current Status
| Type | Status | Support |
| ---- | ------ | ------- |
| Variable | Alpha and tested for required dev-enviorment | ✅ |
| Class | Not supported | 🟥 |
| Id | Not supported | 🟥 |

# Install by NPM
To install this package in your project, enter the following command.

> When you want to update this package, enter npm update animable-js --save in the terminal to run it.

```
npm install css-mangle-webpack-plugin --save-dev
```

## And then In webpack.config.js
```cjs
// In webpack.config.js
const CSSManglePlugin = require("css-mangle-webpack-plugin").default;

module.exports = {
  // Add an instance of CSSManglePlugin to plugins property value.
  plugins: [new CSSManglePlugin()]
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
@property --reaground { ... }

body {
  background-color: var(--background);
  color: var(--foreground)
}
```

### To
```css
:root {
  --a: white;
  --b: black;
}
@property --c { ... }

body {
  background-color: var(--a);
  color: var(--b)
}
```

## Properties of CSSMangleWebpackPluginOptions
| Name | Descript | Type |
| ---- | ----- | ------- |
| ignoreScript | Whether unique identifiers in JavaScript and JSX should not be targets for transpilation. | boolean
| printLogs | Not ready a comment about this. | "all" \| "warning" \| "none",
| mangle | Not ready a comment about this. | {variable?: boolean}