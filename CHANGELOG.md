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