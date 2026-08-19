#!/usr/bin/env node

/**
 * Script to generate agent instruction adapters for InfluxData documentation.
 */
import fs from 'fs';
import path from 'path';
import process from 'process';
import matter from 'gray-matter';
import yaml from 'js-yaml';
import { pathToFileURL } from 'url';

export {
  buildAgentInstructionAdapters,
  buildPlatformReference,
  ensureClaudeSkillsSymlink,
  MATTER_OPTIONS,
};

// gray-matter 4.0.3 binds its default YAML engine to the removed
// js-yaml 3 safeLoad/safeDump APIs. js-yaml 4 is safe by default, so point
// the engine at load/dump to stay compatible with the pinned js-yaml version.
const MATTER_OPTIONS = {
  engines: {
    yaml: {
      parse: (input) => yaml.load(input),
      stringify: (input) => yaml.dump(input),
    },
  },
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
    const parsed = matter.read(sourcePath, MATTER_OPTIONS);
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
 * This generates a compact product disambiguation reference for AI agents using
 * canonical product metadata only.
 */
async function buildPlatformReference() {
  const productsPath = path.join(PROJECT_ROOT, 'data', 'products.yml');
  const referencePath = path.join(PROJECT_ROOT, 'PLATFORM_REFERENCE.md');
  const products = yaml.load(fs.readFileSync(productsPath, 'utf8'));
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

  const lines = [
    '<!-- This file is auto-generated from data/products.yml. Do not edit directly. -->',
    '',
    "<!-- Run 'yarn build:agent:instructions' to regenerate this file. -->",
    '',
    'Use this compact product disambiguation reference to map user requests to',
    'canonical product names, content paths, and production documentation URLs.',
    '',
    'Production docs URL rule:',
    '',
    '- For each entry with a `Content path`, map it to',
    '  `https://docs.influxdata.com/<content-path>/`.',
    '- Treat `data/products.yml` as the canonical source of truth when you need',
    '  details not listed here.',
    '',
  ];

  for (const productKey of productOrder) {
    const product = products[productKey];
    if (!product) continue;

    if (product.versions && product.versions.length > 1) {
      for (const version of product.versions) {
        lines.push(...renderProductReferenceEntry(product, version));
      }
    } else {
      lines.push(...renderProductReferenceEntry(product));
    }
  }

  let content = `${lines.join('\n')}\n`;
  content = content.replace(/\n+$/, '\n');
  fs.writeFileSync(referencePath, content);

  const fileSize = fs.statSync(referencePath).size;
  const sizeInKB = (fileSize / 1024).toFixed(1);
  console.log(
    `✅ Generated platform reference at ${referencePath} (${sizeInKB}KB)`
  );
}

function renderProductReferenceEntry(product, version = null) {
  const lines = [];
  const displayName = getProductDisplayName(product, version);
  const aliases = getProductAliases(product, version);
  const contentPath = getContentPath(product, version);
  const queryLanguages = getQueryLanguages(product);
  const placeholderHost = product.placeholder_host;
  const characteristics = getCharacteristics(product);
  const urlHints = getDetectionUrlHints(product);
  const pingHeaders = getPingHeaders(product);

  lines.push(`${displayName}:`, '');

  if (aliases.length > 0) {
    lines.push(`- Aliases: ${aliases.join(', ')}`);
  }

  if (contentPath) {
    lines.push(`- Content path: \`${contentPath}\``);
    lines.push(
      `- Production docs URL: <${buildDocsUrlFromContentPath(contentPath)}>`
    );
  }

  if (queryLanguages.length > 0) {
    lines.push(`- Query languages: ${queryLanguages.join(', ')}`);
  }

  if (placeholderHost) {
    lines.push(`- Host hint: \`${placeholderHost}\``);
  }

  if (characteristics.length > 0) {
    lines.push(`- Characteristics: ${characteristics.join(', ')}`);
  }

  if (urlHints.length > 0) {
    lines.push(`- URL contains hints: ${urlHints.join(', ')}`);
  }

  if (pingHeaders.length > 0) {
    lines.push(`- Ping header hints: ${pingHeaders.join(', ')}`);
  }

  lines.push('');
  return lines;
}

function buildDocsUrlFromContentPath(contentPath) {
  const baseUrl = 'https://docs.influxdata.com';
  return `${baseUrl}/${contentPath.replace(/^\/+|\/+$/g, '')}/`;
}

function getProductDisplayName(product, version) {
  if (version && product[`name__${version}`]) {
    return product[`name__${version}`];
  }

  return product.name;
}

function getProductAliases(product, version) {
  const aliases = new Set();

  if (product.altname) {
    aliases.add(product.altname);
  }

  if (version && product.version_label) {
    aliases.add(product.version_label);
  }

  if (version) {
    aliases.add(version);
  }

  return [...aliases].filter(
    (alias) => alias && alias !== getProductDisplayName(product, version)
  );
}

function getContentPath(product, version) {
  if (!product.content_path) return null;

  if (typeof product.content_path === 'string') {
    return product.content_path;
  }

  if (version && product.content_path[version]) {
    return product.content_path[version];
  }

  return null;
}

function getQueryLanguages(product) {
  return Object.keys(product.detector_config?.query_languages || {});
}

function getCharacteristics(product) {
  const characteristics = product.detector_config?.characteristics;
  if (!Array.isArray(characteristics)) return [];

  if (characteristics.length === 1 && Array.isArray(characteristics[0])) {
    return characteristics[0];
  }

  return characteristics;
}

function getDetectionUrlHints(product) {
  const urlHints = product.detector_config?.detection?.url_contains;
  return Array.isArray(urlHints) ? urlHints : [];
}

function getPingHeaders(product) {
  const headers = product.detector_config?.detection?.ping_headers;
  if (!headers || typeof headers !== 'object') return [];

  // Wrap each header token in an inline code span. Values are regex
  // patterns (for example, `^3\.`); the backslash is meaningful regex
  // syntax, but in prose Markdown the remark formatter strips it as an
  // unnecessary escape. Inline code preserves the bytes verbatim.
  return Object.entries(headers).map(([name, value]) => `\`${name}=${value}\``);
}
