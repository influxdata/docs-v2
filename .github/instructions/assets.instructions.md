---
applyTo: "assets/**/*.md, layouts/**/*.html"
---

## JavaScript in the documentation UI

The InfluxData documentation UI uses JavaScript with ES6+ syntax and
`assets/js/main.js` as the entry point to import modules from.


1. In your HTML file, add a `data-component` attribute to the element that will
   encapsulate the UI feature and use the JavaScript module.

   ```html
   <div data-component="my-component"></div>
   ```

2. In `assets/js/main.js`, import your module and initialize it on the element.

## Debugging helpers for JavaScript

In your JavaScript module, import the debug helpers from `assets/js/utils/debug-helpers.js`.

```js
   import { debugLog, debugBreak, debugInspect } from './utils/debug-helpers.js';

   const data = debugInspect(someData, 'Data');
   debugLog('Processing data', 'myFunction');

   function processData() {
     // Add a breakpoint that works with DevTools
     debugBreak();
     
     // Your existing code...
   }
   ```

## Debugging with VS Code

1. Start Hugo in development mode--for example:

   ```bash
   yarn hugo server
   ```

2. In VS Code, go to Run > Start Debugging, and select the "Debug JS (debug-helpers)" configuration.

Your system uses the configuration in `launch.json` to launch the site in Chrome
and attach the debugger to the Developer Tools console.

Make sure to remove the debug statements before merging your changes.
The debug helpers are designed to be used in development and should not be used in production.

_See full CONTRIBUTING.md for complete details._

