#!/usr/bin/env node

import { execSync } from 'child_process';
import { writeFileSync, mkdirSync, existsSync, readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Colors for console output
const colors = {
  red: '\x1b[0;31m',
  green: '\x1b[0;32m',
  yellow: '\x1b[0;33m',
  blue: '\x1b[0;34m',
  nc: '\x1b[0m', // No Color
};

// Default configuration
const DEFAULT_CONFIG = {
  outputFormat: 'standard', // 'standard' or 'core-enterprise'
  repositories: [
    {
      name: 'primary',
      path: null, // Will be set from command line
      label: 'primary',
    },
  ],
};

class ReleaseNotesGenerator {
  constructor(options = {}) {
    this.fromVersion = options.fromVersion || 'v3.1.0';
    this.toVersion = options.toVersion || 'v3.2.0';
    this.fetchCommits = options.fetchCommits !== false;
    this.pullCommits = options.pullCommits || false;
    this.config = options.config || DEFAULT_CONFIG;
    this.outputDir =
      options.outputDir || join(__dirname, '..', 'output', 'release-notes');
  }

  log(message, color = 'nc') {
    console.log(`${colors[color]}${message}${colors.nc}`);
  }

  // Validate git tag exists in repository
  validateGitTag(version, repoPath) {
    if (version === 'local') {
      return true; // Special case for development
    }

    if (!existsSync(repoPath)) {
      this.log(`Error: Repository not found: ${repoPath}`, 'red');
      return false;
    }

    try {
      const tags = execSync(`git -C "${repoPath}" tag --list`, {
        encoding: 'utf8',
      });
      if (!tags.split('\n').includes(version)) {
        this.log(
          `Error: Version tag '${version}' does not exist in repository ${repoPath}`,
          'red'
        );
        this.log('Available tags (most recent first):', 'yellow');
        const recentTags = execSync(
          `git -C "${repoPath}" tag --list --sort=-version:refname`,
          { encoding: 'utf8' }
        )
          .split('\n')
          .slice(0, 10)
          .filter((tag) => tag.trim())
          .map((tag) => `  ${tag}`)
          .join('\n');
        console.log(recentTags);
        return false;
      }
      return true;
    } catch (error) {
      this.log(`Error validating tags in ${repoPath}: ${error.message}`, 'red');
      return false;
    }
  }

  // Get commits from repository using subject line pattern
  getCommitsFromRepo(repoPath, pattern, format = '%h %s') {
    try {
      const output = execSync(
        `git -C "${repoPath}" log --format="${format}" "${this.fromVersion}..${this.toVersion}"`,
        { encoding: 'utf8' }
      );

      return output
        .split('\n')
        .filter((line) => line.match(new RegExp(pattern)))
        .filter((line) => line.trim());
    } catch {
      return [];
    }
  }

  // Get commits including merge commit bodies
  getCommitsWithBody(repoPath, pattern) {
    try {
      const output = execSync(
        `git -C "${repoPath}" log --format="%B" "${this.fromVersion}..${this.toVersion}"`,
        { encoding: 'utf8' }
      );

      // Split into lines and find lines that match the pattern
      const lines = output.split('\n');
      const matches = [];

      for (const line of lines) {
        const trimmedLine = line.trim();
        if (
          trimmedLine.startsWith(pattern) ||
          trimmedLine.startsWith('* ' + pattern) ||
          trimmedLine.startsWith('- ' + pattern)
        ) {
          // Remove the bullet point prefix if present
          const cleanLine = trimmedLine.replace(/^[*-]\s*/, '');
          if (cleanLine.length > pattern.length) {
            matches.push(cleanLine);
          }
        }
      }

      return matches;
    } catch {
      return [];
    }
  }

  // Extract PR number from commit message
  extractPrNumber(message) {
    const match = message.match(/#(\d+)/);
    return match ? match[1] : null;
  }

  // Get release date
  getReleaseDate(repoPath) {
    try {
      const output = execSync(
        `git -C "${repoPath}" log -1 --format=%ai "${this.toVersion}"`,
        { encoding: 'utf8' }
      );
      return output.split(' ')[0].trim();
    } catch {
      return new Date().toISOString().split('T')[0];
    }
  }

  // Fetch latest commits from repositories
  async fetchFromRepositories() {
    if (!this.fetchCommits) {
      this.log('Skipping fetch (using local commits only)', 'yellow');
      return;
    }

    const action = this.pullCommits ? 'Pulling' : 'Fetching';
    this.log(`${action} latest commits from all repositories...`, 'yellow');

    if (this.pullCommits) {
      this.log('Warning: This will modify your working directories!', 'red');
    }

    for (const repo of this.config.repositories) {
      if (!existsSync(repo.path)) {
        this.log(`✗ Repository not found: ${repo.path}`, 'red');
        continue;
      }

      const repoName = repo.name || repo.path.split('/').pop();

      try {
        if (this.pullCommits) {
          this.log(`  Pulling changes in ${repoName}...`);
          execSync(`git -C "${repo.path}" pull origin`, { stdio: 'pipe' });
          this.log(`    ✓ Successfully pulled changes in ${repoName}`, 'green');
        } else {
          this.log(`  Fetching from ${repoName}...`);
          execSync(`git -C "${repo.path}" fetch origin`, { stdio: 'pipe' });
          this.log(`    ✓ Successfully fetched from ${repoName}`, 'green');
        }
      } catch {
        this.log(
          `    ✗ Failed to ${this.pullCommits ? 'pull' : 'fetch'} from ${repoName}`,
          'red'
        );
      }
    }
  }

  // Collect commits by category from all repositories
  collectCommits() {
    this.log('\nAnalyzing commits across all repositories...', 'yellow');

    const results = {
      features: [],
      fixes: [],
      breaking: [],
      perf: [],
      api: [],
    };

    for (const repo of this.config.repositories) {
      if (!existsSync(repo.path)) {
        continue;
      }

      const repoLabel = repo.label || repo.name || repo.path.split('/').pop();
      this.log(`  Analyzing ${repoLabel}...`);

      // Features - check both commit subjects and merge commit bodies
      const featuresSubject = this.getCommitsFromRepo(
        repo.path,
        '^[a-f0-9]+ feat:'
      ).map((line) => line.replace(/^[a-f0-9]* feat: /, `- [${repoLabel}] `));

      const featuresBody = this.getCommitsWithBody(repo.path, 'feat:').map(
        (line) => `- [${repoLabel}] ${line}`
      );

      results.features.push(...featuresSubject, ...featuresBody);

      // Fixes - check both commit subjects and merge commit bodies
      const fixesSubject = this.getCommitsFromRepo(
        repo.path,
        '^[a-f0-9]+ fix:'
      ).map((line) => line.replace(/^[a-f0-9]* fix: /, `- [${repoLabel}] `));

      const fixesBody = this.getCommitsWithBody(repo.path, 'fix:').map(
        (line) => `- [${repoLabel}] ${line}`
      );

      results.fixes.push(...fixesSubject, ...fixesBody);

      // Performance improvements
      const perfSubject = this.getCommitsFromRepo(
        repo.path,
        '^[a-f0-9]+ perf:'
      ).map((line) => line.replace(/^[a-f0-9]* perf: /, `- [${repoLabel}] `));

      const perfBody = this.getCommitsWithBody(repo.path, 'perf:').map(
        (line) => `- [${repoLabel}] ${line}`
      );

      results.perf.push(...perfSubject, ...perfBody);

      // Breaking changes
      const breaking = this.getCommitsFromRepo(
        repo.path,
        '^[a-f0-9]+ .*(BREAKING|breaking change)'
      ).map((line) => line.replace(/^[a-f0-9]* /, `- [${repoLabel}] `));

      results.breaking.push(...breaking);

      // API changes
      const api = this.getCommitsFromRepo(
        repo.path,
        '(api|endpoint|/write|/query|/ping|/health|/metrics|v1|v2|v3)'
      ).map((line) => line.replace(/^[a-f0-9]* /, `- [${repoLabel}] `));

      results.api.push(...api);
    }

    return results;
  }

  // Generate standard format release notes
  generateStandardFormat(commits, releaseDate) {
    const lines = [];

    lines.push(`## ${this.toVersion} {date="${releaseDate}"}`);
    lines.push('');
    lines.push('### Features');
    lines.push('');

    if (commits.features.length > 0) {
      commits.features.forEach((feature) => {
        const pr = this.extractPrNumber(feature);
        const cleanLine = feature.replace(/ \\(#\\d+\\)$/, '');
        if (pr) {
          lines.push(
            `${cleanLine} ([#${pr}](https://github.com/influxdata/influxdb/pull/${pr}))`
          );
        } else {
          lines.push(cleanLine);
        }
      });
    } else {
      lines.push('- No new features in this release');
    }

    lines.push('');
    lines.push('### Bug Fixes');
    lines.push('');

    if (commits.fixes.length > 0) {
      commits.fixes.forEach((fix) => {
        const pr = this.extractPrNumber(fix);
        const cleanLine = fix.replace(/ \\(#\\d+\\)$/, '');
        if (pr) {
          lines.push(
            `${cleanLine} ([#${pr}](https://github.com/influxdata/influxdb/pull/${pr}))`
          );
        } else {
          lines.push(cleanLine);
        }
      });
    } else {
      lines.push('- No bug fixes in this release');
    }

    // Add breaking changes if any
    if (commits.breaking.length > 0) {
      lines.push('');
      lines.push('### Breaking Changes');
      lines.push('');
      commits.breaking.forEach((change) => {
        const pr = this.extractPrNumber(change);
        const cleanLine = change.replace(/ \\(#\\d+\\)$/, '');
        if (pr) {
          lines.push(
            `${cleanLine} ([#${pr}](https://github.com/influxdata/influxdb/pull/${pr}))`
          );
        } else {
          lines.push(cleanLine);
        }
      });
    }

    // Add performance improvements if any
    if (commits.perf.length > 0) {
      lines.push('');
      lines.push('### Performance Improvements');
      lines.push('');
      commits.perf.forEach((perf) => {
        const pr = this.extractPrNumber(perf);
        const cleanLine = perf.replace(/ \\(#\\d+\\)$/, '');
        if (pr) {
          lines.push(
            `${cleanLine} ([#${pr}](https://github.com/influxdata/influxdb/pull/${pr}))`
          );
        } else {
          lines.push(cleanLine);
        }
      });
    }

    // Add HTTP API changes if any
    if (commits.api.length > 0) {
      lines.push('');
      lines.push('### HTTP API Changes');
      lines.push('');
      commits.api.forEach((api) => {
        const pr = this.extractPrNumber(api);
        const cleanLine = api.replace(/ \\(#\\d+\\)$/, '');
        if (pr) {
          lines.push(
            `${cleanLine} ([#${pr}](https://github.com/influxdata/influxdb/pull/${pr}))`
          );
        } else {
          lines.push(cleanLine);
        }
      });
    }

    // Add API analysis summary
    lines.push('');
    lines.push('### API Analysis Summary');
    lines.push('');
    lines.push(
      'The following endpoints may have been affected in this release:'
    );
    lines.push('- v1 API endpoints: `/write`, `/query`, `/ping`');
    lines.push('- v2 API endpoints: `/api/v2/write`, `/api/v2/query`');
    lines.push('- v3 API endpoints: `/api/v3/*`');
    lines.push('- System endpoints: `/health`, `/metrics`');
    lines.push('');
    lines.push(
      'Please review the commit details above and consult the API documentation for specific changes.'
    );
    lines.push('');

    return lines.join('\n');
  }

  // Generate Core/Enterprise format release notes
  generateCoreEnterpriseFormat(commits, releaseDate) {
    const lines = [];

    // Add template note
    lines.push('> [!Note]');
    lines.push('> #### InfluxDB 3 Core and Enterprise relationship');
    lines.push('>');
    lines.push('> InfluxDB 3 Enterprise is a superset of InfluxDB 3 Core.');
    lines.push(
      '> All updates to Core are automatically included in Enterprise.'
    );
    lines.push(
      '> The Enterprise sections below only list updates exclusive to Enterprise.'
    );
    lines.push('');
    lines.push(`## ${this.toVersion} {date="${releaseDate}"}`);
    lines.push('');

    // Separate commits by repository
    const coreCommits = {
      features: commits.features
        .filter((f) => f.includes('[influxdb]'))
        .map((f) => f.replace('- [influxdb] ', '- ')),
      fixes: commits.fixes
        .filter((f) => f.includes('[influxdb]'))
        .map((f) => f.replace('- [influxdb] ', '- ')),
      perf: commits.perf
        .filter((f) => f.includes('[influxdb]'))
        .map((f) => f.replace('- [influxdb] ', '- ')),
    };

    const enterpriseCommits = {
      features: commits.features
        .filter((f) => f.includes('[influxdb_pro]'))
        .map((f) => f.replace('- [influxdb_pro] ', '- ')),
      fixes: commits.fixes
        .filter((f) => f.includes('[influxdb_pro]'))
        .map((f) => f.replace('- [influxdb_pro] ', '- ')),
      perf: commits.perf
        .filter((f) => f.includes('[influxdb_pro]'))
        .map((f) => f.replace('- [influxdb_pro] ', '- ')),
    };

    // Core section
    lines.push('### Core');
    lines.push('');
    lines.push('#### Features');
    lines.push('');

    if (coreCommits.features.length > 0) {
      coreCommits.features.forEach((feature) => {
        const pr = this.extractPrNumber(feature);
        const cleanLine = feature.replace(/ \\(#\\d+\\)$/, '');
        if (pr) {
          lines.push(
            `${cleanLine} ([#${pr}](https://github.com/influxdata/influxdb/pull/${pr}))`
          );
        } else {
          lines.push(cleanLine);
        }
      });
    } else {
      lines.push('- No new features in this release');
    }

    lines.push('');
    lines.push('#### Bug Fixes');
    lines.push('');

    if (coreCommits.fixes.length > 0) {
      coreCommits.fixes.forEach((fix) => {
        const pr = this.extractPrNumber(fix);
        const cleanLine = fix.replace(/ \\(#\\d+\\)$/, '');
        if (pr) {
          lines.push(
            `${cleanLine} ([#${pr}](https://github.com/influxdata/influxdb/pull/${pr}))`
          );
        } else {
          lines.push(cleanLine);
        }
      });
    } else {
      lines.push('- No bug fixes in this release');
    }

    // Core performance improvements if any
    if (coreCommits.perf.length > 0) {
      lines.push('');
      lines.push('#### Performance Improvements');
      lines.push('');
      coreCommits.perf.forEach((perf) => {
        const pr = this.extractPrNumber(perf);
        const cleanLine = perf.replace(/ \\(#\\d+\\)$/, '');
        if (pr) {
          lines.push(
            `${cleanLine} ([#${pr}](https://github.com/influxdata/influxdb/pull/${pr}))`
          );
        } else {
          lines.push(cleanLine);
        }
      });
    }

    // Enterprise section
    lines.push('');
    lines.push('### Enterprise');
    lines.push('');
    lines.push(
      'All Core updates are included in Enterprise. Additional Enterprise-specific features and fixes:'
    );
    lines.push('');

    let hasEnterpriseChanges = false;

    // Enterprise features
    if (enterpriseCommits.features.length > 0) {
      hasEnterpriseChanges = true;
      lines.push('#### Features');
      lines.push('');
      enterpriseCommits.features.forEach((feature) => {
        const pr = this.extractPrNumber(feature);
        const cleanLine = feature.replace(/ \\(#\\d+\\)$/, '');
        if (pr) {
          lines.push(
            `${cleanLine} ([#${pr}](https://github.com/influxdata/influxdb/pull/${pr}))`
          );
        } else {
          lines.push(cleanLine);
        }
      });
      lines.push('');
    }

    // Enterprise fixes
    if (enterpriseCommits.fixes.length > 0) {
      hasEnterpriseChanges = true;
      lines.push('#### Bug Fixes');
      lines.push('');
      enterpriseCommits.fixes.forEach((fix) => {
        const pr = this.extractPrNumber(fix);
        const cleanLine = fix.replace(/ \\(#\\d+\\)$/, '');
        if (pr) {
          lines.push(
            `${cleanLine} ([#${pr}](https://github.com/influxdata/influxdb/pull/${pr}))`
          );
        } else {
          lines.push(cleanLine);
        }
      });
      lines.push('');
    }

    // Enterprise performance improvements
    if (enterpriseCommits.perf.length > 0) {
      hasEnterpriseChanges = true;
      lines.push('#### Performance Improvements');
      lines.push('');
      enterpriseCommits.perf.forEach((perf) => {
        const pr = this.extractPrNumber(perf);
        const cleanLine = perf.replace(/ \\(#\\d+\\)$/, '');
        if (pr) {
          lines.push(
            `${cleanLine} ([#${pr}](https://github.com/influxdata/influxdb/pull/${pr}))`
          );
        } else {
          lines.push(cleanLine);
        }
      });
      lines.push('');
    }

    // No Enterprise-specific changes message
    if (!hasEnterpriseChanges) {
      lines.push('#### No Enterprise-specific changes');
      lines.push('');
      lines.push(
        'All changes in this release are included in Core and automatically available in Enterprise.'
      );
      lines.push('');
    }

    // Add common sections (breaking changes, API changes, etc.)
    this.addCommonSections(lines, commits);

    return lines.join('\n');
  }

  // Add common sections (breaking changes, API analysis)
  addCommonSections(lines, commits) {
    // Add breaking changes if any
    if (commits.breaking.length > 0) {
      lines.push('### Breaking Changes');
      lines.push('');
      commits.breaking.forEach((change) => {
        const pr = this.extractPrNumber(change);
        const cleanLine = change.replace(/ \\(#\\d+\\)$/, '');
        if (pr) {
          lines.push(
            `${cleanLine} ([#${pr}](https://github.com/influxdata/influxdb/pull/${pr}))`
          );
        } else {
          lines.push(cleanLine);
        }
      });
      lines.push('');
    }

    // Add HTTP API changes if any
    if (commits.api.length > 0) {
      lines.push('### HTTP API Changes');
      lines.push('');
      commits.api.forEach((api) => {
        const pr = this.extractPrNumber(api);
        const cleanLine = api.replace(/ \\(#\\d+\\)$/, '');
        if (pr) {
          lines.push(
            `${cleanLine} ([#${pr}](https://github.com/influxdata/influxdb/pull/${pr}))`
          );
        } else {
          lines.push(cleanLine);
        }
      });
      lines.push('');
    }

    // Add API analysis summary
    lines.push('### API Analysis Summary');
    lines.push('');
    lines.push(
      'The following endpoints may have been affected in this release:'
    );
    lines.push('- v1 API endpoints: `/write`, `/query`, `/ping`');
    lines.push('- v2 API endpoints: `/api/v2/write`, `/api/v2/query`');
    lines.push('- v3 API endpoints: `/api/v3/*`');
    lines.push('- System endpoints: `/health`, `/metrics`');
    lines.push('');
    lines.push(
      'Please review the commit details above and consult the API documentation for specific changes.'
    );
    lines.push('');
  }

  // Generate release notes
  async generate() {
    this.log('Validating version tags...', 'yellow');

    // Validate tags in primary repository
    const primaryRepo = this.config.repositories[0];
    if (
      !this.validateGitTag(this.fromVersion, primaryRepo.path) ||
      !this.validateGitTag(this.toVersion, primaryRepo.path)
    ) {
      process.exit(1);
    }

    this.log('✓ Version tags validated successfully', 'green');
    this.log('');

    this.log(`Generating release notes for ${this.toVersion}`, 'blue');
    this.log(`Primary Repository: ${primaryRepo.path}`);

    if (this.config.repositories.length > 1) {
      this.log('Additional Repositories:');
      this.config.repositories.slice(1).forEach((repo) => {
        this.log(`  - ${repo.path}`);
      });
    }

    this.log(`From: ${this.fromVersion} To: ${this.toVersion}\n`);

    // Get release date from primary repository
    const releaseDate = this.getReleaseDate(primaryRepo.path);
    this.log(`Release Date: ${releaseDate}\n`, 'green');

    // Fetch latest commits
    await this.fetchFromRepositories();

    // Collect commits
    const commits = this.collectCommits();

    // Generate output based on format
    let content;
    if (this.config.outputFormat === 'core-enterprise') {
      content = this.generateCoreEnterpriseFormat(commits, releaseDate);
    } else {
      content = this.generateStandardFormat(commits, releaseDate);
    }

    // Ensure output directory exists
    mkdirSync(this.outputDir, { recursive: true });

    // Write output file
    const outputFile = join(
      this.outputDir,
      `release-notes-${this.toVersion}.md`
    );
    writeFileSync(outputFile, content);

    this.log(`\nRelease notes generated in: ${outputFile}`, 'green');
    this.log(
      'Please review and edit the generated notes before adding to documentation.',
      'yellow'
    );

    // If running in GitHub Actions, also output the relative path
    if (process.env.GITHUB_WORKSPACE || process.env.GITHUB_ACTIONS) {
      const relativePath = outputFile.replace(
        `${process.env.GITHUB_WORKSPACE}/`,
        ''
      );
      this.log(`\nRelative path for GitHub Actions: ${relativePath}`, 'green');
    }
  }
}

// Parse command line arguments
function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    fetchCommits: true,
    pullCommits: false,
    config: { ...DEFAULT_CONFIG },
  };

  let i = 0;
  while (i < args.length) {
    switch (args[i]) {
      case '--no-fetch':
        options.fetchCommits = false;
        i++;
        break;
      case '--pull':
        options.pullCommits = true;
        options.fetchCommits = true;
        i++;
        break;
      case '--config':
        if (i + 1 >= args.length) {
          console.error('Error: --config requires a configuration file path');
          process.exit(1);
        }
        // Load configuration from JSON file
        try {
          const configPath = args[i + 1];
          const configData = JSON.parse(readFileSync(configPath, 'utf8'));
          options.config = { ...DEFAULT_CONFIG, ...configData };
        } catch (error) {
          console.error(`Error loading configuration: ${error.message}`);
          process.exit(1);
        }
        i += 2;
        break;
      case '--format':
        if (i + 1 >= args.length) {
          console.error(
            'Error: --format requires a format type (standard|core-enterprise)'
          );
          process.exit(1);
        }
        options.config.outputFormat = args[i + 1];
        i += 2;
        break;
      case '--help':
      case '-h':
        printUsage();
        process.exit(0);
        break;
      default:
        // Positional arguments: fromVersion toVersion primaryRepo [additionalRepos...]
        if (!options.fromVersion) {
          options.fromVersion = args[i];
        } else if (!options.toVersion) {
          options.toVersion = args[i];
        } else {
          // Repository paths
          if (!options.config.repositories[0].path) {
            options.config.repositories[0].path = args[i];
            options.config.repositories[0].name = args[i].split('/').pop();
            options.config.repositories[0].label =
              options.config.repositories[0].name;
          } else {
            // Additional repositories
            const repoName = args[i].split('/').pop();
            options.config.repositories.push({
              name: repoName,
              path: args[i],
              label: repoName,
            });
          }
        }
        i++;
        break;
    }
  }

  // Set defaults
  options.fromVersion = options.fromVersion || 'v3.1.0';
  options.toVersion = options.toVersion || 'v3.2.0';

  // Detect Core/Enterprise format if influxdb and influxdb_pro are both present
  if (
    options.config.repositories.some((r) => r.name === 'influxdb') &&
    options.config.repositories.some((r) => r.name === 'influxdb_pro')
  ) {
    options.config.outputFormat = 'core-enterprise';

    // Set proper labels for Core/Enterprise
    options.config.repositories.forEach((repo) => {
      if (repo.name === 'influxdb') {
        repo.label = 'influxdb';
      } else if (repo.name === 'influxdb_pro') {
        repo.label = 'influxdb_pro';
      }
    });
  }

  return options;
}

function printUsage() {
  console.log(`
Usage: node generate-release-notes.js [options] <from_version> <to_version> <primary_repo_path> [additional_repo_paths...]

Options:
  --no-fetch              Skip fetching latest commits from remote
  --pull                  Pull latest changes (implies fetch) - use with caution
  --config <file>         Load configuration from JSON file
  --format <type>         Output format: 'standard' or 'core-enterprise'
  -h, --help              Show this help message

Examples:
  node generate-release-notes.js v3.1.0 v3.2.0 /path/to/influxdb
  node generate-release-notes.js --no-fetch v3.1.0 v3.2.0 /path/to/influxdb
  node generate-release-notes.js --pull v3.1.0 v3.2.0 /path/to/influxdb /path/to/influxdb_pro
  node generate-release-notes.js --config config.json v3.1.0 v3.2.0
  node generate-release-notes.js --format core-enterprise v3.1.0 v3.2.0 /path/to/influxdb /path/to/influxdb_pro

Configuration file format (JSON):
{
  "outputFormat": "core-enterprise",
  "repositories": [
    {
      "name": "influxdb",
      "path": "/path/to/influxdb",
      "label": "Core"
    },
    {
      "name": "influxdb_pro", 
      "path": "/path/to/influxdb_pro",
      "label": "Enterprise"
    }
  ]
}
`);
}

// Main execution
async function main() {
  try {
    const options = parseArgs();
    const generator = new ReleaseNotesGenerator(options);
    await generator.generate();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { ReleaseNotesGenerator };
