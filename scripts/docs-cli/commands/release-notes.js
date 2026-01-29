#!/usr/bin/env node

import { execSync } from 'child_process';
import { writeFileSync, mkdirSync, existsSync, readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { getConfig, hasEnterpriseAccess } from '../lib/config-loader.js';

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
  outputFormat: 'integrated', // 'integrated' or 'separated'
  primaryRepo: null, // Index or name of primary repository (for separated format)
  repositories: [
    {
      name: 'primary',
      path: null, // Will be set from command line
      label: 'primary',
      includePrLinks: true, // Default to include PR links
    },
  ],
  // Template for separated format
  separatedTemplate: {
    header: null, // Optional header text/markdown
    primaryLabel: 'Primary', // Label for primary section
    secondaryLabel: 'Additional Changes', // Label for secondary section
    secondaryIntro:
      'All primary updates are included. Additional repository-specific features and fixes:', // Intro text for secondary
  },
};

class ReleaseNotesGenerator {
  constructor(options = {}) {
    this.fromVersion = options.fromVersion || 'v3.1.0';
    this.toVersion = options.toVersion || 'v3.2.0';
    this.fetchCommits = options.fetchCommits !== false;
    this.pullCommits = options.pullCommits || false;
    this.includePrLinks = options.includePrLinks !== false; // Default to true
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

  // Configuration for enhancing commit messages
  getEnhancementConfig() {
    return {
      // Keywords to detect different areas of the codebase
      detectors: {
        auth: ['auth', 'token', 'permission', 'credential', 'security'],
        database: ['database', 'table', 'schema', 'catalog'],
        query: ['query', 'sql', 'select', 'influxql'],
        storage: ['storage', 'parquet', 'wal', 'object store'],
        license: ['license', 'licensing'],
        compaction: ['compact', 'compaction'],
        cache: ['cache', 'caching', 'lru'],
        metrics: ['metric', 'monitoring', 'telemetry'],
        retention: ['retention', 'ttl', 'expire'],
        api: ['api', 'endpoint', 'http', 'rest'],
        cli: ['cli', 'command', 'cmd', 'flag'],
      },

      // Feature type mappings
      featureTypes: {
        feat: {
          'auth+database': 'Enhanced database authorization',
          auth: 'Authentication and security',
          'database+retention': 'Database retention management',
          database: 'Database management',
          query: 'Query functionality',
          'storage+compaction': 'Storage compaction',
          storage: 'Storage engine',
          license: 'License management',
          cache: 'Caching system',
          metrics: 'Monitoring and metrics',
          cli: 'Command-line interface',
          api: 'API functionality',
        },
        fix: {
          auth: 'Authentication fix',
          database: 'Database reliability',
          query: 'Query processing',
          storage: 'Storage integrity',
          compaction: 'Compaction stability',
          cache: 'Cache reliability',
          license: 'License validation',
          cli: 'CLI reliability',
          api: 'API stability',
          _default: 'Bug fix',
        },
        perf: {
          query: 'Query performance',
          storage: 'Storage performance',
          compaction: 'Compaction performance',
          cache: 'Cache performance',
          _default: 'Performance improvement',
        },
      },

      // Feature name extraction patterns
      featurePatterns: {
        'delete|deletion': 'Data deletion',
        retention: 'Retention policies',
        'token|auth': 'Authentication',
        'database|db': 'Database management',
        table: 'Table operations',
        query: 'Query engine',
        cache: 'Caching',
        'metric|monitoring': 'Monitoring',
        license: 'Licensing',
        'compaction|compact': 'Storage compaction',
        wal: 'Write-ahead logging',
        parquet: 'Parquet storage',
        api: 'API',
        'cli|command': 'CLI',
      },
    };
  }

  // Detect areas based on keywords in the description
  detectAreas(description, files = []) {
    const config = this.getEnhancementConfig();
    const lowerDesc = description.toLowerCase();
    const detectedAreas = new Set();

    // Check description for keywords
    for (const [area, keywords] of Object.entries(config.detectors)) {
      if (keywords.some((keyword) => lowerDesc.includes(keyword))) {
        detectedAreas.add(area);
      }
    }

    // Check files for patterns
    const filePatterns = {
      auth: ['auth/', 'security/', 'token/'],
      database: ['database/', 'catalog/', 'schema/'],
      query: ['query/', 'sql/', 'influxql/'],
      storage: ['storage/', 'parquet/', 'wal/'],
      api: ['api/', 'http/', 'rest/'],
      cli: ['cli/', 'cmd/', 'command/'],
      metrics: ['metrics/', 'telemetry/', 'monitoring/'],
      cache: ['cache/', 'lru/'],
    };

    for (const [area, patterns] of Object.entries(filePatterns)) {
      if (
        files.some((file) => patterns.some((pattern) => file.includes(pattern)))
      ) {
        detectedAreas.add(area);
      }
    }

    return Array.from(detectedAreas);
  }

  // Get enhancement label based on type and detected areas
  getEnhancementLabel(type, areas) {
    const config = this.getEnhancementConfig();
    const typeConfig = config.featureTypes[type];

    if (!typeConfig) {
      return this.capitalizeFirst(type);
    }

    // Check for multi-area combinations first
    if (areas.length > 1) {
      const comboKey = areas.slice(0, 2).sort().join('+');
      if (typeConfig[comboKey]) {
        return typeConfig[comboKey];
      }
    }

    // Check for single area match
    if (areas.length > 0 && typeConfig[areas[0]]) {
      return typeConfig[areas[0]];
    }

    // Return default if available
    return typeConfig._default || this.capitalizeFirst(type);
  }

  // Extract feature name using patterns
  extractFeatureName(description) {
    const config = this.getEnhancementConfig();
    const words = description.toLowerCase();

    // Check each pattern
    for (const [pattern, featureName] of Object.entries(
      config.featurePatterns
    )) {
      const regex = new RegExp(`\\b(${pattern})\\b`, 'i');
      if (regex.test(words)) {
        return featureName;
      }
    }

    // Default to extracting the first significant word
    const significantWords = words
      .split(' ')
      .filter(
        (w) =>
          w.length > 3 &&
          ![
            'the',
            'and',
            'for',
            'with',
            'from',
            'into',
            'that',
            'this',
          ].includes(w)
      );

    return significantWords.length > 0
      ? this.capitalizeFirst(significantWords[0])
      : 'Feature';
  }

  // Get detailed information about a commit including files changed
  getCommitDetails(repoPath, commitHash) {
    try {
      const output = execSync(
        `git -C "${repoPath}" show --name-only --format="%s%n%b" ${commitHash}`,
        { encoding: 'utf8' }
      );

      const lines = output.split('\n');
      const subject = lines[0];
      let bodyLines = [];
      let fileLines = [];
      let inBody = true;

      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line === '') continue;

        // If we hit a file path, we're done with the body
        if (line.includes('/') || line.includes('.')) {
          inBody = false;
        }

        if (inBody) {
          bodyLines.push(line);
        } else {
          fileLines.push(line);
        }
      }

      return {
        subject,
        body: bodyLines.join('\n'),
        files: fileLines,
      };
    } catch {
      return null;
    }
  }

  // Enhance commit message with analysis of changes
  enhanceCommitMessage(
    repoPath,
    commitMessage,
    prNumber,
    includePrLinks = null
  ) {
    // Extract the basic semantic prefix
    const semanticMatch = commitMessage.match(
      /^(feat|fix|perf|refactor|style|test|docs|chore):\s*(.+)/
    );
    if (!semanticMatch) return commitMessage;

    const [, type, description] = semanticMatch;

    // Remove PR number from description if it's already there to avoid duplication
    const cleanDescription = description.replace(/\s*\(#\d+\)$/g, '').trim();

    // Get commit hash if available
    const hashMatch = commitMessage.match(/^([a-f0-9]+)\s+/);
    const commitHash = hashMatch ? hashMatch[1] : null;

    // Try to enhance based on the type and description
    const enhanced = this.generateEnhancedDescription(
      type,
      cleanDescription,
      repoPath,
      commitHash
    );

    // Use repository-specific setting if provided, otherwise use global setting
    const shouldIncludePrLinks =
      includePrLinks !== null ? includePrLinks : this.includePrLinks;

    // If we have a PR number and should include PR links, include it
    if (prNumber && shouldIncludePrLinks) {
      return `${enhanced} ([#${prNumber}](https://github.com/influxdata/influxdb/pull/${prNumber}))`;
    }

    return enhanced;
  }

  // Generate enhanced description based on commit type and analysis
  generateEnhancedDescription(type, description, repoPath, commitHash) {
    // Get additional context if commit hash is available
    let files = [];
    if (commitHash) {
      const details = this.getCommitDetails(repoPath, commitHash);
      if (details) {
        files = details.files;
      }
    }

    // Detect areas affected by this commit
    const areas = this.detectAreas(description, files);

    // Get the enhancement label
    const label = this.getEnhancementLabel(type, areas);

    // For features without detected areas, try to extract a feature name
    if (type === 'feat' && areas.length === 0) {
      const featureName = this.extractFeatureName(description);
      return `**${featureName}**: ${this.capitalizeFirst(description)}`;
    }

    return `**${label}**: ${this.capitalizeFirst(description)}`;
  }

  // Capitalize first letter of a string
  capitalizeFirst(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
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
      ).map((line) => {
        const prNumber = this.extractPrNumber(line);
        const enhanced = this.enhanceCommitMessage(
          repo.path,
          line.replace(/^[a-f0-9]* /, ''),
          prNumber,
          repo.includePrLinks
        );
        return `- [${repoLabel}] ${enhanced}`;
      });

      const featuresBody = this.getCommitsWithBody(repo.path, 'feat:').map(
        (line) => {
          const prNumber = this.extractPrNumber(line);
          const enhanced = this.enhanceCommitMessage(
            repo.path,
            line,
            prNumber,
            repo.includePrLinks
          );
          return `- [${repoLabel}] ${enhanced}`;
        }
      );

      results.features.push(...featuresSubject, ...featuresBody);

      // Fixes - check both commit subjects and merge commit bodies
      const fixesSubject = this.getCommitsFromRepo(
        repo.path,
        '^[a-f0-9]+ fix:'
      ).map((line) => {
        const prNumber = this.extractPrNumber(line);
        const enhanced = this.enhanceCommitMessage(
          repo.path,
          line.replace(/^[a-f0-9]* /, ''),
          prNumber,
          repo.includePrLinks
        );
        return `- [${repoLabel}] ${enhanced}`;
      });

      const fixesBody = this.getCommitsWithBody(repo.path, 'fix:').map(
        (line) => {
          const prNumber = this.extractPrNumber(line);
          const enhanced = this.enhanceCommitMessage(
            repo.path,
            line,
            prNumber,
            repo.includePrLinks
          );
          return `- [${repoLabel}] ${enhanced}`;
        }
      );

      results.fixes.push(...fixesSubject, ...fixesBody);

      // Performance improvements
      const perfSubject = this.getCommitsFromRepo(
        repo.path,
        '^[a-f0-9]+ perf:'
      ).map((line) => {
        const prNumber = this.extractPrNumber(line);
        const enhanced = this.enhanceCommitMessage(
          repo.path,
          line.replace(/^[a-f0-9]* /, ''),
          prNumber,
          repo.includePrLinks
        );
        return `- [${repoLabel}] ${enhanced}`;
      });

      const perfBody = this.getCommitsWithBody(repo.path, 'perf:').map(
        (line) => {
          const prNumber = this.extractPrNumber(line);
          const enhanced = this.enhanceCommitMessage(
            repo.path,
            line,
            prNumber,
            repo.includePrLinks
          );
          return `- [${repoLabel}] ${enhanced}`;
        }
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

  // Generate integrated format release notes
  generateIntegratedFormat(commits, releaseDate) {
    const lines = [];

    lines.push(`## ${this.toVersion} {date="${releaseDate}"}`);
    lines.push('');
    lines.push('### Features');
    lines.push('');

    if (commits.features.length > 0) {
      commits.features.forEach((feature) => {
        // Enhanced messages already include PR links
        lines.push(feature);
      });
    } else {
      lines.push('- No new features in this release');
    }

    lines.push('');
    lines.push('### Bug fixes');
    lines.push('');

    if (commits.fixes.length > 0) {
      commits.fixes.forEach((fix) => {
        // Enhanced messages already include PR links
        lines.push(fix);
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
        if (pr && this.includePrLinks) {
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
        // Enhanced messages already include PR links
        lines.push(perf);
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
        if (pr && this.includePrLinks) {
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

  // Generate separated format release notes
  generateSeparatedFormat(commits, releaseDate) {
    const lines = [];

    // Add custom header if provided
    if (this.config.separatedTemplate && this.config.separatedTemplate.header) {
      lines.push(this.config.separatedTemplate.header);
      lines.push('');
    }

    lines.push(`## ${this.toVersion} {date="${releaseDate}"}`);
    lines.push('');

    // Determine primary repository
    let primaryRepoLabel = null;
    if (this.config.primaryRepo !== null) {
      // Find primary repo by index or name
      if (typeof this.config.primaryRepo === 'number') {
        const primaryRepo = this.config.repositories[this.config.primaryRepo];
        primaryRepoLabel = primaryRepo ? primaryRepo.label : null;
      } else {
        const primaryRepo = this.config.repositories.find(
          (r) => r.name === this.config.primaryRepo
        );
        primaryRepoLabel = primaryRepo ? primaryRepo.label : null;
      }
    }

    // If no primary specified, use the first repository
    if (!primaryRepoLabel && this.config.repositories.length > 0) {
      primaryRepoLabel = this.config.repositories[0].label;
    }

    // Separate commits by primary and secondary repositories
    const primaryCommits = {
      features: [],
      fixes: [],
      perf: [],
    };

    const secondaryCommits = {
      features: [],
      fixes: [],
      perf: [],
    };

    // Sort commits into primary and secondary
    for (const type of ['features', 'fixes', 'perf']) {
      commits[type].forEach((commit) => {
        // Extract repository label from commit
        const labelMatch = commit.match(/^- \[([^\]]+)\]/);
        if (labelMatch) {
          const repoLabel = labelMatch[1];
          const cleanCommit = commit.replace(/^- \[[^\]]+\] /, '- ');

          if (repoLabel === primaryRepoLabel) {
            primaryCommits[type].push(cleanCommit);
          } else {
            // Keep the label for secondary commits
            secondaryCommits[type].push(commit);
          }
        }
      });
    }

    // Primary section
    const primaryLabel =
      this.config.separatedTemplate?.primaryLabel || 'Primary';
    lines.push(`### ${primaryLabel}`);
    lines.push('');
    lines.push('#### Features');
    lines.push('');

    if (primaryCommits.features.length > 0) {
      primaryCommits.features.forEach((feature) => {
        lines.push(feature);
      });
    } else {
      lines.push('- No new features in this release');
    }

    lines.push('');
    lines.push('#### Bug fixes');
    lines.push('');

    if (primaryCommits.fixes.length > 0) {
      primaryCommits.fixes.forEach((fix) => {
        lines.push(fix);
      });
    } else {
      lines.push('- No bug fixes in this release');
    }

    // Primary performance improvements if any
    if (primaryCommits.perf.length > 0) {
      lines.push('');
      lines.push('#### Performance Improvements');
      lines.push('');
      primaryCommits.perf.forEach((perf) => {
        lines.push(perf);
      });
    }

    // Secondary section (only if there are secondary repositories)
    const hasSecondaryChanges =
      secondaryCommits.features.length > 0 ||
      secondaryCommits.fixes.length > 0 ||
      secondaryCommits.perf.length > 0;

    if (this.config.repositories.length > 1) {
      lines.push('');
      const secondaryLabel =
        this.config.separatedTemplate?.secondaryLabel || 'Additional Changes';
      lines.push(`### ${secondaryLabel}`);
      lines.push('');

      const secondaryIntro =
        this.config.separatedTemplate?.secondaryIntro ||
        'All primary updates are included. Additional repository-specific features and fixes:';
      lines.push(secondaryIntro);
      lines.push('');

      // Secondary features
      if (secondaryCommits.features.length > 0) {
        lines.push('#### Features');
        lines.push('');
        secondaryCommits.features.forEach((feature) => {
          lines.push(feature);
        });
        lines.push('');
      }

      // Secondary fixes
      if (secondaryCommits.fixes.length > 0) {
        lines.push('#### Bug fixes');
        lines.push('');
        secondaryCommits.fixes.forEach((fix) => {
          lines.push(fix);
        });
        lines.push('');
      }

      // Secondary performance improvements
      if (secondaryCommits.perf.length > 0) {
        lines.push('#### Performance Improvements');
        lines.push('');
        secondaryCommits.perf.forEach((perf) => {
          lines.push(perf);
        });
        lines.push('');
      }

      // No secondary changes message
      if (!hasSecondaryChanges) {
        lines.push('#### No additional changes');
        lines.push('');
        lines.push(
          'All changes in this release are included in the primary repository.'
        );
        lines.push('');
      }
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
        if (pr && this.includePrLinks) {
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
        if (pr && this.includePrLinks) {
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
    if (this.config.outputFormat === 'separated') {
      content = this.generateSeparatedFormat(commits, releaseDate);
    } else {
      content = this.generateIntegratedFormat(commits, releaseDate);
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
    includePrLinks: true,
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
      case '--no-pr-links':
        options.includePrLinks = false;
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
            'Error: --format requires a format type (integrated|separated)'
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

  // Set default labels if not provided
  options.config.repositories.forEach((repo, index) => {
    if (!repo.label) {
      repo.label = repo.name || `repo${index + 1}`;
    }
    // Set default includePrLinks if not specified
    if (repo.includePrLinks === undefined) {
      repo.includePrLinks = options.includePrLinks;
    }
  });

  return options;
}

function printUsage() {
  console.log(`
Usage: node generate-release-notes.js [options] <from_version> <to_version> <primary_repo_path> [additional_repo_paths...]

Options:
  --no-fetch              Skip fetching latest commits from remote
  --pull                  Pull latest changes (implies fetch) - use with caution
  --no-pr-links           Omit PR links from commit messages (default: include links)
  --config <file>         Load configuration from JSON file
  --format <type>         Output format: 'integrated' or 'separated'
  -h, --help              Show this help message

Examples:
  node generate-release-notes.js v3.1.0 v3.2.0 /path/to/influxdb
  node generate-release-notes.js --no-fetch v3.1.0 v3.2.0 /path/to/influxdb
  node generate-release-notes.js --pull v3.1.0 v3.2.0 /path/to/influxdb /path/to/enterprise-repo
  node generate-release-notes.js --config config.json v3.1.0 v3.2.0
  node generate-release-notes.js --format separated v3.1.0 v3.2.0 /path/to/influxdb /path/to/enterprise-repo

Configuration file format (JSON):
{
  "outputFormat": "separated",
  "primaryRepo": "influxdb",
  "repositories": [
    {
      "name": "influxdb",
      "path": "/path/to/influxdb",
      "label": "Core",
      "includePrLinks": true
    },
    {
      "name": "enterprise", 
      "path": "/path/to/enterprise-repo",
      "label": "Enterprise",
      "includePrLinks": false
    }
  ],
  "separatedTemplate": {
    "header": "> [!Note]\\n> #### InfluxDB 3 Core and Enterprise relationship\\n>\\n> InfluxDB 3 Enterprise is a superset of InfluxDB 3 Core.\\n> All updates to Core are automatically included in Enterprise.\\n> The Enterprise sections below only list updates exclusive to Enterprise.",
    "primaryLabel": "Core",
    "secondaryLabel": "Enterprise",
    "secondaryIntro": "All Core updates are included in Enterprise. Additional Enterprise-specific features and fixes:"
  }
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

// Export for unified CLI
export default async function releaseNotes(args) {
  const positionals = args.args || [];
  
  // Parse command line arguments
  const options = {};
  const versions = [];
  const repoPaths = [];
  
  for (let i = 0; i < positionals.length; i++) {
    const arg = positionals[i];
    
    if (arg === '--help' || arg === '-h') {
      console.log(`
Release Notes Generator

Usage: docs release-notes [options] <from_version> <to_version> [repo_paths...]

Options:
  --config <file>   Load configuration from JSON file
  --format <type>   Output format: 'integrated' or 'separated'
  --no-fetch        Skip fetching latest commits
  --pull            Pull latest changes (use with caution)
  --no-pr-links     Omit PR links from commits

Examples:
  # Using configuration file
  docs release-notes --config config.json v3.1.0 v3.2.0
  
  # Specify repository paths
  docs release-notes v3.1.0 v3.2.0 ~/repos/influxdb

Note: Configuration files should not contain private repository names.
Use environment variables or provide paths directly.

See config/README.md for configuration details.
`);
      process.exit(0);
    } else if (arg.startsWith('--')) {
      const key = arg.replace('--', '');
      if (i + 1 < positionals.length && !positionals[i + 1].startsWith('--')) {
        options[key] = positionals[i + 1];
        i++;
      } else {
        options[key] = true;
      }
    } else if (!arg.startsWith('v') && versions.length >= 2) {
      repoPaths.push(arg);
    } else {
      versions.push(arg);
    }
  }
  
  if (versions.length < 2) {
    console.error('Error: Please specify from_version and to_version');
    console.error('Run: docs release-notes --help');
    process.exit(1);
  }
  
  // Create generator with options
  const generator = new ReleaseNotesGenerator({
    fromVersion: versions[0],
    toVersion: versions[1],
    fetchCommits: options['no-fetch'] !== true,
    pullCommits: options['pull'] === true,
    includePrLinks: options['no-pr-links'] !== true,
    config: options.config ? JSON.parse(require('fs').readFileSync(options.config, 'utf8')) : undefined,
  });
  
  // Set repository paths if provided
  if (repoPaths.length > 0) {
    generator.config.repositories = repoPaths.map((path, i) => ({
      name: `repo${i}`,
      path,
      label: `repo${i}`,
      includePrLinks: true,
    }));
  }
  
  // Generate release notes
  await generator.generate();
}
