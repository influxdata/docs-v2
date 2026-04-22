#!/usr/bin/env node

/**
 * Editor resolution and validation
 * Determines which editor to use and validates it exists
 */

import { execSync } from 'child_process';
import { platform } from 'os';

/**
 * Check if a command exists in PATH
 * @param {string} command - Command to check
 * @returns {boolean}
 */
function commandExists(command) {
  try {
    const cmd =
      platform() === 'win32' ? `where ${command}` : `command -v ${command}`;
    execSync(cmd, { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

/**
 * Resolve editor command from environment and defaults
 * @param {Object} options
 * @param {string} [options.editor] - Explicit editor from --editor flag
 * @returns {string} Editor command
 * @throws {Error} If no suitable editor found
 */
export function resolveEditor(options = {}) {
  // Priority order:
  // 1. Explicit --editor flag
  // 2. DOCS_EDITOR environment variable
  // 3. VISUAL environment variable
  // 4. EDITOR environment variable
  // 5. OS-specific defaults

  const candidates = [
    options.editor,
    process.env.DOCS_EDITOR,
    process.env.VISUAL,
    process.env.EDITOR,
    getOSDefaultEditor(),
  ].filter(Boolean);

  for (const editor of candidates) {
    // Extract command name (handle "code --wait" style)
    const command = editor.split(' ')[0];

    if (commandExists(command)) {
      return editor;
    }
  }

  throw new Error(
    'No suitable editor found. Set EDITOR environment variable or use --editor flag.\n' +
      'Examples:\n' +
      '  export EDITOR=vim\n' +
      '  export EDITOR=nano\n' +
      '  docs edit <url> --editor vim'
  );
}

/**
 * Get OS-specific default editor
 * @returns {string}
 */
function getOSDefaultEditor() {
  const os = platform();

  // Try common CLI editors first (these won't hang in wait mode)
  const cliEditors = ['vim', 'nano', 'emacs', 'vi'];
  for (const editor of cliEditors) {
    if (commandExists(editor)) {
      return editor;
    }
  }

  // Try VS Code (common GUI editor that works well)
  if (commandExists('code')) {
    return 'code';
  }

  // Fall back to OS "open" commands
  if (os === 'darwin') return 'open';
  if (os === 'win32') return 'start';
  return 'xdg-open'; // Linux
}
