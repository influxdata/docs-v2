#!/usr/bin/env node

/**
 * Process management for spawning editor
 * Handles both detached (non-blocking) and attached (blocking) modes
 */

import { spawn } from 'child_process';

/**
 * Spawn editor process
 * @param {string} editorCommand - Full editor command (may include args)
 * @param {string[]} files - Absolute file paths to open
 * @param {Object} options
 * @param {boolean} [options.wait=false] - Wait for editor to close
 * @param {Function} [options.onError] - Error callback
 * @returns {ChildProcess|null}
 */
export function spawnEditor(editorCommand, files, options = {}) {
  const { wait = false, onError } = options;

  // Parse command (handle "code --wait" style)
  const parts = editorCommand.split(' ');
  const command = parts[0];
  const args = [...parts.slice(1), ...files];

  const spawnOptions = wait
    ? {
        stdio: 'inherit',
        detached: false,
      }
    : {
        stdio: 'ignore',
        detached: true,
      };

  try {
    const child = spawn(command, args, spawnOptions);

    child.on('error', (error) => {
      if (onError) {
        onError(error);
      } else {
        throw error;
      }
    });

    if (wait) {
      // Blocking mode: wait for exit
      child.on('close', (code) => {
        if (code !== 0 && code !== null) {
          console.warn(`\nEditor exited with code ${code}`);
        }
      });
    } else {
      // Non-blocking mode: detach and exit immediately
      child.unref();
    }

    return child;
  } catch (error) {
    if (onError) {
      onError(error);
    } else {
      throw error;
    }
    return null;
  }
}

/**
 * Check if we should wait for editor
 * @param {boolean} waitFlag - Value of --wait flag
 * @returns {boolean}
 */
export function shouldWait(waitFlag) {
  // Explicit flag takes precedence
  if (waitFlag !== undefined) {
    return waitFlag;
  }

  // Default: don't wait (fixes issue #21)
  return false;
}
