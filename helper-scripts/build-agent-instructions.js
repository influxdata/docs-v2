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
    buildContributingInstructions();
  } catch (error) {
    console.error('Error generating agent instructions:', error);
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
      `⚠️  Instructions file is large (${sizeInKB}KB > 40KB) and may ` +
        `impact performance`
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

    // Also add any extracted files to git
    const extractedFiles = execSync(
      `git status --porcelain "${instructionsDir}/*.md"`
    ).toString();
    if (extractedFiles.trim()) {
      execSync(`git add "${instructionsDir}"/*.md`);
      console.log('✅ Added extracted files to git staging');
    }
  } catch (error) {
    console.warn('⚠️  Could not add files to git:', error.message);
  }
}

/**
 * Optimize content for AI agents by processing sections based on tags
 * while preserving essential documentation guidance and structure
 */
function optimizeContentForContext(content) {
  // Split content into sections based on agent:instruct tags
  const sections = [];
  const tagRegex =
    /<!-- agent:instruct: (essential|condense|remove|extract\s+\S+) -->/g;

  let lastIndex = 0;
  let matches = [...content.matchAll(tagRegex)];

  // Process each tagged section
  for (let i = 0; i < matches.length; i++) {
    const match = matches[i];

    // Add untagged content before this tag
    if (match.index > lastIndex) {
      sections.push({
        type: 'untagged',
        content: content.slice(lastIndex, match.index),
      });
    }

    // Find the end of this section (next tag or end of content)
    const nextMatch = matches[i + 1];
    const endIndex = nextMatch ? nextMatch.index : content.length;

    sections.push({
      type: match[1],
      content: content.slice(match.index, endIndex),
    });

    lastIndex = endIndex;
  }

  // Add any remaining untagged content
  if (lastIndex < content.length) {
    sections.push({
      type: 'untagged',
      content: content.slice(lastIndex),
    });
  }

  // Process sections based on their tags
  let processedContent = '';

  sections.forEach((section) => {
    switch (section.type) {
      case 'essential':
        processedContent += cleanupSection(section.content);
        break;
      case 'condense':
        processedContent += condenseSection(section.content);
        break;
      case 'remove':
        // Skip these sections entirely
        break;
      default:
        if (section.type.startsWith('extract ')) {
          const filename = section.type.substring(8); // Remove 'extract ' prefix
          processedContent += processExtractSection(section.content, filename);
        } else {
          processedContent += processUntaggedSection(section.content);
        }
        break;
      case 'untagged':
        processedContent += processUntaggedSection(section.content);
        break;
    }
  });

  // Final cleanup
  return cleanupFormatting(processedContent);
}

/**
 * Clean up essential sections while preserving all content
 */
function cleanupSection(content) {
  // Remove the tag comment itself
  content = content.replace(/<!-- agent:instruct: essential -->\n?/g, '');

  // Only basic cleanup for essential sections
  content = content.replace(/\n{4,}/g, '\n\n\n');

  return content;
}

/**
 * Condense sections to key information
 */
function condenseSection(content) {
  // Remove the tag comment
  content = content.replace(/<!-- agent:instruct: condense -->\n?/g, '');

  // Extract section header
  const headerMatch = content.match(/^(#+\s+.+)/m);
  if (!headerMatch) return content;

  // Condense very long code examples
  content = content.replace(/```[\s\S]{300,}?```/g, (match) => {
    const firstLines = match.split('\n').slice(0, 3).join('\n');
    return `${firstLines}\n# ... (see full CONTRIBUTING.md for complete example)\n\`\`\``;
  });

  // Keep first paragraph and key bullet points
  const lines = content.split('\n');
  const processedLines = [];
  let inCodeBlock = false;
  let paragraphCount = 0;

  for (const line of lines) {
    if (line.startsWith('```')) {
      inCodeBlock = !inCodeBlock;
      processedLines.push(line);
    } else if (inCodeBlock) {
      processedLines.push(line);
    } else if (line.startsWith('#')) {
      processedLines.push(line);
    } else if (line.trim() === '') {
      processedLines.push(line);
    } else if (
      line.startsWith('- ') ||
      line.startsWith('* ') ||
      line.match(/^\d+\./)
    ) {
      processedLines.push(line);
    } else if (paragraphCount < 2 && line.trim() !== '') {
      processedLines.push(line);
      if (line.trim() !== '' && !line.startsWith('  ')) {
        paragraphCount++;
      }
    }
  }

  return (
    processedLines.join('\n') +
    '\n\n_See full CONTRIBUTING.md for complete details._\n\n'
  );
}

/**
 * Process extract sections to create separate files and placeholders
 */
function processExtractSection(content, filename) {
  // Remove the tag comment
  content = content.replace(/<!-- agent:instruct: extract \S+ -->\n?/g, '');

  // Extract section header
  const headerMatch = content.match(/^(#+\s+.+)/m);
  if (!headerMatch) return content;

  const header = headerMatch[1];
  const sectionTitle = header.replace(/^#+\s+/, '');

  // Write the section content to a separate file
  const instructionsDir = path.join(process.cwd(), '.github', 'instructions');
  const extractedFilePath = path.join(instructionsDir, filename);

  // Add frontmatter to the extracted file
  const extractedContent = `---
applyTo: "content/**/*.md, layouts/**/*.html"
---

${content}`;

  fs.writeFileSync(extractedFilePath, extractedContent);

  console.log(`✅ Extracted ${sectionTitle} to ${extractedFilePath}`);

  // Create a placeholder that references the extracted file
  return `${header}\n\n_For the complete ${sectionTitle} reference, see ${filename}._\n\n`;
}

/**
 * Process untagged sections with moderate optimization
 */
function processUntaggedSection(content) {
  // Apply moderate processing to untagged sections

  // Condense very long code examples but keep structure
  content = content.replace(/```[\s\S]{400,}?```/g, (match) => {
    const firstLines = match.split('\n').slice(0, 5).join('\n');
    return `${firstLines}\n# ... (content truncated)\n\`\`\``;
  });

  return content;
}

/**
 * Clean up formatting issues in the processed content
 */
function cleanupFormatting(content) {
  // Fix multiple consecutive newlines
  content = content.replace(/\n{4,}/g, '\n\n\n');

  // Remove agent-instructions comments that might remain
  content = content.replace(/<!-- agent:instruct: \w+ -->\n?/g, '');

  // Fix broken code blocks
  content = content.replace(
    /```(\w+)?\n\n+```/g,
    '```$1\n# (empty code block)\n```'
  );

  // Fix broken markdown headers
  content = content.replace(/^(#+)\s*$/gm, '');

  // Fix broken list formatting
  content = content.replace(/^(-|\*|\d+\.)\s*$/gm, '');

  // Remove empty sections
  content = content.replace(/^#+\s+.+\n+(?=^#+\s+)/gm, (match) => {
    if (match.trim().split('\n').length <= 2) {
      return '';
    }
    return match;
  });

  return content;
}
