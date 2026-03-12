---
applyTo: "assets/js/**/*.js, assets/js/**/*.ts"
---

# JavaScript and TypeScript Guidelines

**For detailed TypeScript and Hugo asset pipeline guidance**, see [.github/agents/typescript-hugo-agent.md](../agents/typescript-hugo-agent.md) which covers:

- TypeScript migration strategies
- Hugo asset pipeline integration
- Component architecture patterns
- Advanced debugging techniques

## TypeScript Configuration

Project uses TypeScript with ES2020 target:

- Config: `tsconfig.json`
- Source: `assets/js/**/*.ts`
- Output: `dist/`
- Build: `yarn build:ts`
- Watch: `yarn build:ts:watch`

## Component Pattern

1. Add `data-component` attribute to HTML element:
   ```html
   <div data-component="my-component"></div>
   ```

2. Create component module in `assets/js/components/`:
   ```typescript
   // assets/js/components/my-component.ts
   export function initMyComponent(element: HTMLElement): void {
     // Component logic
   }
   ```

3. Register in `assets/js/main.js`:
   ```typescript
   import { initMyComponent } from './components/my-component';

   registerComponent('my-component', initMyComponent);
   ```

## Debugging

### Method 1: Chrome DevTools with Source Maps

1. VS Code: Run > Start Debugging
2. Select "Debug Docs (source maps)"
3. Set breakpoints in `assets/js/ns-hugo-imp:` namespace

### Method 2: Debug Helpers

```typescript
import { debugLog, debugBreak, debugInspect } from './utils/debug-helpers';

const data = debugInspect(someData, 'Data');
debugLog('Processing data', 'myFunction');
debugBreak(); // Breakpoint
```

Start with: `yarn hugo server`
Debug with: VS Code "Debug JS (debug-helpers)" configuration

**Remove debug statements before committing.**

## Type Safety

- Use strict TypeScript mode
- Add type annotations for parameters and returns
- Use interfaces for complex objects
- Enable `checkJs: false` for gradual migration

For complete JavaScript documentation, see [DOCS-CONTRIBUTING.md](../../DOCS-CONTRIBUTING.md#javascript-in-the-documentation-ui).

## Related Resources

- **TypeScript & Hugo development**: [.github/agents/typescript-hugo-agent.md](../agents/typescript-hugo-agent.md)
- **Contributing guidelines**: [DOCS-CONTRIBUTING.md](../../DOCS-CONTRIBUTING.md#javascript-in-the-documentation-ui)
