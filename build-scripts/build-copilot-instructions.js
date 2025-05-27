#!/usr/bin/env node

/**
 * Script to generate GitHub Copilot instructions
 * for InfluxData documentation.
 */
import fs from 'fs';
import path from 'path';
import process from 'process';
import { execSync } from 'child_process';

// Get the current file path and directory
export { buildContributingInstructions };

(async () => {
  try {
    await buildContributingInstructions();
  } catch (error) {
    console.error('Error generating Copilot instructions:', error);
  }
})();

/** Build instructions from CONTRIBUTING.md
 * This script reads CONTRIBUTING.md, formats it appropriately,
 * and saves it to .github/instructions/contributing.instructions.md
 */
function buildContributingInstructions() {
  // Paths
  const contributingPath = path.join(process.cwd(), 'CONTRIBUTING.md');
  const instructionsDir = path.join(process.cwd(), '.github', 'instructions');
  const instructionsPath = path.join(
    instructionsDir,
    'contributing.instructions.md'
  );

  // Ensure the instructions directory exists
  if (!fs.existsSync(instructionsDir)) {
    fs.mkdirSync(instructionsDir, { recursive: true });
  }

  // Read the CONTRIBUTING.md file
  let content = fs.readFileSync(contributingPath, 'utf8');

  // Format the content for Copilot instructions with applyTo attribute
  content = `---
applyTo: "content/**/*.md, layouts/**/*.html"
---

# GitHub Copilot Instructions for InfluxData Documentation

## Purpose and scope

GitHub Copilot should help document InfluxData products
by creating clear, accurate technical content with proper
code examples, frontmatter, shortcodes, and formatting.

${content}`;

  // Write the formatted content to the instructions file
  fs.writeFileSync(instructionsPath, content);

  console.log(`✅ Generated Copilot instructions at ${instructionsPath}`);

  // Add the file to git if it has changed
  try {
    const gitStatus = execSync(
      `git status --porcelain "${instructionsPath}"`
    ).toString();
    if (gitStatus.trim()) {
      execSync(`git add "${instructionsPath}"`);
      console.log('✅ Added instructions file to git staging');
    }
  } catch (error) {
    console.warn('⚠️  Could not add instructions file to git:', error.message);
  }
}
