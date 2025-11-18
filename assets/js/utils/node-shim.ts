/**
 * Node.js module shim for TypeScript code that runs in both browser and Node.js
 *
 * This utility provides conditional imports for Node.js-only modules, allowing
 * TypeScript files to be bundled for the browser (via Hugo/esbuild) while still
 * working in Node.js environments.
 *
 * @module utils/node-shim
 */

/**
 * Detect if running in Node.js vs browser environment
 */
export const isNode =
  typeof process !== 'undefined' &&
  process.versions != null &&
  process.versions.node != null;

/**
 * Node.js module references (lazily loaded in Node.js environment)
 */
export interface NodeModules {
  fileURLToPath: (url: string) => string;
  dirname: (path: string) => string;
  join: (...paths: string[]) => string;
  readFileSync: (path: string, encoding: BufferEncoding) => string;
  existsSync: (path: string) => boolean;
  yaml: { load: (content: string) => unknown };
}

let nodeModulesCache: NodeModules | undefined;

/**
 * Lazy load Node.js modules (only when running in Node.js)
 *
 * This function dynamically imports Node.js built-in modules (`url`, `path`, `fs`)
 * and third-party modules (`js-yaml`) only when called in a Node.js environment.
 * In browser environments, this returns undefined and the imports are tree-shaken out.
 *
 * @returns Promise resolving to NodeModules or undefined
 *
 * @example
 * ```typescript
 * import { loadNodeModules, isNode } from './utils/node-shim.js';
 *
 * async function readConfig() {
 *   if (!isNode) return null;
 *
 *   const nodeModules = await loadNodeModules();
 *   if (!nodeModules) return null;
 *
 *   const configPath = nodeModules.join(__dirname, 'config.yml');
 *   if (nodeModules.existsSync(configPath)) {
 *     const content = nodeModules.readFileSync(configPath, 'utf8');
 *     return nodeModules.yaml.load(content);
 *   }
 * }
 * ```
 */
export async function loadNodeModules(): Promise<NodeModules | undefined> {
  // Early return for browser - this branch will be eliminated by tree-shaking
  if (!isNode) {
    return undefined;
  }

  // Return cached modules if already loaded
  if (nodeModulesCache) {
    return nodeModulesCache;
  }

  // This code path is never reached in browser builds due to isNode check above
  // The dynamic imports will be tree-shaken out by esbuild
  try {
    // Use Function constructor to hide imports from static analysis
    // This prevents esbuild from trying to resolve them during browser builds
    const loadModule = new Function('moduleName', 'return import(moduleName)');

    const [urlModule, pathModule, fsModule, yamlModule] = await Promise.all([
      loadModule('url'),
      loadModule('path'),
      loadModule('fs'),
      loadModule('js-yaml'),
    ]);

    nodeModulesCache = {
      fileURLToPath: urlModule.fileURLToPath,
      dirname: pathModule.dirname,
      join: pathModule.join,
      readFileSync: fsModule.readFileSync,
      existsSync: fsModule.existsSync,
      yaml: yamlModule.default as { load: (content: string) => unknown },
    };

    return nodeModulesCache;
  } catch (err) {
    if (err instanceof Error) {
      console.warn('Failed to load Node.js modules:', err.message);
    }
    return undefined;
  }
}

/**
 * Get the directory path of the current module (Node.js only)
 *
 * @param importMetaUrl - import.meta.url from the calling module
 * @returns Directory path or undefined if not in Node.js
 *
 * @example
 * ```typescript
 * import { getModuleDir } from './utils/node-shim.js';
 *
 * const moduleDir = await getModuleDir(import.meta.url);
 * ```
 */
export async function getModuleDir(
  importMetaUrl: string
): Promise<string | undefined> {
  const nodeModules = await loadNodeModules();
  if (!nodeModules) {
    return undefined;
  }

  const filename = nodeModules.fileURLToPath(importMetaUrl);
  return nodeModules.dirname(filename);
}
