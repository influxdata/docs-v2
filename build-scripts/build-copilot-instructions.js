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
 * Includes optimization to reduce file size for better performance
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

  // Optimize content by removing less critical sections for Copilot
  content = optimizeContentForContext(content);

  // Format the content for Copilot instructions with applyTo attribute
  content = `---
applyTo: "content/**/*.md, layouts/**/*.html"
---

# Contributing instructions for InfluxData Documentation

## Purpose and scope

Help document InfluxData products
by creating clear, accurate technical content with proper
code examples, frontmatter, shortcodes, and formatting.

${content}`;

  // Write the formatted content to the instructions file
  fs.writeFileSync(instructionsPath, content);

  const fileSize = fs.statSync(instructionsPath).size;
  const sizeInKB = (fileSize / 1024).toFixed(1);
  console.log(
    `✅ Generated instructions at ${instructionsPath} (${sizeInKB}KB)`
  );

  if (fileSize > 40000) {
    console.warn(
      `⚠️  Instructions file is large (${sizeInKB}KB > 40KB) and may impact performance`
    );
  }

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

/**
 * Optimize content for Copilot by removing or condensing less critical sections
 * while preserving essential documentation guidance
 */
function optimizeContentForContext(content) {
  // Remove or condense sections that are less relevant for context assistance
  const sectionsToRemove = [
    // Installation and setup sections (less relevant for writing docs)
    /### Install project dependencies[\s\S]*?(?=\n##|\n###|$)/g,
    /### Install Node\.js dependencies[\s\S]*?(?=\n##|\n###|$)/g,
    /### Install Docker[\s\S]*?(?=\n##|\n###|$)/g,
    /#### Build the test dependency image[\s\S]*?(?=\n##|\n###|$)/g,
    /### Install Visual Studio Code extensions[\s\S]*?(?=\n##|\n###|$)/g,
    /### Run the documentation locally[\s\S]*?(?=\n##|\n###|$)/g,

    // Testing and CI/CD sections (important but can be condensed)
    /### Set up test scripts and credentials[\s\S]*?(?=\n##|\n###|$)/g,
    /#### Test shell and python code blocks[\s\S]*?(?=\n##|\n###|$)/g,
    /#### Troubleshoot tests[\s\S]*?(?=\n##|\n###|$)/g,
    /### Pytest collected 0 items[\s\S]*?(?=\n##|\n###|$)/g,

    // Long code examples that can be referenced elsewhere
    /```[\s\S]{500,}?```/g,

    // Repetitive examples
    /#### Example[\s\S]*?(?=\n####|\n###|\n##|$)/g,
  ];

  // Remove identified sections
  sectionsToRemove.forEach((regex) => {
    content = content.replace(regex, '');
  });

  // Condense whitespace
  content = content.replace(/\n{3,}/g, '\n\n');

  // Remove HTML comments
  content = content.replace(/<!--[\s\S]*?-->/g, '');

  // Shorten repetitive content
  content = content.replace(/(\{%[^%]+%\})[\s\S]*?\1/g, (match) => {
    // If it's a long repeated pattern, show it once with a note
    if (match.length > 200) {
      const firstOccurrence = match.split('\n\n')[0];
      return (
        firstOccurrence +
        '\n\n[Similar patterns apply - see full CONTRIBUTING.md for complete examples]'
      );
    }
    return match;
  });

  return content;
}
