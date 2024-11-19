import { execSync } from 'child_process';
import process from 'process';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the current file's directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to execute shell commands
export function execCommand(command) {
  try {
    console.log(`Executing: ${command}`);
    execSync(command, { stdio: 'inherit' });
  } catch (error) {
    console.error(`Error executing command: ${command}`);
    process.exit(1);
  }
};

export const getSwagger = path.join(__dirname, 'getswagger.sh');

export function isPlaceholderFragment(str) {
  const placeholderRegex = new RegExp('^\{.*\}$');
  return placeholderRegex.test(str);
};
