#!/usr/bin/env node

/**
 * Script to generate agent instruction adapters for InfluxData documentation.
 */
import fs from 'fs';
import path from 'path';
import process from 'process';
import matter from 'gray-matter';
import { pathToFileURL } from 'url';

export {
  buildAgentInstructionAdapters,
  buildPlatformReference,
  ensureClaudeSkillsSymlink,
};

const PROJECT_ROOT = process.cwd();
const CANONICAL_INSTRUCTIONS_DIR = path.join(
  PROJECT_ROOT,
  '.agents',
  'instructions'
);
const CANONICAL_SKILLS_DIR = path.join(PROJECT_ROOT, '.agents', 'skills');
const CLAUDE_SKILLS_PATH = path.join(PROJECT_ROOT, '.claude', 'skills');
const GENERATED_HEADER =
  '<!-- This file is auto-generated from .agents/instructions. Do not edit directly. -->\n\n' +
  "<!-- Run 'yarn build:agent:instructions' to regenerate it. -->\n\n";

const SCOPED_AGENTS = [
  { dir: 'api-docs', title: 'API Documentation' },
  { dir: 'assets', title: 'Asset Development' },
  { dir: 'content', title: 'Documentation Content' },
  { dir: 'layouts', title: 'Hugo Layouts and Shortcodes' },
];

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  (async () => {
    try {
      await buildPlatformReference();
      await buildAgentInstructionAdapters();
      ensureClaudeSkillsSymlink();
    } catch (error) {
      console.error('Error generating agent instructions:', error);
      process.exitCode = 1;
    }
  })();
}

async function buildAgentInstructionAdapters() {
  const instructions = readCanonicalInstructions();

  fs.mkdirSync(path.join(PROJECT_ROOT, '.github', 'instructions'), {
    recursive: true,
  });
  fs.mkdirSync(path.join(PROJECT_ROOT, '.claude', 'rules'), {
    recursive: true,
  });

  for (const instruction of instructions) {
    writeCopilotInstruction(instruction);
    writeClaudeRule(instruction);
  }

  writeScopedAgents(instructions);

  console.log(`✅ Generated ${instructions.length} instruction adapter set(s)`);
}

function readCanonicalInstructions() {
  if (!fs.existsSync(CANONICAL_INSTRUCTIONS_DIR)) {
    return [];
  }

  const files = fs
    .readdirSync(CANONICAL_INSTRUCTIONS_DIR)
    .filter((file) => file.endsWith('.md'))
    .sort();

  return files.map((file) => {
    const sourcePath = path.join(CANONICAL_INSTRUCTIONS_DIR, file);
    const parsed = matter.read(sourcePath);
    const { name, description, paths } = parsed.data;

    const hasRequiredFields =
      name && description && Array.isArray(paths) && paths.length > 0;

    if (!hasRequiredFields) {
      throw new Error(
        `${path.relative(PROJECT_ROOT, sourcePath)} must define name, ` +
          'description, and paths[]'
      );
    }

    return {
      body: parsed.content.trimStart(),
      description,
      name,
      paths,
      sourceDir: path.dirname(sourcePath),
      sourcePath,
    };
  });
}

function writeCopilotInstruction(instruction) {
  const outputPath = path.join(
    PROJECT_ROOT,
    '.github',
    'instructions',
    `${instruction.name}.instructions.md`
  );
  const frontmatter = [
    '---',
    `applyTo: "${instruction.paths.join(', ')}"`,
    '---',
    '',
  ].join('\n');

  writeGeneratedMarkdown(outputPath, instruction, frontmatter);
}

function writeClaudeRule(instruction) {
  const outputPath = path.join(
    PROJECT_ROOT,
    '.claude',
    'rules',
    `${instruction.name}.md`
  );
  const frontmatter = [
    '---',
    'paths:',
    ...instruction.paths.map((glob) => `  - "${glob}"`),
    '---',
    '',
  ].join('\n');

  writeGeneratedMarkdown(outputPath, instruction, frontmatter);
}

function writeGeneratedMarkdown(outputPath, instruction, frontmatter) {
  const body = rewriteRelativeLinks(
    instruction.body,
    instruction.sourceDir,
    path.dirname(outputPath)
  );
  fs.writeFileSync(outputPath, `${frontmatter}\n${GENERATED_HEADER}${body}`);
}

function writeScopedAgents(instructions) {
  for (const scopedAgent of SCOPED_AGENTS) {
    const matchingInstructions = instructions
      .filter((instruction) =>
        instruction.paths.some((glob) => glob.startsWith(`${scopedAgent.dir}/`))
      )
      .sort((a, b) => {
        const aExact = a.name === scopedAgent.dir ? 0 : 1;
        const bExact = b.name === scopedAgent.dir ? 0 : 1;
        return aExact - bExact || a.name.localeCompare(b.name);
      });

    if (matchingInstructions.length === 0) continue;

    const outputPath = path.join(PROJECT_ROOT, scopedAgent.dir, 'AGENTS.md');
    const parts = [
      GENERATED_HEADER.trimEnd(),
      '',
      `# ${scopedAgent.title} Agent Instructions`,
      '',
      `These instructions apply when working in \`${scopedAgent.dir}/\`.`,
      '',
    ];

    for (const instruction of matchingInstructions) {
      parts.push(
        demoteHeadings(
          rewriteRelativeLinks(
            instruction.body,
            instruction.sourceDir,
            path.dirname(outputPath)
          )
        ),
        ''
      );
    }

    fs.writeFileSync(outputPath, parts.join('\n').trimEnd() + '\n');
  }
}

function demoteHeadings(markdown) {
  let inFence = false;

  return markdown
    .split('\n')
    .map((line) => {
      if (/^```/.test(line) || /^````/.test(line)) {
        inFence = !inFence;
        return line;
      }

      if (inFence) return line;
      return line.replace(/^(#{1,5}) /, '#$1 ');
    })
    .join('\n');
}

function rewriteRelativeLinks(markdown, sourceDir, targetDir) {
  return markdown.replace(
    /\]\((?![a-z][a-z0-9+.-]*:|#|\/)([^)]+)\)/gi,
    (match, rawTarget) => {
      const [targetAndMaybeTitle, ...titleParts] = rawTarget.split(/\s+/);
      const [targetPath, hash = ''] = targetAndMaybeTitle.split('#');

      if (!targetPath || targetPath.startsWith('<')) {
        return match;
      }

      const absoluteTarget = path.resolve(sourceDir, targetPath);
      let relativeTarget = path.relative(targetDir, absoluteTarget);

      if (!relativeTarget.startsWith('.')) {
        relativeTarget = `./${relativeTarget}`;
      }

      relativeTarget = relativeTarget.split(path.sep).join('/');
      const title = titleParts.length > 0 ? ` ${titleParts.join(' ')}` : '';
      return `](${relativeTarget}${hash ? `#${hash}` : ''}${title})`;
    }
  );
}

function ensureClaudeSkillsSymlink() {
  const expectedTarget = path.relative(
    path.dirname(CLAUDE_SKILLS_PATH),
    CANONICAL_SKILLS_DIR
  );

  if (!fs.existsSync(CANONICAL_SKILLS_DIR)) {
    console.warn('⚠️  .agents/skills does not exist; skipping Claude symlink');
    return;
  }

  if (fs.existsSync(CLAUDE_SKILLS_PATH)) {
    const stat = fs.lstatSync(CLAUDE_SKILLS_PATH);

    if (!stat.isSymbolicLink()) {
      throw new Error('.claude/skills must be a symlink to ../.agents/skills');
    }

    const actualTarget = fs.readlinkSync(CLAUDE_SKILLS_PATH);
    if (actualTarget !== expectedTarget) {
      fs.unlinkSync(CLAUDE_SKILLS_PATH);
      fs.symlinkSync(expectedTarget, CLAUDE_SKILLS_PATH, 'dir');
    }
  } else {
    fs.symlinkSync(expectedTarget, CLAUDE_SKILLS_PATH, 'dir');
  }
}

/**
 * Build PLATFORM_REFERENCE.md from data/products.yml
 * This generates a reference document for AI agents to understand
 * the different InfluxDB versions and products
 */
async function buildPlatformReference() {
  const yaml = await import('js-yaml');

  // Paths
  const productsPath = path.join(process.cwd(), 'data', 'products.yml');
  const referencePath = path.join(process.cwd(), 'PLATFORM_REFERENCE.md');

  // Read and parse the products.yml file
  const productsContent = fs.readFileSync(productsPath, 'utf8');
  const products = yaml.load(productsContent);

  // Generate markdown content
  let content = [
    '<!-- This file is auto-generated from data/products.yml. Do not edit directly. -->',
    '',
    "<!-- Run 'npm run build:agent:instructions' to regenerate this file. -->",
    '',
    'Use the following information to help determine which InfluxDB version and',
    'product the user is asking about:',
    '',
    '',
  ].join('\n');

  // Define product order
  const productOrder = [
    'influxdb',
    'enterprise_influxdb',
    'influxdb_cloud',
    'influxdb3_cloud_serverless',
    'influxdb3_cloud_dedicated',
    'influxdb3_clustered',
    'influxdb3_core',
    'influxdb3_enterprise',
    'influxdb3_explorer',
    'telegraf',
    'chronograf',
    'kapacitor',
    'flux',
  ];

  // Process each product in order
  for (const productKey of productOrder) {
    const product = products[productKey];
    if (!product) continue;

    // Handle products with multiple versions (like influxdb with v1 and v2)
    if (product.versions && product.versions.length > 1) {
      // Generate entries for each version
      for (const version of product.versions) {
        const versionName =
          version === 'v2'
            ? `${product.name} OSS ${version}`
            : version === 'v1'
              ? `${product.name} OSS ${version}`
              : `${product.name} ${version}`;

        content += `${versionName}:\n\n`;

        // Documentation URL
        const docUrl = generateDocUrlForVersion(productKey, product, version);
        if (docUrl) {
          content += `- Documentation: <${docUrl}>\n`;
        }

        // Query languages
        if (product.detector_config?.query_languages) {
          const languages = Object.keys(
            product.detector_config.query_languages
          ).join(' and ');
          content += `- Query languages: ${languages}\n`;
        }

        // Clients/Tools
        const clients = generateClientsInfo(productKey);
        if (clients) {
          content += `- Clients: ${clients}\n`;
        }

        content += '\n';
      }
    } else {
      // Single version products
      content += `${product.name}:\n\n`;

      // Documentation URL
      const docUrl = generateDocUrl(productKey, product);
      if (docUrl) {
        content += `- Documentation: <${docUrl}>\n`;
      }

      // Query languages
      if (product.detector_config?.query_languages) {
        const languages = Object.keys(
          product.detector_config.query_languages
        ).join(' and ');
        content += `- Query languages: ${languages}\n`;
      }

      // Clients/Tools
      const clients = generateClientsInfo(productKey);
      if (clients) {
        content += `- Clients: ${clients}\n`;
      }

      content += '\n';
    }
  }

  content = content.replace(/\n+$/, '\n');

  // Write the file
  fs.writeFileSync(referencePath, content);

  const fileSize = fs.statSync(referencePath).size;
  const sizeInKB = (fileSize / 1024).toFixed(1);
  console.log(
    `✅ Generated platform reference at ${referencePath} (${sizeInKB}KB)`
  );
}

/**
 * Generate documentation URL for a product
 */
function generateDocUrl(productKey, product) {
  const baseUrl = 'https://docs.influxdata.com';

  switch (productKey) {
    case 'influxdb':
      return `${baseUrl}/influxdb/${product.latest}/`;
    case 'enterprise_influxdb':
      return `${baseUrl}/enterprise_influxdb/${product.latest}/`;
    case 'influxdb_cloud':
      return `${baseUrl}/influxdb/cloud/`;
    case 'influxdb3_cloud_serverless':
      return `${baseUrl}/influxdb3/cloud-serverless/`;
    case 'influxdb3_cloud_dedicated':
      return `${baseUrl}/influxdb3/cloud-dedicated/`;
    case 'influxdb3_clustered':
      return `${baseUrl}/influxdb3/clustered/`;
    case 'influxdb3_core':
      return `${baseUrl}/influxdb3/core/`;
    case 'influxdb3_enterprise':
      return `${baseUrl}/influxdb3/enterprise/`;
    case 'influxdb3_explorer':
      return `${baseUrl}/influxdb3/explorer/`;
    case 'telegraf':
      return `${baseUrl}/telegraf/${product.latest}/`;
    case 'chronograf':
      return `${baseUrl}/chronograf/${product.latest}/`;
    case 'kapacitor':
      return `${baseUrl}/kapacitor/${product.latest}/`;
    case 'flux':
      return `${baseUrl}/flux/${product.latest}/`;
    default:
      return null;
  }
}

/**
 * Generate documentation URL for a specific version of a product
 */
function generateDocUrlForVersion(productKey, product, version) {
  const baseUrl = 'https://docs.influxdata.com';

  switch (productKey) {
    case 'influxdb':
      return `${baseUrl}/influxdb/${version}/`;
    case 'enterprise_influxdb':
      return `${baseUrl}/enterprise_influxdb/${version}/`;
    default:
      return generateDocUrl(productKey, product);
  }
}

/**
 * Generate client/tool information for a product
 */
function generateClientsInfo(productKey) {
  const v3Products = [
    'influxdb3_core',
    'influxdb3_enterprise',
    'influxdb3_cloud_dedicated',
    'influxdb3_cloud_serverless',
    'influxdb3_clustered',
  ];

  if (productKey === 'influxdb3_core') {
    return 'Telegraf, influxdb3 CLI, v3 client libraries, InfluxDB 3 Explorer';
  } else if (productKey === 'influxdb3_enterprise') {
    return 'Telegraf, influxdb3 CLI, v3 client libraries, InfluxDB 3 Explorer';
  } else if (v3Products.includes(productKey)) {
    return 'Telegraf, influxctl CLI, v3 client libraries';
  } else if (
    productKey === 'influxdb' ||
    productKey === 'enterprise_influxdb'
  ) {
    return 'Telegraf, influx CLI, v1/v2 client libraries';
  } else if (productKey === 'influxdb_cloud') {
    return 'Telegraf, influx CLI, v2 client libraries';
  }

  return null;
}
