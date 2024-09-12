
__[x] Custom Property Registration Support__<br>
[Refer to a given developer.mozilla.org for detiails](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)
<br>
> _2024-08-21 ~ 2024-08-30_ (fixed 2024-08-21)

- - -

__[ ] Add ignore identifiers to CSS mangle task__<br>
This is just adding a option that ignore identifiers to CSS mangle task.
> _2024-08-22 ~ 2024-08-24_

- - -

__[ ] Publish Beta/Release Version__<br>
This is just stabilize this package gradually and slowly. i.e. package maintenance.<br>
> _2024-08-21 ~ 2025-01-01_

__[ ] CSS Declaration Keyword Support__<br>
- /* @css */ ".hello-world1 {}"
- /* @css */ '#hello-world2 {}'
- /* @css */ \`#hello-world3 {}\`
```js
const regexp =/(?<=\/\*\s*@css\s*\*\/\s*[`"'])[^]+?(?=[`"'])/g
```