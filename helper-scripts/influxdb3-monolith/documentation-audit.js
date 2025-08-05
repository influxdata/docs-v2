#!/usr/bin/env node

/**
 * CLI documentation auditor that parses commands directly from Rust source code
 * 
 * Usage: node documentation-audit.js [core|enterprise|both] [version/branch/tag]
 * Example: node documentation-audit.js core v3.3.0
 * Example: node documentation-audit.js enterprise main
 */

import { promises as fs } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';

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

// Documentation categories with their associated path patterns
const DOC_CATEGORIES = {
  CLI_REFERENCE: {
    name: 'CLI Reference',
    priority: 1,
    patterns: [
      '/reference/cli/',
      '/shared/influxdb3-cli/',
      '/admin/cli/',
      '/reference/influxdb3/cli/',
    ]
  },
  API_REFERENCE: {
    name: 'API Reference',
    priority: 2,
    patterns: [
      '/reference/api/',
      '/api/',
      '/shared/influxdb3-api/',
    ]
  },
  GETTING_STARTED: {
    name: 'Getting Started',
    priority: 3,
    patterns: [
      '/get-started/',
      '/tutorial/',
      '/quickstart/',
      '/shared/influxdb3-get-started/',
    ]
  },
  ADMIN_GUIDES: {
    name: 'Administration',
    priority: 4,
    patterns: [
      '/admin/',
      '/manage/',
      '/administration/',
      '/shared/influxdb3-admin/',
    ]
  },
  WRITE_DATA: {
    name: 'Write Data',
    priority: 5,
    patterns: [
      '/write-data/',
      '/write/',
      '/ingest/',
      '/shared/influxdb3-write/',
    ]
  },
  QUERY_DATA: {
    name: 'Query Data',
    priority: 6,
    patterns: [
      '/query-data/',
      '/query/',
      '/read/',
      '/shared/influxdb3-query/',
    ]
  },
  PROCESS_DATA: {
    name: 'Process Data',
    priority: 7,
    patterns: [
      '/process-data/',
      '/process/',
      '/transform/',
      '/shared/influxdb3-process/',
    ]
  },
  GENERAL_REFERENCE: {
    name: 'General Reference',
    priority: 10,
    patterns: [
      '/reference/',
      '/shared/influxdb3-reference/',
    ]
  }
};

// Helper to get active categories (can be configured)
function getActiveCategories(categoryFilter = null) {
  if (!categoryFilter) {
    return Object.values(DOC_CATEGORIES);
  }
  
  if (Array.isArray(categoryFilter)) {
    return categoryFilter.map(cat => DOC_CATEGORIES[cat]).filter(Boolean);
  }
  
  if (typeof categoryFilter === 'string') {
    return DOC_CATEGORIES[categoryFilter] ? [DOC_CATEGORIES[categoryFilter]] : [];
  }
  
  return Object.values(DOC_CATEGORIES);
}

class CLIDocumentationAuditor {
  constructor(product = 'both', version = 'main', categoryFilter = null) {
    this.product = product;
    this.version = version;
    this.categoryFilter = categoryFilter;
    this.outputDir = join(dirname(__dirname), 'output', 'cli-audit');
    
    // Repository paths - Use separate clone to avoid disturbing user's work
    this.sourceInfluxdbRepo = '/Users/ja/Documents/github/influxdata/influxdb';
    this.workingInfluxdbRepo = join(this.outputDir, 'influxdb-clone');
    this.docsRepo = '/Users/ja/Documents/github/influxdata/docs-v2';
    
    // Parsed command data
    this.commands = new Map(); // command -> { options: [], description: '', examples: [] }
    this.commandOptionsMap = {}; // For backward compatibility
    
    // Enterprise feature detection patterns
    this.enterprisePatterns = [
      /enterprise/i,
      /license/i,
      /cluster/i,
      /replication/i,
      /backup/i,
      /restore/i
    ];
    
    // Active categories for search
    this.activeCategories = getActiveCategories(this.categoryFilter);
  }

  async ensureDir(dir) {
    await fs.mkdir(dir, { recursive: true });
  }

  runCommand(cmd, args = [], cwd = null) {
    return new Promise((resolve) => {
      const options = { encoding: 'utf8' };
      if (cwd) options.cwd = cwd;
      
      const child = spawn(cmd, args, options);
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

  /**
   * Ensure we have a working copy of the repository
   * This avoids disturbing the user's working directory
   */
  async ensureWorkingRepo() {
    // Check if working repo exists
    try {
      await fs.access(this.workingInfluxdbRepo);
      console.log('📁 Using existing working repository clone');
      return true;
    } catch {
      // Clone the repository
      console.log('📥 Cloning repository for analysis...');
      const result = await this.runCommand('git', [
        'clone', 
        this.sourceInfluxdbRepo, 
        this.workingInfluxdbRepo
      ]);
      
      if (result.code !== 0) {
        console.error(`❌ Failed to clone repository: ${result.stderr}`);
        return false;
      }
      
      console.log('✅ Repository cloned successfully');
      return true;
    }
  }

  /**
   * Checkout specific version/branch/tag in the working repository
   */
  async checkoutVersion(version) {
    if (version === 'main' || version === 'local') {
      console.log('📋 Using current state of repository');
      
      // Pull latest changes if it's main
      if (version === 'main') {
        const result = await this.runCommand(
          'git', 
          ['pull', 'origin', 'main'], 
          this.workingInfluxdbRepo
        );
        if (result.code !== 0) {
          console.warn(`⚠️ Could not pull latest changes: ${result.stderr}`);
        }
      }
      return true;
    }

    console.log(`🔄 Checking out version: ${version}`);
    const result = await this.runCommand(
      'git', 
      ['checkout', version], 
      this.workingInfluxdbRepo
    );
    
    if (result.code !== 0) {
      console.error(`❌ Failed to checkout ${version}: ${result.stderr}`);
      return false;
    }
    
    return true;
  }

  /**
   * Detect if a command or feature is Enterprise-specific
   * @param {string} content - Source code content
   * @param {string} commandName - Command name
   * @returns {boolean} - True if enterprise feature
   */
  detectEnterpriseFeature(content, commandName) {
    // Check for enterprise patterns in code content
    const hasEnterprisePattern = this.enterprisePatterns.some(pattern => 
      pattern.test(content) || pattern.test(commandName)
    );
    
    // Check for feature flags or conditional compilation
    const hasFeatureFlag = /cfg\(feature\s*=\s*["']enterprise["']\)/.test(content);
    
    // Check for license checks
    const hasLicenseCheck = /license|License/.test(content);
    
    return hasEnterprisePattern || hasFeatureFlag || hasLicenseCheck;
  }

  /**
   * Parse Rust source file to extract command information
   * Enhanced with Enterprise feature detection
   */
  async parseRustCommand(filePath, commandName) {
    try {
      const content = await fs.readFile(filePath, 'utf8');
      const command = {
        name: commandName,
        options: [],
        description: '',
        examples: [],
        usage: '',
        subcommands: [],
        isEnterpriseFeature: this.detectEnterpriseFeature(content, commandName),
        alias: null
      };

      // Look for command-level visible_alias in clap attributes
      const commandAliasRegex = /#\[(?:clap|command)\([^)]*visible_alias\s*=\s*"([^"]+)"[^)]*\)\]/;
      const aliasMatch = content.match(commandAliasRegex);
      if (aliasMatch) {
        command.alias = aliasMatch[1];
      }

      // Extract struct documentation (above #[derive(Debug, Parser)])
      const structRegex = /#\[derive\(.*Parser.*\)\]\s*(?:\/\/\/.*\n)*\s*pub struct (\w+)/;
      
      // Find the relevant struct - could be Config or a specific subcommand config
      let structMatch = content.match(structRegex);
      
      // If this is a subcommand, look for the specific config struct
      if (commandName.includes(' ')) {
        const parts = commandName.split(' ');
        const subcommandName = parts[parts.length - 1];
        // Look for structs like PackageConfig, WalPluginConfig, etc.
        const subcommandStructRegex = new RegExp(`#\\[derive\\([^)]*(?:clap::Parser|clap::Args)[^)]*\\)\\]\\s*(?:\\/\\/\\/.*\\n)*\\s*pub struct (${subcommandName.charAt(0).toUpperCase() + subcommandName.slice(1)}\\w*Config)`, 'i');
        const subcommandMatch = content.match(subcommandStructRegex);
        if (subcommandMatch) {
          structMatch = subcommandMatch;
        }
      }
      
      if (structMatch) {
        try {
          // Look for doc comments before the struct
          const beforeStruct = content.substring(0, structMatch.index);
          const lines = beforeStruct.split('\n').reverse();
          
          const docLines = [];
          for (const line of lines) {
            const docMatch = line.match(/^\s*\/\/\/\s*(.*)$/);
            if (docMatch) {
              docLines.unshift(docMatch[1]);
            } else if (line.trim() === '' || line.includes('#[')) {
              continue; // Skip empty lines and attributes
            } else {
              break; // Stop at non-doc content
            }
          }
          
          if (docLines.length > 0) {
            command.description = docLines.join(' ').trim();
          }
        } catch (error) {
          console.warn(`Warning: Error parsing struct documentation in ${filePath}: ${error.message}`);
        }
      }

      // Parse fields with a more robust line-by-line approach
      const lines = content.split('\n');
      let currentDoc = '';
      let inStruct = false;
      
      // Only proceed if we found a valid struct
      if (structMatch && structMatch[1]) {
        const structName = structMatch[1];
        
        for (let i = 0; i < lines.length; i++) {
          try {
            const line = lines[i].trim();
            
            // Check if we're entering the relevant struct
            if (line.includes('pub struct') && line.includes(structName)) {
              inStruct = true;
              continue;
            }
            
            // Stop when we exit the struct
            if (inStruct && line === '}') {
              break;
            }
            
            if (!inStruct) continue;
        
            // Collect doc comments
            if (line.startsWith('///')) {
              const docText = line.replace(/^\/\/\/\s*/, '');
              currentDoc = currentDoc ? `${currentDoc} ${docText}` : docText;
              continue;
            }
            
            // Look for clap attributes - support both #[clap(...)] and #[arg(...)]
            if (line.startsWith('#[clap(') || line.startsWith('#[arg(')) {
              const clapLine = line;
              let clapAttrs = '';
              
              if (line.startsWith('#[clap(')) {
                clapAttrs = clapLine.replace('#[clap(', '').replace(')]', '');
              } else {
                clapAttrs = clapLine.replace('#[arg(', '').replace(')]', '');
              }
              
              // Handle multi-line clap attributes
              let j = i + 1;
              while (j < lines.length && !clapLine.includes(')]')) {
                const nextLine = lines[j].trim();
                clapAttrs += ' ' + nextLine.replace(')]', '');
                if (nextLine.includes(')]')) break;
                j++;
              }
              
              // Get the field definition (next non-empty line)
              let fieldLine = '';
              j = i + 1;
              while (j < lines.length) {
                const nextLine = lines[j].trim();
                if (nextLine && !nextLine.startsWith('#[') && !nextLine.startsWith('///')) {
                  fieldLine = nextLine;
                  break;
                }
                j++;
              }
              
              if (fieldLine.includes(':')) {
                let [fieldName, fieldType] = fieldLine.split(':').map(s => s.trim());
                const attrs = this.parseClapAttributes(clapAttrs);
                
                // Skip flattened configs
                if (attrs.flatten) {
                  currentDoc = '';
                  continue;
                }
                
                // Clean field name - remove visibility modifiers like 'pub', 'pub(crate)', etc.
                fieldName = fieldName.replace(/^pub(?:\([^)]*\))?\s+/, '');
                
                const optionName = attrs.long || fieldName.replace(/_/g, '-');
                
                // Skip internal command routing options
                if (optionName === 'cmd' || optionName === 'command' || optionName === 'subcommand') {
                  currentDoc = '';
                  continue;
                }

                const option = {
                  name: optionName,
                  short: attrs.short,
                  description: currentDoc || attrs.help || attrs.about || '',
                  defaultValue: attrs.default_value || attrs.default_value_t,
                  env: attrs.env,
                  fieldType: fieldType.replace(/,$/, '').trim(),
                  required: !fieldType.includes('Option<') && !attrs.default_value && !attrs.default_value_t && !attrs.required_unless_present
                };
                
                command.options.push(option);
              }
              
              currentDoc = '';
            } else if (line && !line.startsWith('//') && !line.startsWith('#[')) {
              // Reset doc collection if we hit a non-doc, non-attribute line
              currentDoc = '';
            }
          } catch (error) {
            console.warn(`Warning: Error parsing line ${i + 1} in ${filePath}: ${error.message}`);
            continue;
          }
        }
      }

      // Look for usage examples in comments
      const exampleRegex = /\/\/\s*[Ee]xample:?\s*\n?\s*([^\n]+)/g;
      let exampleMatch;
      
      while ((exampleMatch = exampleRegex.exec(content)) !== null) {
        const example = exampleMatch[1].trim();
        if (example && !command.examples.includes(example)) {
          command.examples.push(example);
        }
      }

      // Parse subcommands from enum definitions (only for top-level commands)
      if (!commandName.includes(' ')) {
        const subcommands = this.parseSubcommands(content, commandName);
        command.subcommands = subcommands;
      } else {
        command.subcommands = [];
      }

      return command;
    } catch (error) {
      console.warn(`Failed to parse ${filePath}: ${error.message}`);
      return null;
    }
  }

  /**
   * Parse subcommands from enum definitions in Rust source
   */
  parseSubcommands(content, parentCommand) {
    const subcommands = [];
    
    // Look for subcommand enums (e.g., pub enum SubCommand, pub enum Command)
    const enumRegex = /#\[derive\([^)]*clap::Subcommand[^)]*\)\]\s*pub enum (\w*(?:Sub)?Command)\s*\{([^}]+)\}/gs;
    let enumMatch;
    
    while ((enumMatch = enumRegex.exec(content)) !== null) {
      const enumContent = enumMatch[2];
      const lines = enumContent.split('\n');
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        
        // Look for enum variants (subcommands)
        if (line.startsWith('///')) {
          // Collect doc comment
          let description = line.replace(/^\/\/\/\s*/, '');
          let j = i + 1;
          
          // Look for more doc comments
          while (j < lines.length && lines[j].trim().startsWith('///')) {
            description += ' ' + lines[j].trim().replace(/^\/\/\/\s*/, '');
            j++;
          }
          
          // Look for the next non-comment line which should be the variant
          while (j < lines.length) {
            const variantLine = lines[j].trim();
            if (variantLine && !variantLine.startsWith('///') && !variantLine.startsWith('#[')) {
              // Parse variant name - handle both simple and with config
              let variantMatch = variantLine.match(/^(\w+)(?:\([^)]+\))?[,]?$/);
              if (variantMatch) {
                let subcommandName = variantMatch[1];
                
                // Check for clap name attribute in preceding lines
                for (let k = i + 1; k < j; k++) {
                  const clapMatch = lines[k].match(/#\[clap\([^)]*name\s*=\s*"([^"]+)"[^)]*\)\]/);
                  if (clapMatch) {
                    subcommandName = clapMatch[1];
                    break;
                  }
                }
                
                subcommands.push({
                  name: subcommandName,
                  description: description.trim(),
                  fullName: `${parentCommand} ${subcommandName}`
                });
              }
              break;
            }
            j++;
          }
          
          i = j - 1; // Skip processed lines
        }
      }
    }
    
    return subcommands;
  }

  /**
   * Parse clap attribute string into structured object
   * More robust parsing that handles various formats
   */
  parseClapAttributes(clapAttrs) {
    const attrs = {};
    
    // Clean up the input
    const cleanAttrs = clapAttrs.replace(/\s+/g, ' ').trim();
    
    // Handle different clap patterns with improved regex
    const patterns = {
      long: /long\s*=\s*"([^"]+)"/,
      short: /short\s*=\s*['"]([^'"]+)['"]/,
      help: /help\s*=\s*"([^"]+)"/,
      about: /about\s*=\s*"([^"]+)"/,
      default_value: /default_value\s*=\s*"([^"]+)"/,
      default_value_t: /default_value_t\s*=\s*([^,)\s]+)/,
      env: /env\s*=\s*"([^"]+)"/,
      value_enum: /value_enum/,
      flatten: /flatten/,
      visible_alias: /visible_alias\s*=\s*"([^"]+)"/,
      required_unless_present: /required_unless_present\s*=\s*"([^"]+)"/
    };

    for (const [key, pattern] of Object.entries(patterns)) {
      if (typeof pattern === 'object' && pattern.test) {
        const match = cleanAttrs.match(pattern);
        if (match) {
          attrs[key] = match[1];  
        }
      } else {
        attrs[key] = pattern.test(cleanAttrs);
      }
    }

    return attrs;
  }

  /**
   * Discover all commands by walking the commands directory
   */
  async discoverCommands() {
    const commandsDir = join(this.workingInfluxdbRepo, 'influxdb3/src/commands');
    
    // Parse root commands
    const rootCommands = await this.parseCommandDirectory(commandsDir, []);
    
    // Store commands
    for (const command of rootCommands) {
      const fullName = `influxdb3 ${command.name}`;
      this.commands.set(fullName, command);
      
      // For backward compatibility
      this.commandOptionsMap[fullName] = command.options.map(opt => `--${opt.name}`);
      
      // Add subcommands as separate entries if they exist
      for (const subcommand of command.subcommands) {
        // Try to find the subcommand's config file to get its options
        const subcommandPath = this.findSubcommandFile(command.name, subcommand.name);
        if (subcommandPath) {
          const subcommandConfig = await this.parseRustCommand(subcommandPath, subcommand.fullName);
          if (subcommandConfig) {
            this.commands.set(`influxdb3 ${subcommand.fullName}`, subcommandConfig);
            this.commandOptionsMap[`influxdb3 ${subcommand.fullName}`] = subcommandConfig.options.map(opt => `--${opt.name}`);
          }
        }
      }
    }

    console.log(`✅ Discovered ${this.commands.size} commands from source code`);
  }

  /**
   * Find the file containing subcommand configuration
   */
  findSubcommandFile(parentCommand, subcommandName) {
    // For commands like 'install package', look for struct PackageConfig in install.rs
    const commandFile = join(this.workingInfluxdbRepo, 'influxdb3/src/commands', `${parentCommand}.rs`);
    return commandFile; // The subcommand config is typically in the same file
  }

  /**
   * Recursively parse command directory structure
   */
  async parseCommandDirectory(dir, parentCommands) {
    const commands = [];
    
    try {
      const entries = await fs.readdir(dir, { withFileTypes: true });
      
      for (const entry of entries) {
        if (entry.isFile() && entry.name.endsWith('.rs') && entry.name !== 'mod.rs' && entry.name !== 'common.rs' && entry.name !== 'helpers.rs') {
          const commandName = entry.name.replace('.rs', '');
          const fullPath = join(dir, entry.name);
          const fullCommandName = [...parentCommands, commandName].join(' ');
          
          const command = await this.parseRustCommand(fullPath, fullCommandName);
          if (command) {
            commands.push(command);
          }
        } else if (entry.isDirectory() && parentCommands.length === 0) {
          // Only parse subdirectories if we're at the top level commands directory
          // and skip known non-command directories
          const skipDirectories = ['plugin_test']; // Known legacy/internal directories
          
          if (!skipDirectories.includes(entry.name)) {
            const subDir = join(dir, entry.name);
            const subCommands = await this.parseCommandDirectory(subDir, [...parentCommands, entry.name]);
            commands.push(...subCommands);
          }
        }
      }
    } catch (error) {
      console.warn(`Failed to read directory ${dir}: ${error.message}`);
    }
    
    return commands;
  }

  /**
   * Find documented options using reference pattern filtering
   */
  async grepForDocumentedOptions(command, options, repoRoot) {
    const searchDirs = [
      join(repoRoot, 'content/influxdb3/core'),
      join(repoRoot, 'content/influxdb3/enterprise'),
      join(repoRoot, 'content/shared')
    ];

    const results = {
      documentedOptions: [],
      optionLocations: {},
      commandFiles: [],
      excludedFiles: []
    };

    // Helper function to check file relevance and assign priority
    const getFileRelevance = (filePath) => {
      // Check each active category
      for (const category of this.activeCategories) {
        for (const pattern of category.patterns) {
          if (filePath.includes(pattern)) {
            return {
              relevant: true,
              priority: category.priority,
              reason: `${category.name}: ${pattern}`,
              category: category.name
            };
          }
        }
      }
      
      // Check for command mentions in path
      const commandName = command.replace('influxdb3 ', '');
      const hasDirectCommandMention = (
        filePath.includes(`/cli/influxdb3/${commandName.replace(' ', '/')}`) ||
        filePath.includes(`/${commandName}/`) ||
        filePath.includes(`-${commandName}.md`) ||
        filePath.includes(`${commandName}.md`)
      );
      
      if (hasDirectCommandMention) {
        return {
          relevant: true,
          priority: 15, // Lower priority than categories
          reason: 'Direct command path match',
          category: 'Path Match'
        };
      }
      
      return {
        relevant: false,
        priority: 99,
        reason: 'Not in active categories',
        category: 'None'
      };
    };

    // Recursive file search
    const searchFiles = async (dir) => {
      try {
        const entries = await fs.readdir(dir, { withFileTypes: true });
        
        for (const entry of entries) {
          const fullPath = join(dir, entry.name);
          
          if (entry.isDirectory()) {
            await searchFiles(fullPath);
          } else if (entry.name.endsWith('.md')) {
            const relativePath = fullPath.replace(repoRoot + '/', '');
            const relevance = getFileRelevance(fullPath);
            
            if (!relevance.relevant) {
              results.excludedFiles.push({
                file: relativePath,
                reason: relevance.reason
              });
              continue;
            }
            
            try {
              const content = await fs.readFile(fullPath, 'utf-8');
              
              // Check for command mentions - be more specific
              const commandName = command.replace('influxdb3 ', '');
              
              // Create regex patterns for more accurate matching
              const commandRegex = new RegExp(`influxdb3\\s+${commandName.replace(/\s+/g, '\\s+')}(?:\\s|$|\\[)`, 'i');
              const codeBlockRegex = /```(?:sh|bash|shell)\s*\n[\s\S]*?influxdb3[\s\S]*?```/g;
              
              // Check if this file contains relevant CLI command mentions
              const hasCommandMention = (
                // Direct command mention with proper word boundaries
                commandRegex.test(content) ||
                // Check within code blocks specifically
                (codeBlockRegex.test(content) && content.match(codeBlockRegex).some(block => commandRegex.test(block))) ||
                // Path-based matching for CLI reference docs
                relativePath.includes(`/cli/influxdb3/${commandName.replace(' ', '/')}`)
              );
              
              if (hasCommandMention) {
                // Look for each option in this file
                const lines = content.split('\n');
                lines.forEach((line, index) => {
                  for (const option of options) {
                    // Create regex for more precise option matching
                    // Match option with word boundaries, allowing for backticks, quotes, or table cells
                    const optionRegex = new RegExp(`(?:^|[\\s\`'"|])${option.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?:[\\s\`'"|,]|$)`);
                    
                    if (optionRegex.test(line)) {
                      // Additional validation: skip if it's in a comment or unrelated context
                      const trimmedLine = line.trim();
                      const isComment = trimmedLine.startsWith('//') || trimmedLine.startsWith('#') || trimmedLine.startsWith('<!--');
                      const isInCodeContext = line.includes('influxdb3') || line.includes('--') || line.includes('|') || line.includes('`');
                      
                      if (!isComment && isInCodeContext) {
                        if (!results.documentedOptions.includes(option)) {
                          results.documentedOptions.push(option);
                        }
                        
                        if (!results.optionLocations[option]) {
                          results.optionLocations[option] = [];
                        }
                        
                        results.optionLocations[option].push({
                          file: fullPath, // Use absolute path for VS Code
                          line: index + 1,
                          content: line.trim(),
                          priority: relevance.priority
                        });
                      }
                    }
                  }
                });

                if (!results.commandFiles.some(f => f.path === fullPath)) {
                  results.commandFiles.push({
                    path: fullPath, // Use absolute path
                    priority: relevance.priority,
                    reason: relevance.reason
                  });
                }
              }
            } catch {
              // Skip files that can't be read
            }
          }
        }
      } catch {
        // Skip directories that don't exist
      }
    };

    for (const dir of searchDirs) {
      await searchFiles(dir);
    }

    results.documentedOptions = [...new Set(results.documentedOptions)].sort();
    
    // Sort files by priority (lower numbers = higher priority) and remove duplicates
    const uniqueFiles = new Map();
    results.commandFiles.forEach(file => {
      if (!uniqueFiles.has(file.path) || uniqueFiles.get(file.path).priority > file.priority) {
        uniqueFiles.set(file.path, file);
      }
    });
    results.commandFiles = Array.from(uniqueFiles.values()).sort((a, b) => a.priority - b.priority);

    return results;
  }

  /**
   * Generate enhanced documentation template with source code information
   */
  async generateDocumentationTemplate(command, product) {
    const cmd = this.commands.get(`influxdb3 ${command}`);
    if (!cmd) {
      console.warn(`Command not found: ${command}`);
      return '';
    }

    const productTag = product === 'enterprise' ? 'influxdb3/enterprise' : 'influxdb3/core';
    const menuRef = product === 'enterprise' 
      ? 'influxdb3_enterprise_reference' 
      : 'influxdb3_core_reference';

    const enhancedDescription = cmd.description || `Manage ${command.split(' ').pop()} resources`;

    let template = `---
title: influxdb3 ${command}
description: >
  The \`influxdb3 ${command}\` command ${enhancedDescription.toLowerCase()}.
${productTag}/tags: [cli]
menu:
  ${menuRef}:
    parent: influxdb3 cli
weight: 201
---

# influxdb3 ${command}

${enhancedDescription}

## Usage

\`\`\`bash
influxdb3 ${command} [OPTIONS]
\`\`\`

`;

    if (cmd.options.length > 0) {
      template += `## Options

| Option | Description | Default | Environment | Required |
|--------|-------------|---------|-------------|----------|
`;

      for (const opt of cmd.options) {
        const optionDisplay = opt.short
          ? `\`-${opt.short}\`, \`--${opt.name}\``
          : `\`--${opt.name}\``;
        
        const defaultCol = opt.defaultValue ? `\`${opt.defaultValue}\`` : '';
        const envCol = opt.env ? `\`${opt.env}\`` : '';
        const requiredCol = opt.required ? '✅' : '';
        
        template += `| ${optionDisplay} | ${opt.description || 'No description available'} | ${defaultCol} | ${envCol} | ${requiredCol} |\n`;
      }
      
      template += '\n';
    }

    // Add examples section
    template += `## Examples

`;

    if (cmd.examples.length > 0) {
      cmd.examples.forEach((example, index) => {
        template += `### Example ${index + 1}

\`\`\`bash
${example}
\`\`\`

`;
      });
    }

    // Add generic examples based on command type
    const commandParts = command.split(' ');
    const examples = this.generateCommandExamples(commandParts);
    
    examples.forEach((example, index) => {
      const exampleNum = (cmd.examples.length || 0) + index + 1;
      template += `### Example ${exampleNum}: ${example.title}

${example.description ? example.description + '\n\n' : ''}${example.code}

`;
    });

    return template;
  }

  generateCommandExamples(commandParts) {
    const [mainCommand, ...subCommands] = commandParts;
    const examples = [];

    // Command-specific examples (same logic as before, but now we could enhance with source data)
    switch (mainCommand) {
      case 'query':
        examples.push({
          title: 'Query with SQL',
          description: 'Execute a SQL query against your database.',
          code: `{{% code-placeholders "DATABASE_NAME|TABLE_NAME" %}}
\`\`\`bash
influxdb3 query --database DATABASE_NAME "SELECT * FROM TABLE_NAME LIMIT 10"
\`\`\`
{{% /code-placeholders %}}

Replace the following:
- {{% code-placeholder-key %}}\`DATABASE_NAME\`{{% /code-placeholder-key %}}: Name of the database to query
- {{% code-placeholder-key %}}\`TABLE_NAME\`{{% /code-placeholder-key %}}: Name of the table to query`
        });
        break;
      
      case 'write':
        examples.push({
          title: 'Write line protocol data',
          description: 'Write measurement data using line protocol format.',
          code: `{{% code-placeholders "DATABASE_NAME" %}}
\`\`\`bash
influxdb3 write --database DATABASE_NAME "temperature,location=room1 value=22.5"
\`\`\`
{{% /code-placeholders %}}

Replace the following:
- {{% code-placeholder-key %}}\`DATABASE_NAME\`{{% /code-placeholder-key %}}: Name of the database to write to`
        });
        break;
      
      default:
        examples.push({
          title: 'Basic usage',
          description: `Execute the ${commandParts.join(' ')} command.`,
          code: `\`\`\`bash
influxdb3 ${commandParts.join(' ')} --help
\`\`\``
        });
    }

    return examples;
  }

  /**
   * Generate comprehensive audit report
   */
  async generateAuditReport(product, repoRoot) {
    const auditFile = join(this.outputDir, `documentation-audit-${product}-${this.version}.md`);
    const patchDir = join(this.outputDir, 'patches', product);
    await this.ensureDir(patchDir);

    let output = `# CLI Documentation Audit - ${product}\n`;
    output += `Generated: ${new Date().toISOString()}\n`;
    output += `Version: ${this.version}\n`;
    output += `Source repository: ${this.sourceInfluxdbRepo}\n`;
    output += `Working repository: ${this.workingInfluxdbRepo}\n`;
    output += `Active categories: ${this.activeCategories.map(c => c.name).join(', ')}\n\n`;

    let totalOptions = 0;
    let documentedOptions = 0;
    const missingDocs = [];
    const existingDocs = [];

    // Process each command
    for (const [commandName, command] of this.commands) {
      const cleanCommand = commandName.replace('influxdb3 ', '');
      const optionNames = command.options.map(opt => `--${opt.name}`);
      
      totalOptions += optionNames.length;

      if (optionNames.length === 0) continue;

      // Check documentation coverage for both original name and alias
      let grepResults = await this.grepForDocumentedOptions(
        commandName,
        optionNames,
        repoRoot
      );

      // If no results found and command has an alias, check the alias
      if (grepResults.commandFiles.length === 0 && command.alias) {
        const aliasCommandName = commandName.replace(cleanCommand, command.alias);
        const aliasResults = await this.grepForDocumentedOptions(
          aliasCommandName,
          optionNames,
          repoRoot
        );
        
        // If alias has better results, use those
        if (aliasResults.commandFiles.length > 0) {
          grepResults = aliasResults;
        }
      }

      const missingOptions = optionNames.filter(
        opt => !grepResults.documentedOptions.includes(opt)
      );

      documentedOptions += grepResults.documentedOptions.length;

      if (grepResults.commandFiles.length > 0) {
        existingDocs.push({
          command: cleanCommand,
          commandData: command,
          documentedOptions: grepResults.documentedOptions,
          missingOptions,
          files: grepResults.commandFiles,
          optionLocations: grepResults.optionLocations,
          alias: command.alias
        });
      } else {
        missingDocs.push({
          command: cleanCommand,
          commandData: command,
          allMissing: true,
          alias: command.alias
        });
      }
    }

    // Summary
    const coveragePercent = totalOptions > 0 ? Math.round((documentedOptions / totalOptions) * 100) : 0;
    
    output += '## Summary\n\n';
    output += `- **Commands discovered**: ${this.commands.size}\n`;
    output += `- **Total CLI options**: ${totalOptions}\n`;
    output += `- **Documented options**: ${documentedOptions}\n`;
    output += `- **Documentation coverage**: ${coveragePercent}%\n\n`;

    // Missing documentation
    output += '## Missing Documentation\n\n';
    
    if (missingDocs.length > 0) {
      for (const doc of missingDocs) {
        output += `### \`influxdb3 ${doc.command}\`\n\n`;
        if (doc.alias) {
          output += `**Alias:** \`influxdb3 ${doc.alias}\`\n\n`;
        }
        output += `**Command details from source:**\n`;
        output += `- Description: ${doc.commandData.description || 'No description'}\n`;
        output += `- Options: ${doc.commandData.options.length}\n`;
        output += `- Examples in source: ${doc.commandData.examples.length}\n\n`;

        // Generate and save template
        const template = await this.generateDocumentationTemplate(doc.command, product);
        const patchFile = join(patchDir, `${doc.command.replace(/ /g, '-')}.md`);
        await fs.writeFile(patchFile, template);
        
        output += `**Generated template**: [\`${patchFile.replace(this.outputDir + '/', 'helper-scripts/output/')}\`](vscode://file/${patchFile})\n\n`;
      }
    } else {
      output += 'All commands have some documentation coverage.\n\n';
    }

    // Existing documentation review
    output += '## Existing Documentation Review\n\n';
    
    for (const doc of existingDocs) {
      output += `### \`influxdb3 ${doc.command}\`\n\n`;
      
      if (doc.alias) {
        output += `**Alias:** \`influxdb3 ${doc.alias}\`\n\n`;
      }
      
      // Show source code insights
      output += `**Source code insights:**\n`;
      output += `- Description: ${doc.commandData.description || 'None'}\n`;
      output += `- Total options: ${doc.commandData.options.length}\n`;
      output += `- Required options: ${doc.commandData.options.filter(opt => opt.required).length}\n`;
      output += `- Environment variables: ${doc.commandData.options.filter(opt => opt.env).length}\n`;
      output += `- Default values: ${doc.commandData.options.filter(opt => opt.defaultValue).length}\n\n`;

      output += `**Documentation files:**\n`;
      for (const fileInfo of doc.files) {
        // Convert absolute path to VS Code-compatible file:// URL format
        const file = typeof fileInfo === 'string' ? fileInfo : fileInfo.path;
        const relativePath = file.replace(this.docsRepo + '/', '');
        const priority = typeof fileInfo === 'object' ? ` (priority ${fileInfo.priority})` : '';
        output += `- [\`${relativePath}\`](vscode://file/${file})${priority}\n`;
      }
      output += '\n';

      if (doc.missingOptions.length > 0) {
        output += `**⚠️ Undocumented options** (${doc.missingOptions.length}):\n`;
        for (const option of doc.missingOptions.sort()) {
          // Find the option details from source
          const optionName = option.replace('--', '');
          const optionData = doc.commandData.options.find(opt => opt.name === optionName);
          
          output += `- \`${option}\``;
          if (optionData) {
            output += ` - ${optionData.description}`;
            if (optionData.required) output += ' *(required)*';
            if (optionData.env) output += ` *(env: ${optionData.env})*`;
          }
          output += '\n';
        }
        output += '\n';
      }

      const coverage = Math.round((doc.documentedOptions.length / doc.commandData.options.length) * 100);
      output += `**Coverage**: ${coverage}%\n\n`;
    }

    await fs.writeFile(auditFile, output);
    
    console.log(`📄 Documentation audit complete: ${auditFile}`);
    console.log(`📊 Coverage: ${coveragePercent}% (${documentedOptions}/${totalOptions} options)`);
    
    if (missingDocs.length > 0) {
      console.log(`📝 Generated ${missingDocs.length} enhanced templates in: ${patchDir}`);
    }
  }

  async run() {
    console.log(`${Colors.BLUE}🔍 CLI Documentation Audit${Colors.NC}`);
    console.log('==========================================');
    console.log(`Product: ${this.product}`);
    console.log(`Version: ${this.version}`);
    console.log(`Source repo: ${this.sourceInfluxdbRepo}`);
    console.log(`Working repo: ${this.workingInfluxdbRepo}`);
    console.log(`Categories: ${this.activeCategories.map(c => c.name).join(', ')}`);
    console.log();

    // Ensure output directory exists
    await this.ensureDir(this.outputDir);

    // Ensure we have a working repository copy
    if (!(await this.ensureWorkingRepo())) {
      process.exit(1);
    }

    // Checkout specific version if needed
    if (!(await this.checkoutVersion(this.version))) {
      process.exit(1);
    }

    // Discover commands from source code
    await this.discoverCommands();

    // Generate audit reports
    if (this.product === 'core' || this.product === 'both') {
      await this.generateAuditReport('core', this.docsRepo);
    }

    if (this.product === 'enterprise' || this.product === 'both') {
      await this.generateAuditReport('enterprise', this.docsRepo);
    }

    console.log();
    console.log(`${Colors.GREEN}✅ Documentation audit complete!${Colors.NC}`);
  }
}

// Main execution
async function main() {
  const args = process.argv.slice(2);
  const product = args[0] || 'both';
  const version = args[1] || 'main';
  
  // Parse category filter from args
  let categoryFilter = null;
  const categoryArg = args.find(arg => arg.startsWith('--categories='));
  if (categoryArg) {
    const categories = categoryArg.split('=')[1].split(',');
    categoryFilter = categories.map(c => c.trim().toUpperCase());
  }

  if (!['core', 'enterprise', 'both'].includes(product)) {
    console.error(`Error: Invalid product '${product}'`);
    console.error('Usage: node documentation-audit.js [core|enterprise|both] [version/branch/tag] [--categories=CLI_REFERENCE,API_REFERENCE,...]');
    console.error('\nAvailable categories:');
    Object.entries(DOC_CATEGORIES).forEach(([key, cat]) => {
      console.error(`  ${key}: ${cat.name}`);
    });
    process.exit(1);
  }

  const auditor = new CLIDocumentationAuditor(product, version, categoryFilter);
  await auditor.run();
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((err) => {
    console.error('Error:', err);
    process.exit(1);
  });
}

export { CLIDocumentationAuditor };
