#!/usr/bin/env node

/**
 * Documentation scaffolding tool
 * Prepares context for Claude to analyze and generates file structure
 *
 * NOTE: This script uses the Task() function which is only available when
 * executed by Claude Code. The Task() function should be globally available
 * in that environment.
 */

import { parseArgs } from 'node:util';
import process from 'node:process';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import yaml from 'js-yaml';
import {
  prepareContext,
  executeProposal,
  validateProposal,
  analyzeURLs,
  loadProducts,
  analyzeStructure,
} from './lib/content-scaffolding.js';
import {
  writeJson,
  readJson,
  fileExists,
  readDraft,
} from './lib/file-operations.js';
import { parseMultipleURLs } from './lib/url-parser.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Repository root
const REPO_ROOT = join(__dirname, '..');

// Temp directory for context and proposal
const TMP_DIR = join(REPO_ROOT, '.tmp');
const CONTEXT_FILE = join(TMP_DIR, 'scaffold-context.json');
const PROPOSAL_FILE = join(TMP_DIR, 'scaffold-proposal.yml');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
};

/**
 * Print colored output
 */
function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

/**
 * Prompt user for input (works in TTY and non-TTY environments)
 */
async function promptUser(question) {
  const readline = await import('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: process.stdin.isTTY !== undefined ? process.stdin.isTTY : true,
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

/**
 * Print section divider
 */
function divider() {
  log('━'.repeat(70), 'cyan');
}

/**
 * Parse command line arguments
 */
function parseArguments() {
  const { values, positionals } = parseArgs({
    options: {
      'from-draft': { type: 'string' },
      url: { type: 'string', multiple: true },
      urls: { type: 'string' },
      products: { type: 'string' },
      ai: { type: 'string', default: 'claude' },
      execute: { type: 'boolean', default: false },
      'context-only': { type: 'boolean', default: false },
      proposal: { type: 'string' },
      'dry-run': { type: 'boolean', default: false },
      yes: { type: 'boolean', default: false },
      help: { type: 'boolean', default: false },
      'follow-external': { type: 'boolean', default: false },
    },
    allowPositionals: true,
  });

  // First positional argument is treated as draft path
  if (positionals.length > 0 && !values['from-draft']) {
    values.draft = positionals[0];
  } else if (values['from-draft']) {
    values.draft = values['from-draft'];
  }

  // Normalize URLs into array
  if (values.urls && !values.url) {
    // --urls provides comma-separated list
    values.url = values.urls.split(',').map((u) => u.trim());
  } else if (values.urls && values.url) {
    // Combine --url and --urls
    const urlsArray = values.urls.split(',').map((u) => u.trim());
    values.url = [
      ...(Array.isArray(values.url) ? values.url : [values.url]),
      ...urlsArray,
    ];
  }

  return values;
}

/**
 * Print usage information
 */
function printUsage() {
  console.log(`
${colors.bright}Documentation Content Scaffolding${colors.reset}

${colors.bright}Usage:${colors.reset}
  yarn docs:create <draft-path>           Create from draft
  yarn docs:create --url <url> --from-draft <path>  Create at URL with draft

${colors.bright}Options:${colors.reset}
  <draft-path>        Path to draft markdown file (positional argument)
  --from-draft <path> Path to draft markdown file
  --url <url>         Documentation URL for new content location
  --products <list>   Comma-separated product keys (required for stdin)
                      Examples: influxdb3_core, influxdb3_enterprise
  --follow-external   Include external (non-docs.influxdata.com) URLs
                      when extracting links from draft. Without this flag,
                      only local documentation links are followed.
  --context-only      Stop after context preparation
                      (for non-Claude tools)
  --proposal <path>   Import and execute proposal from JSON file
  --dry-run           Show what would be created without creating
  --yes               Skip confirmation prompt
  --help              Show this help message

${colors.bright}Stdin Support:${colors.reset}
  When piping content from stdin, you must specify target products:

  cat draft.md | yarn docs:create --products influxdb3_core
  echo "# Content" | yarn docs:create --products influxdb3_core,influxdb3_enterprise

${colors.bright}Link Following:${colors.reset}
  By default, the script extracts links from your draft and prompts you
  to select which ones to include as context. This helps the AI:
  - Maintain consistent terminology
  - Avoid duplicating content
  - Add appropriate \`related\` frontmatter links

  Local documentation links are always available for selection.
  Use --follow-external to also include external URLs (GitHub, etc.)

${colors.bright}Workflow (Create from draft):${colors.reset}
  1. Create a draft markdown file with your content
  2. Run: yarn docs:create drafts/new-feature.md
  3. Script runs all agents automatically
  4. Review and confirm to create files

${colors.bright}Workflow (Create at specific URL):${colors.reset}
  1. Create draft: vim drafts/new-feature.md
  2. Run: yarn docs:create \\
          --url https://docs.influxdata.com/influxdb3/core/admin/new-feature/ \\
          --from-draft drafts/new-feature.md
  3. Script determines structure from URL and uses draft content
  4. Review and confirm to create files

${colors.bright}Workflow (Manual - for non-Claude tools):${colors.reset}
  1. Prepare context:
     yarn docs:create --context-only drafts/new-feature.md
  2. Run your AI tool with templates from scripts/templates/
  3. Save proposal to .tmp/scaffold-proposal.json
  4. Execute:
     yarn docs:create --proposal .tmp/scaffold-proposal.json

${colors.bright}Examples:${colors.reset}
  # Create from draft (AI determines location)
  yarn docs:create drafts/new-feature.md

  # Create at specific URL with draft content
  yarn docs:create --url /influxdb3/core/admin/new-feature/ \\
                   --from-draft drafts/new-feature.md

  # Create with linked context (prompts for link selection)
  yarn docs:create drafts/new-feature.md

  # Include external links for selection
  yarn docs:create --follow-external drafts/api-guide.md

  # Pipe content from stdin (requires --products)
  cat drafts/quick-note.md | yarn docs:create --products influxdb3_core
  echo "# Test Content" | yarn docs:create --products influxdb3_core

  # Preview changes
  yarn docs:create --from-draft drafts/new-feature.md --dry-run

${colors.bright}Note:${colors.reset}
  To edit existing pages, use: yarn docs:edit <url>
`);
}

/**
 * Phase 1a: Prepare context from URLs
 */
async function prepareURLPhase(urls, draftPath, options, stdinContent = null) {
  log('\n🔍 Analyzing URLs and finding files...', 'bright');

  try {
    // Parse URLs
    const parsedURLs = parseMultipleURLs(urls);
    log(`\n✓ Parsed ${parsedURLs.length} URL(s)`, 'green');

    // Analyze URLs and find files
    const urlAnalysis = analyzeURLs(parsedURLs);

    // Print summary
    for (const result of urlAnalysis) {
      log(`\n  URL: ${result.url}`);
      log(`  Product: ${result.parsed.product} (${result.parsed.namespace})`);
      if (result.exists) {
        log(`  ✓ Found: ${result.files.main}`, 'green');
        if (result.files.isShared) {
          log(`  ✓ Shared content: ${result.files.sharedSource}`, 'cyan');
          log(`  ✓ Found ${result.files.variants.length} variant(s)`, 'cyan');
          for (const variant of result.files.variants) {
            log(`    - ${variant}`, 'cyan');
          }
        }
      } else {
        log('  ✗ Page does not exist (will create)', 'yellow');
        log(`  → Will create at: ${result.files.main}`, 'yellow');
      }
    }

    // Determine mode
    const mode = urlAnalysis.every((r) => r.exists) ? 'edit' : 'create';
    log(`\n✓ Mode: ${mode}`, 'green');

    // Load existing content if editing
    const existingContent = {};
    if (mode === 'edit') {
      for (const result of urlAnalysis) {
        if (result.exists) {
          const fullPath = join(REPO_ROOT, result.files.main);
          const content = readFileSync(fullPath, 'utf8');
          existingContent[result.files.main] = content;

          // Also load shared source if exists
          if (result.files.isShared && result.files.sharedSource) {
            const sharedPath = join(
              REPO_ROOT,
              `content${result.files.sharedSource}`
            );
            if (existsSync(sharedPath)) {
              const sharedContent = readFileSync(sharedPath, 'utf8');
              existingContent[`content${result.files.sharedSource}`] =
                sharedContent;
            }
          }
        }
      }
    }

    // Build context (include URL analysis)
    let context = null;
    let draft;

    if (stdinContent) {
      // Use stdin content
      draft = stdinContent;
      log('✓ Using draft from stdin', 'green');
      context = prepareContext(draft);
    } else if (draftPath) {
      // Use draft content if provided
      draft = readDraft(draftPath);
      draft.path = draftPath;
      context = prepareContext(draft);
    } else {
      // Minimal context for editing existing pages
      const products = loadProducts();
      context = {
        draft: {
          path: null,
          content: null,
          existingFrontmatter: {},
        },
        products,
        productHints: {
          mentioned: [],
          suggested: [],
        },
        versionInfo: {
          version: parsedURLs[0].namespace === 'influxdb3' ? '3.x' : '2.x',
          tools: [],
          apis: [],
        },
        structure: analyzeStructure(),
        conventions: {
          sharedContentDir: 'content/shared/',
          menuKeyPattern: '{namespace}_{product}',
          weightLevels: {
            description: 'Weight ranges by level',
            level1: '1-99 (top-level pages)',
            level2: '101-199 (section landing pages)',
            level3: '201-299 (detail pages)',
            level4: '301-399 (sub-detail pages)',
          },
          namingRules: {
            files: 'Use lowercase with hyphens (e.g., manage-databases.md)',
            directories: 'Use lowercase with hyphens',
            shared: 'Shared content in /content/shared/',
          },
          testing: {
            codeblocks:
              'Use pytest-codeblocks annotations for testable examples',
            docker: 'Use compose.yaml services for testing code samples',
            commands: '',
          },
        },
      };
    }

    // Add URL analysis to context
    context.mode = mode;
    context.urls = urlAnalysis;
    context.existingContent = existingContent;

    // Write context to temp file
    writeJson(CONTEXT_FILE, context);

    log(
      `\n✓ Prepared context → ${CONTEXT_FILE.replace(REPO_ROOT, '.')}`,
      'green'
    );

    // If context-only mode, stop here
    if (options['context-only']) {
      log('');
      divider();
      log('Context preparation complete!', 'bright');
      log('');
      log('Next steps for manual workflow:', 'cyan');
      log('1. Use your AI tool with prompts from scripts/templates/');
      log(
        '2. Generate proposal JSON matching ' +
          'scripts/schemas/scaffold-proposal.schema.json'
      );
      log('3. Save to .tmp/scaffold-proposal.json');
      log('4. Run: yarn docs:create --proposal .tmp/scaffold-proposal.json');
      divider();
      log('');
      return null;
    }

    return context;
  } catch (error) {
    log(`\n✗ Error analyzing URLs: ${error.message}`, 'red');
    if (error.stack) {
      console.error(error.stack);
    }
    process.exit(1);
  }
}

/**
 * Phase 1b: Prepare context from draft
 */
async function preparePhase(draftPath, options, stdinContent = null) {
  log('\n🔍 Analyzing draft and repository structure...', 'bright');

  let draft;

  // Handle stdin vs file
  if (stdinContent) {
    draft = stdinContent;
    log('✓ Using draft from stdin', 'green');
  } else {
    // Validate draft exists
    if (!fileExists(draftPath)) {
      log(`✗ Draft file not found: ${draftPath}`, 'red');
      process.exit(1);
    }
    draft = readDraft(draftPath);
    draft.path = draftPath;
  }

  try {
    // Prepare context
    const context = prepareContext(draft);

    // Extract links from draft
    const { extractLinks, followLocalLinks, fetchExternalLinks } = await import(
      './lib/content-scaffolding.js'
    );

    const links = extractLinks(draft.content);

    if (links.localFiles.length > 0 || links.external.length > 0) {
      // Filter external links if flag not set
      if (!options['follow-external']) {
        links.external = [];
      }

      // Let user select which external links to follow
      // (local files are automatically included)
      const selected = await selectLinksToFollow(links);

      // Follow selected links
      const linkedContent = [];

      if (selected.selectedLocal.length > 0) {
        log('\n📄 Loading local files...', 'cyan');
        // Determine base path for resolving relative links
        const basePath = draft.path
          ? dirname(join(REPO_ROOT, draft.path))
          : REPO_ROOT;
        const localResults = followLocalLinks(selected.selectedLocal, basePath);
        linkedContent.push(...localResults);
        const successCount = localResults.filter((r) => !r.error).length;
        log(`✓ Loaded ${successCount} local file(s)`, 'green');
      }

      if (selected.selectedExternal.length > 0) {
        log('\n🌐 Fetching external URLs...', 'cyan');
        const externalResults = await fetchExternalLinks(
          selected.selectedExternal
        );
        linkedContent.push(...externalResults);
        const successCount = externalResults.filter((r) => !r.error).length;
        log(`✓ Fetched ${successCount} external page(s)`, 'green');
      }

      // Add to context
      if (linkedContent.length > 0) {
        context.linkedContent = linkedContent;

        // Show any errors
        const errors = linkedContent.filter((lc) => lc.error);
        if (errors.length > 0) {
          log('\n⚠️  Some links could not be loaded:', 'yellow');
          errors.forEach((e) => log(`  • ${e.url}: ${e.error}`, 'yellow'));
        }
      }
    }

    // Write context to temp file
    writeJson(CONTEXT_FILE, context);

    // Print summary
    log(
      '\n✓ Loaded draft content ' +
        `(${context.draft.content.split('\n').length} lines)`,
      'green'
    );
    log(
      `✓ Analyzed ${Object.keys(context.products).length} products ` +
        'from data/products.yml',
      'green'
    );
    log(
      `✓ Found ${context.structure.existingPaths.length} existing pages`,
      'green'
    );
    if (context.linkedContent) {
      log(
        `✓ Included ${context.linkedContent.length} linked page(s) as context`,
        'green'
      );
    }
    log(
      `✓ Prepared context → ${CONTEXT_FILE.replace(REPO_ROOT, '.')}`,
      'green'
    );

    // If context-only mode, stop here
    if (options['context-only']) {
      log('');
      divider();
      log('Context preparation complete!', 'bright');
      log('');
      log('Next steps for manual workflow:', 'cyan');
      log('1. Use your AI tool with prompts from scripts/templates/');
      log(
        '2. Generate proposal JSON matching ' +
          'scripts/schemas/scaffold-proposal.schema.json'
      );
      log('3. Save to .tmp/scaffold-proposal.json');
      log('4. Run: yarn docs:create --proposal .tmp/scaffold-proposal.json');
      divider();
      log('');
      return null;
    }

    return context;
  } catch (error) {
    log(`\n✗ Error preparing context: ${error.message}`, 'red');
    if (error.stack) {
      console.error(error.stack);
    }
    process.exit(1);
  }
}

/**
 * Select target products (interactive or from flags)
 */
async function selectProducts(context, options) {
  const detected = context.productHints?.mentioned || [];

  // Expand products with multiple versions into separate entries
  const allProducts = [];
  const productMap = {}; // Maps display name to product key

  for (const [key, product] of Object.entries(context.products)) {
    if (product.versions && product.versions.length > 1) {
      // Multi-version product: create separate entries for each version
      product.versions.forEach((version) => {
        const displayName = `${product.name} ${version}`;
        allProducts.push(displayName);
        productMap[displayName] = key;
      });
    } else {
      // Single version or no version info: use product name as-is
      allProducts.push(product.name);
      productMap[product.name] = key;
    }
  }

  // Sort products: detected first, then alphabetically within each group
  allProducts.sort((a, b) => {
    const aDetected = detected.includes(a);
    const bDetected = detected.includes(b);

    // Detected products first
    if (aDetected && !bDetected) return -1;
    if (!aDetected && bDetected) return 1;

    // Then alphabetically
    return a.localeCompare(b);
  });

  // Case 1: Explicit flag provided
  if (options.products) {
    const requested = options.products.split(',').map((p) => p.trim());
    const invalid = requested.filter((p) => !allProducts.includes(p));

    if (invalid.length > 0) {
      log(
        `\n✗ Invalid products: ${invalid.join(', ')}\n` +
          `Valid products: ${allProducts.join(', ')}`,
        'red'
      );
      process.exit(1);
    }

    log(
      `✓ Using products from --products flag: ${requested.join(', ')}`,
      'green'
    );
    return requested;
  }

  // Case 2: Unambiguous (single product detected)
  if (detected.length === 1) {
    log(`✓ Auto-selected product: ${detected[0]}`, 'green');
    return detected;
  }

  // Case 3: URL-based (extract from URL)
  if (context.urls?.length > 0) {
    const urlPath = context.urls[0].url;
    // Extract product from URL like /influxdb3/core/... or /influxdb/cloud/...
    const match = urlPath.match(/^\/(influxdb3?\/.+?)\//);
    if (match) {
      const productPath = match[1].replace(/\//g, '-');
      const product = allProducts.find((p) => p.includes(productPath));
      if (product) {
        log(`✓ Product from URL: ${product}`, 'green');
        return [product];
      }
    }
  }

  // Case 4: Ambiguous or none detected - show interactive menu
  log('\n📦 Select target products:\n', 'bright');
  allProducts.forEach((p, i) => {
    const mark = detected.includes(p) ? '✓' : ' ';
    log(`  ${i + 1}. [${mark}] ${p}`, 'cyan');
  });

  const answer = await promptUser(
    '\nEnter numbers (comma-separated, e.g., 1,3,5): '
  );

  if (!answer) {
    log('✗ No products selected', 'red');
    process.exit(1);
  }

  const indices = answer
    .split(',')
    .map((s) => parseInt(s.trim()) - 1)
    .filter((i) => i >= 0 && i < allProducts.length);

  if (indices.length === 0) {
    log('✗ No valid products selected', 'red');
    process.exit(1);
  }

  const selected = indices.map((i) => allProducts[i]);
  log(`\n✓ Selected products: ${selected.join(', ')}`, 'green');
  return selected;
}

/**
 * Prompt user to select which external links to include
 * Local file paths are automatically followed
 * @param {object} links - {localFiles, external} from extractLinks
 * @returns {Promise<object>} {selectedLocal, selectedExternal}
 */
async function selectLinksToFollow(links) {
  // Local files are followed automatically (no user prompt)
  // External links require user selection
  if (links.external.length === 0) {
    return {
      selectedLocal: links.localFiles || [],
      selectedExternal: [],
    };
  }

  log('\n🔗 Found external links in draft:\n', 'bright');

  const allLinks = [];
  let index = 1;

  // Show external links for selection
  links.external.forEach((link) => {
    log(`    ${index}. ${link}`, 'yellow');
    allLinks.push({ type: 'external', url: link });
    index++;
  });

  const answer = await promptUser(
    '\nSelect external links to include as context ' +
      '(comma-separated numbers, or "all"): '
  );

  if (!answer || answer.toLowerCase() === 'none') {
    return {
      selectedLocal: links.localFiles || [],
      selectedExternal: [],
    };
  }

  let selectedIndices;
  if (answer.toLowerCase() === 'all') {
    selectedIndices = Array.from({ length: allLinks.length }, (_, i) => i);
  } else {
    selectedIndices = answer
      .split(',')
      .map((s) => parseInt(s.trim()) - 1)
      .filter((i) => i >= 0 && i < allLinks.length);
  }

  const selectedExternal = [];

  selectedIndices.forEach((i) => {
    const link = allLinks[i];
    selectedExternal.push(link.url);
  });

  log(
    `\n✓ Following ${links.localFiles?.length || 0} local file(s) ` +
      `and ${selectedExternal.length} external link(s)`,
    'green'
  );
  return {
    selectedLocal: links.localFiles || [],
    selectedExternal,
  };
}

/**
 * Run single content generator agent with direct file generation (Claude Code)
 */
async function runAgentsWithTaskTool(
  context,
  selectedProducts,
  mode,
  isURLBased,
  hasExistingContent
) {
  // Build context description
  const contextDesc = `
Mode: ${mode}
${isURLBased ? `URLs: ${context.urls.length} URL(s) analyzed` : 'Draft-based workflow'}
${hasExistingContent ? `Existing content: ${Object.keys(context.existingContent).length} file(s)` : 'Creating new content'}
Target Products: ${selectedProducts.join(', ')}
`;

  log(`   ${contextDesc.trim().split('\n').join('\n   ')}\n`, 'cyan');

  log('🤖 Generating documentation files directly...', 'bright');

  // Use the same prompt as manual workflow for consistency
  const prompt = generateClaudePrompt(
    context,
    selectedProducts,
    mode,
    isURLBased,
    hasExistingContent
  );

  await Task({
    subagent_type: 'general-purpose',
    description:
      mode === 'edit'
        ? 'Update documentation files'
        : 'Generate documentation files',
    prompt: prompt,
  });

  log('   ✓ Files generated\n', 'green');
  log(
    `\n✓ Summary written to ${PROPOSAL_FILE.replace(REPO_ROOT, '.')}`,
    'green'
  );
}

/**
 * Generate simplified Claude prompt for direct file generation
 */
function generateClaudePrompt(
  context,
  selectedProducts,
  mode,
  isURLBased,
  hasExistingContent
) {
  const prompt = `You are an expert InfluxData documentation writer.

**Context File**: Read from \`.tmp/scaffold-context.json\`
**Target Products**: Use \`context.selectedProducts\` field (${selectedProducts.join(', ')})
**Mode**: ${mode === 'edit' ? 'Edit existing content' : 'Create new documentation'}
${isURLBased ? `**URLs**: ${context.urls.map((u) => u.url).join(', ')}` : ''}
${
  context.linkedContent?.length > 0
    ? `
**Linked References**: The draft references ${context.linkedContent.length} page(s) from existing documentation.

These are provided for context to help you:
- Maintain consistent terminology and style
- Avoid duplicating existing content
- Understand related concepts and their structure
- Add appropriate links to the \`related\` frontmatter field

Linked content details available in \`context.linkedContent\`:
${context.linkedContent
  .map((lc) =>
    lc.error
      ? `- ❌ ${lc.url} (${lc.error})`
      : `- ✓ [${lc.type}] ${lc.title} (${lc.path || lc.url})`
  )
  .join('\n')}

**Important**: Use this content for context and reference, but do not copy it verbatim. Consider adding relevant pages to the \`related\` field in frontmatter.
`
    : ''
}

**Your Task**: Generate complete documentation files directly (no proposal step).

**Important**: The context file contains all products from data/products.yml, but you should ONLY create documentation for the products listed in \`context.selectedProducts\`.

**Workflow**:
1. Read and analyze \`.tmp/scaffold-context.json\`
2. ${mode === 'edit' ? 'Review existing content and plan improvements' : 'Analyze draft content to determine topic, audience, and structure'}
3. ${isURLBased ? 'Use URL paths to determine file locations' : 'Determine appropriate section (admin, write-data, query-data, etc.)'}
4. Decide if content should be shared across products
5. **Generate and write markdown files directly** using the Write tool
6. Create a summary YAML file at \`.tmp/scaffold-proposal.yml\`

**Content Requirements**:
- **Style**: Active voice, present tense, second person ("you")
- **Formatting**: Semantic line feeds (one sentence per line)
- **Headings**: Use h2-h6 only (h1 comes from title)
- **Code Examples**:
  - Use ${context.versionInfo?.tools?.join(' or ') || 'influxdb3, influx, or influxctl'} CLI
  - Include pytest-codeblocks annotations
  - Format to fit within 80 characters
  - Use long options (--option vs -o)
  - Show expected output
- **Links**: Descriptive link text, no "click here"
- **Placeholders**: Use UPPERCASE for values users need to replace (e.g., DATABASE_NAME, AUTH_TOKEN)

**File Structure**:
${
  selectedProducts.length > 1 || context.productHints?.isShared
    ? `- Content applies to multiple products:
  - Create ONE shared content file in content/shared/
  - Create frontmatter-only files for each product referencing it`
    : `- Product-specific content:
  - Create files directly in product directories`
}

**Validation Checks** (run before writing files):
1. **Path validation**: Lowercase, hyphens only (no underscores in filenames)
2. **Weight conflicts**: Check sibling pages, choose unused weight 101-199
3. **Frontmatter completeness**: All required fields present
4. **Shared content**: If multi-product, verify source paths are correct
5. **Menu structure**: Parent sections exist in product menu hierarchy

**File Generation**:
For each file you need to create:

1. **Check if file exists**: Use Read tool first (ignore errors if not found)
2. **Generate frontmatter** in YAML format with proper nesting:
   \`\`\`yaml
   ---
   title: Page Title
   description: SEO-friendly description under 160 characters
   menu:
     product_version:
       name: Nav Name
       parent: section
   weight: 101
   related:
     - /related/page/
   alt_links:
     other_product: /other/path/
   ---
   \`\`\`

3. **Write full markdown content** with:
   - Frontmatter (YAML block)
   - Complete article content
   - Code examples with proper annotations
   - Proper internal links

4. **Use Write tool**: Write the complete file
   - For new files: just use Write
   - For existing files: Read first, then Write

**Summary File**: After generating all files, create \`.tmp/scaffold-proposal.yml\`:

\`\`\`yaml
topic: Brief description of what was created
targetProducts:
  - ${selectedProducts.join('\n  - ')}
section: admin | write-data | query-data | get-started | reference
isShared: ${selectedProducts.length > 1}
filesCreated:
  - path: content/path/to/file.md
    type: shared-content | frontmatter-only | product-specific
    status: created | updated
validationResults:
  pathsValid: true | false
  weightsValid: true | false
  frontmatterComplete: true | false
  issues: []
nextSteps:
  - Review generated files
  - Test code examples
  - Check internal links
\`\`\`

**Important**:
- Use the Write tool for ALL files (markdown and YAML summary)
- For existing files, use Read first, then Write to overwrite
- Generate COMPLETE content, not stubs or placeholders
- Run validation checks before writing each file

Begin now. Generate the files directly.
`;
  return prompt;
}

/**
 * Phase 2: Run AI agent analysis
 * Orchestrates multiple specialized agents to analyze draft and
 * generate proposal
 */
async function runAgentAnalysis(context, options) {
  log('📋 Phase 2: AI Analysis\n', 'cyan');

  // Detect environment and determine workflow
  const isClaudeCodeEnv = typeof Task !== 'undefined';
  const aiMode = options.ai || 'claude';
  const useTaskTool = isClaudeCodeEnv && aiMode === 'claude';

  if (useTaskTool) {
    log(
      '🤖 Detected Claude Code environment - running agents automatically\n',
      'green'
    );
  } else if (aiMode === 'claude') {
    log(
      '📋 Claude Code environment not detected - will output prompt for copy-paste\n',
      'cyan'
    );
  }

  try {
    const mode = context.mode || 'create';
    const isURLBased = context.urls && context.urls.length > 0;
    const hasExistingContent =
      context.existingContent &&
      Object.keys(context.existingContent).length > 0;

    // Select target products
    const selectedProducts = await selectProducts(context, options);

    // Add selectedProducts to context and update the context file
    context.selectedProducts = selectedProducts;
    writeJson(CONTEXT_FILE, context);
    log(
      `✓ Updated context with selected products: ${selectedProducts.join(', ')}`,
      'green'
    );

    // Hybrid workflow: automatic (Task tool) vs manual (prompt output)
    if (useTaskTool) {
      // Automatic workflow using Task tool
      await runAgentsWithTaskTool(
        context,
        selectedProducts,
        mode,
        isURLBased,
        hasExistingContent
      );
    } else {
      // Manual workflow: save consolidated prompt to file
      const consolidatedPrompt = generateClaudePrompt(
        context,
        selectedProducts,
        mode,
        isURLBased,
        hasExistingContent
      );

      // Generate filename from draft or topic
      const draftName = context.draft?.path
        ? context.draft.path.split('/').pop().replace(/\.md$/, '')
        : 'untitled';
      const sanitizedName = draftName
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '');

      const promptDir = join(REPO_ROOT, '.context/drafts');
      const promptFile = join(promptDir, `${sanitizedName}-ai-prompt.md`);

      // Ensure directory exists
      if (!existsSync(promptDir)) {
        const fs = await import('fs');
        fs.mkdirSync(promptDir, { recursive: true });
      }

      // Write prompt to file
      const fs = await import('fs');
      fs.writeFileSync(promptFile, consolidatedPrompt, 'utf8');

      log('\n✅ AI prompt saved!', 'green');
      log(`\n📄 File: ${promptFile.replace(REPO_ROOT, '.')}\n`, 'cyan');

      log('📝 Next steps:', 'bright');
      log('  1. Open the prompt file in your editor', 'yellow');
      log('  2. Copy the entire content', 'yellow');
      log('  3. Paste into your AI tool (Claude, ChatGPT, etc.)', 'yellow');
      log(
        '  4. The AI will generate documentation files directly in content/',
        'yellow'
      );
      log('  5. Review the generated files and iterate as needed', 'yellow');
      log(
        `  6. Check the summary at ${PROPOSAL_FILE.replace(REPO_ROOT, '.')}`,
        'yellow'
      );

      process.exit(0);
    }
  } catch (error) {
    log(`\n✗ Error during AI analysis: ${error.message}`, 'red');
    if (error.stack) {
      console.error(error.stack);
    }
    process.exit(1);
  }
}

// Remove all the old agent code below - it's been replaced by the hybrid approach above
// The function now ends here

/**
 * Phase 3: Execute proposal
 */
async function executePhase(options) {
  log('\n📁 Phase 3: Executing Proposal\n', 'bright');

  // Auto-detect proposal if not specified
  let proposalPath = options.proposal || PROPOSAL_FILE;

  if (!fileExists(proposalPath)) {
    log(`\n✗ Proposal file not found: ${proposalPath}`, 'red');
    log(
      '\nRun yarn docs:create --draft <file> first to generate proposal',
      'yellow'
    );
    process.exit(1);
  }

  // Read and validate proposal
  const proposal = readJson(proposalPath);

  try {
    validateProposal(proposal);
  } catch (error) {
    log(`\n✗ Invalid proposal: ${error.message}`, 'red');
    process.exit(1);
  }

  // Show preview
  log('\n📋 Proposal Summary:\n', 'cyan');
  log(`  Topic: ${proposal.analysis.topic}`, 'cyan');
  log(`  Products: ${proposal.analysis.targetProducts.join(', ')}`, 'cyan');
  log(`  Section: ${proposal.analysis.section}`, 'cyan');
  log(`  Shared: ${proposal.analysis.isShared ? 'Yes' : 'No'}`, 'cyan');

  if (proposal.analysis.styleReview?.issues?.length > 0) {
    log(
      `\n⚠️  Style Issues (${proposal.analysis.styleReview.issues.length}):`,
      'yellow'
    );
    proposal.analysis.styleReview.issues.forEach((issue) => {
      log(`    • ${issue}`, 'yellow');
    });
  }

  log('\n📁 Files to create:\n', 'bright');
  proposal.files.forEach((file) => {
    const icon = file.type === 'shared-content' ? '📄' : '📋';
    const size = file.content ? ` (${file.content.length} chars)` : '';
    log(`  ${icon} ${file.path}${size}`, 'cyan');
  });

  // Dry run mode
  if (options['dry-run']) {
    log('\n✓ Dry run complete (no files created)', 'green');
    return;
  }

  // Confirm unless --yes flag
  if (!options.yes) {
    const answer = await promptUser('\nProceed with creating files? (y/n): ');

    if (answer.toLowerCase() !== 'y') {
      log('✗ Cancelled by user', 'yellow');
      process.exit(0);
    }
  }

  // Execute proposal
  log('\n📁 Creating files...', 'bright');
  const result = executeProposal(proposal);

  // Report results
  if (result.created.length > 0) {
    log('\n✅ Created files:', 'green');
    result.created.forEach((file) => {
      log(`  ✓ ${file}`, 'green');
    });
  }

  if (result.errors.length > 0) {
    log('\n✗ Errors:', 'red');
    result.errors.forEach((err) => log(`  • ${err}`, 'red'));
  }

  // Print next steps
  if (result.created.length > 0) {
    log('\n🎉 Done! Next steps:', 'bright');
    log('  1. Review generated frontmatter and content');
    log('  2. Test locally: npx hugo server');
    log(
      `  3. Test links: yarn test:links ${result.created[0].replace(/\/[^/]+$/, '/')}**/*.md`
    );
    log('  4. Commit changes: git add content/ && git commit');
  }

  if (result.errors.length > 0) {
    process.exit(1);
  }
}

/**
 * Main entry point
 */
async function main() {
  const options = parseArguments();

  // Show help first (don't wait for stdin)
  if (options.help) {
    printUsage();
    process.exit(0);
  }

  // Check for stdin only if no draft file was provided
  const hasStdin = !process.stdin.isTTY;
  let stdinContent = null;

  if (hasStdin && !options.draft) {
    // Stdin requires --products option
    if (!options.products) {
      log(
        '\n✗ Error: --products is required when piping content from stdin',
        'red'
      );
      log('Example: echo "# Content" | yarn docs:create --products influxdb3_core', 'yellow');
      process.exit(1);
    }

    // Import readDraftFromStdin
    const { readDraftFromStdin } = await import('./lib/file-operations.js');
    log('📥 Reading draft from stdin...', 'cyan');
    stdinContent = await readDraftFromStdin();
  }

  // Determine workflow
  if (options.url && options.url.length > 0) {
    // URL-based workflow requires draft content
    if (!options.draft && !stdinContent) {
      log('\n✗ Error: --url requires --draft <path>', 'red');
      log('The --url option specifies WHERE to create content.', 'yellow');
      log(
        'You must provide --draft to specify WHAT content to create.',
        'yellow'
      );
      log('\nExample:', 'cyan');
      log(
        '  yarn docs:create --url /influxdb3/core/admin/new-feature/ \\',
        'cyan'
      );
      log('                   --draft drafts/new-feature.md', 'cyan');
      log('\nTo edit an existing page, use: yarn docs:edit <url>', 'cyan');
      process.exit(1);
    }

    const context = await prepareURLPhase(
      options.url,
      options.draft,
      options,
      stdinContent
    );

    if (options['context-only']) {
      // Stop after context preparation
      process.exit(0);
    }

    // Continue with AI analysis (Phase 2)
    log('\n🤖 Running AI analysis with specialized agents...\n', 'bright');
    await runAgentAnalysis(context, options);

    // Execute proposal (Phase 3)
    await executePhase(options);
  } else if (options.draft || stdinContent) {
    // Draft-based workflow (from file or stdin)
    const context = await preparePhase(options.draft, options, stdinContent);

    if (options['context-only']) {
      // Stop after context preparation
      process.exit(0);
    }

    // Continue with AI analysis (Phase 2)
    log('\n🤖 Running AI analysis with specialized agents...\n', 'bright');
    await runAgentAnalysis(context, options);

    // Execute proposal (Phase 3)
    await executePhase(options);
  } else if (options.proposal) {
    // Import and execute external proposal
    if (!fileExists(options.proposal)) {
      log(`\n✗ Proposal file not found: ${options.proposal}`, 'red');
      process.exit(1);
    }
    // Copy proposal to expected location
    const proposal = readJson(options.proposal);
    writeJson(PROPOSAL_FILE, proposal);
    await executePhase(options);
  } else if (options.execute || options['dry-run']) {
    // Legacy: Execute proposal (deprecated)
    log(
      '\n⚠ Warning: --execute is deprecated. Use --proposal instead.',
      'yellow'
    );
    await executePhase(options);
  } else {
    // No valid options provided
    log(
      'Error: Must specify a docs URL (new or existing), a draft path, or --proposal',
      'red'
    );
    log('Run with --help for usage information\n');
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    log(`\nFatal error: ${error.message}`, 'red');
    console.error(error.stack);
    process.exit(1);
  });
}

export { preparePhase, executePhase };
