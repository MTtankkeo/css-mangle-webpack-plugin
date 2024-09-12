# 1.0.0-alpha3
- Support Custom Property Registration of CSS. _(e.g. @property --background { ... })_

# 1.0.0-alpha4
- Fixed bugs about transform and handler.

# 1.0.0-alpha5
- Fixed to identify abnormal or non-idiomatic CSS variable declarations.

# 1.0.0-alpha6
- Added a plugin option `bundleStage` to CSSMangleWebpackPlugin.
- Added a plugin option `CSSVariableManglerOptions` of `variableName` of `mangle` to CSSMangleWebpackPlugin.
- Fixed for overall modularization to the webpack plugin about codes and logic.

# 1.0.0-alpha7
- Fixed to transform variables using even upper-case alphabets.
- Added undeclared into options property, this is whether an undeclared identifier in this webpack plugin would still be considered for minification.

# 1.0.0-alpha8
- Added debugLogs into options property, This is whether about primarily an option for a user to output additional information to the CMD.

# 1.0.0-alpha9
- Added minify into options property, This is whether to use additional features, annotation removal, and optimization to turn rgb into hex.

# 1.0.0-alpha10 ~ 11
- Updated about minify into options property.
- Fixed to share related [ManglerContext] instances with each other in the compilation assets files.

# 1.0.0-alpha13
- Added removing escape-sequence optional feature into about minify options.
- Fixed the way of export default about Typescirpt.

# 1.0.0-alpha14 ~ 15
- Added syntax parsing about standard APIs, e.g. document.getElementById() and document.getElementsByClassName()
- Added syntax parsing about standard APIs, e.g. document.querySelector() and document.querySelectorAll()

# 1.0.0-alpha16
- Fixed an issue where the `minify` option did not correctly handle CSS syntax such as , and .a .b.

# 1.0.0-alpha17
- Fixed issues related to high resource consumption, extended processing time, and unstable builds caused by identifying globally common CSS-related syntax patterns. Modified the process to handle different file types separately.

# 1.0.0-alpha18
- Fixed an issue where the minify option only recognized opacity values between 0 and 1 when parsing `rgb` or `rgba` syntax.
- Fixed an issue where the logic incorrectly determined that there was no need to explicitly define the opacity value when it was 0%. Now, the explicit value is only omitted when the opacity is 100%.