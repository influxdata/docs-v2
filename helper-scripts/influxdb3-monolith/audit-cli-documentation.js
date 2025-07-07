#!/usr/bin/env node

/**
 * Audit CLI documentation against current CLI help output
 * Usage: node audit-cli-documentation.js [core|enterprise|both] [version]
 * Example: node audit-cli-documentation.js core 3.2.0
 */

import { spawn } from 'child_process';
import { promises as fs } from 'fs';
import { homedir } from 'os';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import {
  validateVersionInputs,
  getRepositoryRoot,
} from '../common/validate-tags.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Color codes
const Colors = {
  RED: '\x1b[0;31m',
  GREEN: '\x1b[0;32m',
  YELLOW: '\x1b[1;33m',
  BLUE: '\x1b[0;34m',
  NC: '\x1b[0m', // No Color
};

class CLIDocAuditor {
  constructor(product = 'both', version = 'local') {
    this.product = product;
    this.version = version;
    this.outputDir = join(dirname(__dirname), 'output', 'cli-audit');

    // Token paths - check environment variables first (Docker Compose), then fall back to local files
    const coreTokenEnv = process.env.INFLUXDB3_CORE_TOKEN;
    const enterpriseTokenEnv = process.env.INFLUXDB3_ENTERPRISE_TOKEN;

    if (coreTokenEnv && this.fileExists(coreTokenEnv)) {
      // Running in Docker Compose with secrets
      this.coreTokenFile = coreTokenEnv;
      this.enterpriseTokenFile = enterpriseTokenEnv;
    } else {
      // Running locally
      this.coreTokenFile = join(homedir(), '.env.influxdb3-core-admin-token');
      this.enterpriseTokenFile = join(
        homedir(),
        '.env.influxdb3-enterprise-admin-token'
      );
    }

    // Commands to extract help for
    this.mainCommands = [
      'create',
      'delete',
      'disable',
      'enable',
      'query',
      'show',
      'test',
      'update',
      'write',
    ];
    this.subcommands = [
      'create database',
      'create token admin',
      'create token',
      'create trigger',
      'create last_cache',
      'create distinct_cache',
      'create table',
      'show databases',
      'show tokens',
      'show system',
      'delete database',
      'delete table',
      'delete trigger',
      'update database',
      'test wal_plugin',
      'test schedule_plugin',
    ];

    // Map for command tracking during option parsing
    this.commandOptionsMap = {};
  }

  async fileExists(path) {
    try {
      await fs.access(path);
      return true;
    } catch {
      return false;
    }
  }

  async ensureDir(dir) {
    await fs.mkdir(dir, { recursive: true });
  }

  async loadTokens() {
    let coreToken = null;
    let enterpriseToken = null;

    try {
      if (await this.fileExists(this.coreTokenFile)) {
        const stat = await fs.stat(this.coreTokenFile);
        if (stat.size > 0) {
          coreToken = (await fs.readFile(this.coreTokenFile, 'utf8')).trim();
        }
      }
    } catch {
      // Token file doesn't exist or can't be read
    }

    try {
      if (await this.fileExists(this.enterpriseTokenFile)) {
        const stat = await fs.stat(this.enterpriseTokenFile);
        if (stat.size > 0) {
          enterpriseToken = (
            await fs.readFile(this.enterpriseTokenFile, 'utf8')
          ).trim();
        }
      }
    } catch {
      // Token file doesn't exist or can't be read
    }

    return { coreToken, enterpriseToken };
  }

  runCommand(cmd, args = []) {
    return new Promise((resolve) => {
      const child = spawn(cmd, args, { encoding: 'utf8' });
      let stdout = '';
      let stderr = '';

      child.stdout.on('data', (data) => {
        stdout += data.toString();
      });

      child.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      child.on('close', (code) => {
        resolve({ code, stdout, stderr });
      });

      child.on('error', (err) => {
        resolve({ code: 1, stdout: '', stderr: err.message });
      });
    });
  }

  async extractCurrentCLI(product, outputFile) {
    process.stdout.write(
      `Extracting current CLI help from influxdb3-${product}...`
    );

    await this.loadTokens();

    if (this.version === 'local') {
      const containerName = `influxdb3-${product}`;

      // Check if container is running
      const { code, stdout } = await this.runCommand('docker', [
        'ps',
        '--format',
        '{{.Names}}',
      ]);
      if (code !== 0 || !stdout.includes(containerName)) {
        console.log(` ${Colors.RED}✗${Colors.NC}`);
        console.log(`Error: Container ${containerName} is not running.`);
        console.log(`Start it with: docker compose up -d influxdb3-${product}`);
        return false;
      }

      // Extract comprehensive help
      let fileContent = '';

      // Main help
      const mainHelp = await this.runCommand('docker', [
        'exec',
        containerName,
        'influxdb3',
        '--help',
      ]);
      fileContent += mainHelp.code === 0 ? mainHelp.stdout : mainHelp.stderr;

      // Extract all subcommand help
      for (const cmd of this.mainCommands) {
        fileContent += `\n\n===== influxdb3 ${cmd} --help =====\n`;
        const cmdHelp = await this.runCommand('docker', [
          'exec',
          containerName,
          'influxdb3',
          cmd,
          '--help',
        ]);
        fileContent += cmdHelp.code === 0 ? cmdHelp.stdout : cmdHelp.stderr;
      }

      // Extract detailed subcommand help
      for (const subcmd of this.subcommands) {
        fileContent += `\n\n===== influxdb3 ${subcmd} --help =====\n`;
        const cmdParts = [
          'exec',
          containerName,
          'influxdb3',
          ...subcmd.split(' '),
          '--help',
        ];
        const subcmdHelp = await this.runCommand('docker', cmdParts);
        fileContent +=
          subcmdHelp.code === 0 ? subcmdHelp.stdout : subcmdHelp.stderr;
      }

      await fs.writeFile(outputFile, fileContent);
      console.log(` ${Colors.GREEN}✓${Colors.NC}`);
    } else {
      // Use specific version image
      const image = `influxdb:${this.version}-${product}`;

      process.stdout.write(`Extracting CLI help from ${image}...`);

      // Pull image if needed
      const pullResult = await this.runCommand('docker', ['pull', image]);
      if (pullResult.code !== 0) {
        console.log(` ${Colors.RED}✗${Colors.NC}`);
        console.log(`Error: Failed to pull image ${image}`);
        return false;
      }

      // Extract help from specific version
      let fileContent = '';

      // Main help
      const mainHelp = await this.runCommand('docker', [
        'run',
        '--rm',
        image,
        'influxdb3',
        '--help',
      ]);
      fileContent += mainHelp.code === 0 ? mainHelp.stdout : mainHelp.stderr;

      // Extract subcommand help
      for (const cmd of this.mainCommands) {
        fileContent += `\n\n===== influxdb3 ${cmd} --help =====\n`;
        const cmdHelp = await this.runCommand('docker', [
          'run',
          '--rm',
          image,
          'influxdb3',
          cmd,
          '--help',
        ]);
        fileContent += cmdHelp.code === 0 ? cmdHelp.stdout : cmdHelp.stderr;
      }

      await fs.writeFile(outputFile, fileContent);
      console.log(` ${Colors.GREEN}✓${Colors.NC}`);
    }

    return true;
  }

  async parseCLIHelp(helpFile, parsedFile) {
    const content = await fs.readFile(helpFile, 'utf8');
    const lines = content.split('\n');

    let output = '# CLI Commands and Options\n\n';
    let currentCommand = '';
    let inOptions = false;

    for (const line of lines) {
      // Detect command headers
      if (line.startsWith('===== influxdb3') && line.endsWith('--help =====')) {
        currentCommand = line
          .replace('===== ', '')
          .replace(' --help =====', '')
          .trim();
        output += `## ${currentCommand}\n\n`;
        inOptions = false;
        // Initialize options list for this command
        this.commandOptionsMap[currentCommand] = [];
      }
      // Detect options sections
      else if (line.trim() === 'Options:') {
        output += '### Options:\n\n';
        inOptions = true;
      }
      // Parse option lines
      else if (inOptions && /^\s*-/.test(line)) {
        // Extract option and description
        const optionMatch = line.match(/--[a-z][a-z0-9-]*/);
        const shortMatch = line.match(/\s-[a-zA-Z],/);

        if (optionMatch) {
          const option = optionMatch[0];
          const shortOption = shortMatch
            ? shortMatch[0].replace(/[,\s]/g, '')
            : null;

          // Extract description by removing option parts
          let description = line.replace(/^\s*-[^\s]*\s*/, '');
          description = description.replace(/^\s*--[^\s]*\s*/, '').trim();

          if (shortOption) {
            output += `- \`${shortOption}, ${option}\`: ${description}\n`;
          } else {
            output += `- \`${option}\`: ${description}\n`;
          }

          // Store option with its command context
          if (currentCommand && option) {
            this.commandOptionsMap[currentCommand].push(option);
          }
        }
      }
      // Reset options flag for new sections
      else if (/^[A-Z][a-z]+:$/.test(line.trim())) {
        inOptions = false;
      }
    }

    await fs.writeFile(parsedFile, output);
  }

  findDocsPath(product) {
    if (product === 'core') {
      return 'content/influxdb3/core/reference/cli/influxdb3';
    } else if (product === 'enterprise') {
      return 'content/influxdb3/enterprise/reference/cli/influxdb3';
    }
    return '';
  }

  async extractCommandHelp(content, command) {
    // Find the section for this specific command in the CLI help
    const lines = content.split('\n');
    let inCommand = false;
    let helpText = [];
    const commandHeader = `===== influxdb3 ${command} --help =====`;

    for (let i = 0; i < lines.length; i++) {
      if (lines[i] === commandHeader) {
        inCommand = true;
        continue;
      }
      if (inCommand && lines[i].startsWith('===== influxdb3')) {
        break;
      }
      if (inCommand) {
        helpText.push(lines[i]);
      }
    }

    return helpText.join('\n').trim();
  }

  async generateDocumentationTemplate(command, helpText) {
    // Parse the help text to extract description and options
    const lines = helpText.split('\n');
    let description = '';
    let usage = '';
    let options = [];
    let inOptions = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      if (i === 0 && !line.startsWith('Usage:') && line.trim()) {
        description = line.trim();
      }
      if (line.startsWith('Usage:')) {
        usage = line.replace('Usage:', '').trim();
      }
      if (line.trim() === 'Options:') {
        inOptions = true;
        continue;
      }
      if (inOptions && /^\s*-/.test(line)) {
        const optionMatch = line.match(/--([a-z][a-z0-9-]*)/);
        const shortMatch = line.match(/\s-([a-zA-Z]),/);
        if (optionMatch) {
          const optionName = optionMatch[1];
          const shortOption = shortMatch ? shortMatch[1] : null;
          let optionDesc = line
            .replace(/^\s*-[^\s]*\s*/, '')
            .replace(/^\s*--[^\s]*\s*/, '')
            .trim();

          options.push({
            name: optionName,
            short: shortOption,
            description: optionDesc,
          });
        }
      }
    }

    // Generate markdown template
    let template = `---
title: influxdb3 ${command}
description: >
  The \`influxdb3 ${command}\` command ${description.toLowerCase()}.
influxdb3/core/tags: [cli]
menu:
  influxdb3_core_reference:
    parent: influxdb3 cli
weight: 201
---

# influxdb3 ${command}

${description}

## Usage

\`\`\`bash
${usage || `influxdb3 ${command} [OPTIONS]`}
\`\`\`

`;

    if (options.length > 0) {
      template += `## Options

| Option | Description |
|--------|-------------|
`;

      for (const opt of options) {
        const optionDisplay = opt.short
          ? `\`-${opt.short}\`, \`--${opt.name}\``
          : `\`--${opt.name}\``;
        template += `| ${optionDisplay} | ${opt.description} |\n`;
      }
    }

    template += `
## Examples

### Example 1: Basic usage

{{% code-placeholders "PLACEHOLDER1|PLACEHOLDER2" %}}
\`\`\`bash
influxdb3 ${command} --example PLACEHOLDER1
\`\`\`
{{% /code-placeholders %}}

Replace the following:

- {{% code-placeholder-key %}}\`PLACEHOLDER1\`{{% /code-placeholder-key %}}: Description of placeholder
`;

    return template;
  }

  async extractFrontmatter(content) {
    const lines = content.split('\n');
    if (lines[0] !== '---') return { frontmatter: null, content };

    const frontmatterLines = [];
    let i = 1;
    while (i < lines.length && lines[i] !== '---') {
      frontmatterLines.push(lines[i]);
      i++;
    }

    if (i >= lines.length) return { frontmatter: null, content };

    const frontmatterText = frontmatterLines.join('\n');
    const remainingContent = lines.slice(i + 1).join('\n');

    return { frontmatter: frontmatterText, content: remainingContent };
  }

  async getActualContentPath(filePath) {
    // Get the actual content path, resolving source fields
    try {
      const content = await fs.readFile(filePath, 'utf8');
      const { frontmatter } = await this.extractFrontmatter(content);

      if (frontmatter) {
        const sourceMatch = frontmatter.match(/^source:\s*(.+)$/m);
        if (sourceMatch) {
          let sourcePath = sourceMatch[1].trim();
          // Handle relative paths from project root
          if (sourcePath.startsWith('/shared/')) {
            sourcePath = `content${sourcePath}`;
          }
          return sourcePath;
        }
      }
      return null; // No source field found
    } catch {
      return null;
    }
  }

  async parseDocumentedOptions(filePath) {
    // Parse a documentation file to extract all documented options
    try {
      const content = await fs.readFile(filePath, 'utf8');
      const options = [];

      // Look for options in various patterns:
      // 1. Markdown tables with option columns
      // 2. Option lists with backticks
      // 3. Code examples with --option flags

      // Pattern 1: Markdown tables (| Option | Description |)
      const tableMatches = content.match(/\|\s*`?--[a-z][a-z0-9-]*`?\s*\|/gi);
      if (tableMatches) {
        for (const match of tableMatches) {
          const option = match.match(/--[a-z][a-z0-9-]*/i);
          if (option) {
            options.push(option[0]);
          }
        }
      }

      // Pattern 2: Backtick-enclosed options in text
      const backtickMatches = content.match(/`--[a-z][a-z0-9-]*`/gi);
      if (backtickMatches) {
        for (const match of backtickMatches) {
          const option = match.replace(/`/g, '');
          options.push(option);
        }
      }

      // Pattern 3: Options in code blocks
      const codeBlockMatches = content.match(/```[\s\S]*?```/g);
      if (codeBlockMatches) {
        for (const block of codeBlockMatches) {
          const blockOptions = block.match(/--[a-z][a-z0-9-]*/gi);
          if (blockOptions) {
            options.push(...blockOptions);
          }
        }
      }

      // Pattern 4: Environment variable mappings (INFLUXDB3_* to --option)
      const envMatches = content.match(
        /\|\s*`INFLUXDB3_[^`]*`\s*\|\s*`--[a-z][a-z0-9-]*`\s*\|/gi
      );
      if (envMatches) {
        for (const match of envMatches) {
          const option = match.match(/--[a-z][a-z0-9-]*/);
          if (option) {
            options.push(option[0]);
          }
        }
      }

      // Remove duplicates and return sorted
      return [...new Set(options)].sort();
    } catch {
      return [];
    }
  }

  async auditDocs(product, cliFile, auditFile) {
    const docsPath = this.findDocsPath(product);
    const sharedPath = 'content/shared/influxdb3-cli';
    const patchDir = join(this.outputDir, 'patches', product);
    await this.ensureDir(patchDir);

    let output = `# CLI Documentation Audit - ${product}\n`;
    output += `Generated: ${new Date().toISOString()}\n\n`;

    // GitHub base URL for edit links
    const githubBase = 'https://github.com/influxdata/docs-v2/edit/master';
    const githubNewBase = 'https://github.com/influxdata/docs-v2/new/master';

    // VSCode links for local editing
    const vscodeBase = 'vscode://file';
    const projectRoot = join(__dirname, '..', '..');

    // Check for missing documentation
    output += '## Missing Documentation\n\n';

    let missingCount = 0;
    const missingDocs = [];

    // Map commands to expected documentation files
    const commandToFile = {
      'create database': 'create/database.md',
      'create token': 'create/token/_index.md',
      'create token admin': 'create/token/admin.md',
      'create trigger': 'create/trigger.md',
      'create table': 'create/table.md',
      'create last_cache': 'create/last_cache.md',
      'create distinct_cache': 'create/distinct_cache.md',
      'show databases': 'show/databases.md',
      'show tokens': 'show/tokens.md',
      'delete database': 'delete/database.md',
      'delete table': 'delete/table.md',
      query: 'query.md',
      write: 'write.md',
    };

    // Extract commands from CLI help
    const content = await fs.readFile(cliFile, 'utf8');
    const lines = content.split('\n');

    for (const line of lines) {
      if (line.startsWith('===== influxdb3') && line.endsWith('--help =====')) {
        const command = line
          .replace('===== influxdb3 ', '')
          .replace(' --help =====', '');

        if (commandToFile[command]) {
          const expectedFile = commandToFile[command];
          const productFile = join(docsPath, expectedFile);
          const sharedFile = join(sharedPath, expectedFile);

          const productExists = await this.fileExists(productFile);
          const sharedExists = await this.fileExists(sharedFile);

          let needsContent = false;
          let targetPath = null;
          let stubPath = null;

          if (!productExists && !sharedExists) {
            // Completely missing
            needsContent = true;
            targetPath = productFile;
          } else if (productExists) {
            // Check if it has a source field pointing to missing content
            const actualPath = await this.getActualContentPath(productFile);
            if (actualPath && !(await this.fileExists(actualPath))) {
              needsContent = true;
              targetPath = actualPath;
              stubPath = productFile;
            }
          } else if (sharedExists) {
            // Shared file exists, check if it has content
            const actualPath = await this.getActualContentPath(sharedFile);
            if (actualPath && !(await this.fileExists(actualPath))) {
              needsContent = true;
              targetPath = actualPath;
              stubPath = sharedFile;
            }
          }

          if (needsContent && targetPath) {
            const githubNewUrl = `${githubNewBase}/${targetPath}`;
            const localPath = join(projectRoot, targetPath);

            output += `- **Missing**: Documentation for \`influxdb3 ${command}\`\n`;
            if (stubPath) {
              output += `  - Stub exists at: \`${stubPath}\`\n`;
              output += `  - Content needed at: \`${targetPath}\`\n`;
            } else {
              output += `  - Expected: \`${targetPath}\` or \`${sharedFile}\`\n`;
            }
            output += `  - [Create on GitHub](${githubNewUrl})\n`;
            output += `  - Local: \`${localPath}\`\n`;

            // Generate documentation template
            const helpText = await this.extractCommandHelp(content, command);
            const docTemplate = await this.generateDocumentationTemplate(
              command,
              helpText
            );

            // Save patch file
            const patchFileName = `${command.replace(/ /g, '-')}.md`;
            const patchFile = join(patchDir, patchFileName);
            await fs.writeFile(patchFile, docTemplate);

            output += `  - **Template generated**: \`${patchFile}\`\n`;

            missingDocs.push({ command, file: targetPath, patchFile });
            missingCount++;
          }
        }
      }
    }

    if (missingCount === 0) {
      output += 'No missing documentation files detected.\n';
    } else {
      output += '\n### Quick Actions\n\n';
      output +=
        'Copy and paste these commands to create missing documentation:\n\n';
      output += '```bash\n';
      for (const doc of missingDocs) {
        const relativePatch = join(
          'helper-scripts/output/cli-audit/patches',
          product,
          `${doc.command.replace(/ /g, '-')}.md`
        );
        output += `# Create ${doc.command} documentation\n`;
        output += `mkdir -p $(dirname ${doc.file})\n`;
        output += `cp ${relativePatch} ${doc.file}\n\n`;
      }
      output += '```\n';
    }

    output += '\n';

    // Check for outdated options in existing docs
    output += '## Existing Documentation Review\n\n';

    // Parse CLI help first to populate commandOptionsMap
    const parsedFile = join(
      this.outputDir,
      `parsed-cli-${product}-${this.version}.md`
    );
    await this.parseCLIHelp(cliFile, parsedFile);

    // For each command, check if documentation exists and compare content
    const existingDocs = [];
    for (const [command, expectedFile] of Object.entries(commandToFile)) {
      const productFile = join(docsPath, expectedFile);
      const sharedFile = join(sharedPath, expectedFile);

      let docFile = null;
      let actualContentFile = null;

      // Find the documentation file
      if (await this.fileExists(productFile)) {
        docFile = productFile;
        // Check if it's a stub with source field
        const actualPath = await this.getActualContentPath(productFile);
        actualContentFile = actualPath
          ? join(projectRoot, actualPath)
          : join(projectRoot, productFile);
      } else if (await this.fileExists(sharedFile)) {
        docFile = sharedFile;
        actualContentFile = join(projectRoot, sharedFile);
      }

      if (docFile && (await this.fileExists(actualContentFile))) {
        const githubEditUrl = `${githubBase}/${docFile}`;
        const localPath = join(projectRoot, docFile);
        const vscodeUrl = `${vscodeBase}/${localPath}`;

        // Get CLI options for this command
        const cliOptions = this.commandOptionsMap[`influxdb3 ${command}`] || [];

        // Parse documentation content to find documented options
        const documentedOptions =
          await this.parseDocumentedOptions(actualContentFile);

        // Find missing options (in CLI but not in docs)
        const missingOptions = cliOptions.filter(
          (opt) => !documentedOptions.includes(opt)
        );

        // Find extra options (in docs but not in CLI)
        const extraOptions = documentedOptions.filter(
          (opt) => !cliOptions.includes(opt)
        );

        existingDocs.push({
          command,
          file: docFile,
          actualContentFile: actualContentFile.replace(
            join(projectRoot, ''),
            ''
          ),
          githubUrl: githubEditUrl,
          localPath,
          vscodeUrl,
          cliOptions,
          documentedOptions,
          missingOptions,
          extraOptions,
        });
      }
    }

    if (existingDocs.length > 0) {
      output += 'Review these existing documentation files for accuracy:\n\n';

      for (const doc of existingDocs) {
        output += `### \`influxdb3 ${doc.command}\`\n`;
        output += `- **File**: \`${doc.file}\`\n`;
        if (doc.actualContentFile !== doc.file) {
          output += `- **Content**: \`${doc.actualContentFile}\`\n`;
        }
        output += `- [Edit on GitHub](${doc.githubUrl})\n`;
        output += `- [Open in VS Code](${doc.vscodeUrl})\n`;
        output += `- **Local**: \`${doc.localPath}\`\n`;

        // Show option analysis
        if (doc.missingOptions.length > 0) {
          output += `- **⚠️ Missing from docs** (${doc.missingOptions.length} options):\n`;
          for (const option of doc.missingOptions.sort()) {
            output += `  - \`${option}\`\n`;
          }
        }

        if (doc.extraOptions.length > 0) {
          output += `- **ℹ️ Documented but not in CLI** (${doc.extraOptions.length} options):\n`;
          for (const option of doc.extraOptions.sort()) {
            output += `  - \`${option}\`\n`;
          }
        }

        if (doc.missingOptions.length === 0 && doc.extraOptions.length === 0) {
          output += `- **✅ Options match** (${doc.cliOptions.length} options)\n`;
        }

        if (doc.cliOptions.length > 0) {
          output += `- **All CLI Options** (${doc.cliOptions.length}):\n`;
          const uniqueOptions = [...new Set(doc.cliOptions)].sort();
          for (const option of uniqueOptions) {
            const status = doc.missingOptions.includes(option) ? '❌' : '✅';
            output += `  - ${status} \`${option}\`\n`;
          }
        }
        output += '\n';
      }
    }

    output += '\n## Summary\n';
    output += `- Missing documentation files: ${missingCount}\n`;
    output += `- Existing documentation files: ${existingDocs.length}\n`;
    output += `- Generated templates: ${missingCount}\n`;
    output += '- Options are grouped by command for easier review\n\n';

    output += '## Automation Suggestions\n\n';
    output +=
      '1. **Use generated templates**: Check the `patches` directory for pre-filled documentation templates\n';
    output +=
      '2. **Batch creation**: Use the shell commands above to quickly create all missing files\n';
    output +=
      '3. **CI Integration**: Add this audit to your CI pipeline to catch missing docs early\n';
    output +=
      '4. **Auto-PR**: Create a GitHub Action that runs this audit and opens PRs for missing docs\n\n';

    await fs.writeFile(auditFile, output);
    console.log(`📄 Audit complete: ${auditFile}`);

    if (missingCount > 0) {
      console.log(
        `📝 Generated ${missingCount} documentation templates in: ${patchDir}`
      );
    }
  }

  async run() {
    console.log(
      `${Colors.BLUE}🔍 InfluxDB 3 CLI Documentation Audit${Colors.NC}`
    );
    console.log('=======================================');
    console.log(`Product: ${this.product}`);
    console.log(`Version: ${this.version}`);
    console.log();

    // Ensure output directory exists
    await this.ensureDir(this.outputDir);

    if (this.product === 'core') {
      const cliFile = join(
        this.outputDir,
        `current-cli-core-${this.version}.txt`
      );
      const auditFile = join(
        this.outputDir,
        `documentation-audit-core-${this.version}.md`
      );

      if (await this.extractCurrentCLI('core', cliFile)) {
        await this.auditDocs('core', cliFile, auditFile);
      }
    } else if (this.product === 'enterprise') {
      const cliFile = join(
        this.outputDir,
        `current-cli-enterprise-${this.version}.txt`
      );
      const auditFile = join(
        this.outputDir,
        `documentation-audit-enterprise-${this.version}.md`
      );

      if (await this.extractCurrentCLI('enterprise', cliFile)) {
        await this.auditDocs('enterprise', cliFile, auditFile);
      }
    } else if (this.product === 'both') {
      // Core
      const cliFileCore = join(
        this.outputDir,
        `current-cli-core-${this.version}.txt`
      );
      const auditFileCore = join(
        this.outputDir,
        `documentation-audit-core-${this.version}.md`
      );

      if (await this.extractCurrentCLI('core', cliFileCore)) {
        await this.auditDocs('core', cliFileCore, auditFileCore);
      }

      // Enterprise
      const cliFileEnt = join(
        this.outputDir,
        `current-cli-enterprise-${this.version}.txt`
      );
      const auditFileEnt = join(
        this.outputDir,
        `documentation-audit-enterprise-${this.version}.md`
      );

      if (await this.extractCurrentCLI('enterprise', cliFileEnt)) {
        await this.auditDocs('enterprise', cliFileEnt, auditFileEnt);
      }
    } else {
      console.error(`Error: Invalid product '${this.product}'`);
      console.error(
        'Usage: node audit-cli-documentation.js [core|enterprise|both] [version]'
      );
      process.exit(1);
    }

    console.log();
    console.log(
      `${Colors.GREEN}✅ CLI documentation audit complete!${Colors.NC}`
    );
    console.log();
    console.log('Next steps:');
    console.log(`1. Review the audit reports in: ${this.outputDir}`);
    console.log('2. Update missing documentation files');
    console.log('3. Verify options match current CLI behavior');
    console.log('4. Update examples and usage patterns');
  }
}

// Main execution
async function main() {
  const args = process.argv.slice(2);
  const product = args[0] || 'both';
  const version = args[1] || 'local';

  // Validate product
  if (!['core', 'enterprise', 'both'].includes(product)) {
    console.error(`Error: Invalid product '${product}'`);
    console.error(
      'Usage: node audit-cli-documentation.js [core|enterprise|both] [version]'
    );
    console.error('Example: node audit-cli-documentation.js core 3.2.0');
    process.exit(1);
  }

  // Validate version tag
  try {
    const repoRoot = await getRepositoryRoot();
    await validateVersionInputs(version, null, repoRoot);
  } catch (error) {
    console.error(`Version validation failed: ${error.message}`);
    process.exit(1);
  }

  const auditor = new CLIDocAuditor(product, version);
  await auditor.run();
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((err) => {
    console.error('Error:', err);
    process.exit(1);
  });
}

export { CLIDocAuditor };
