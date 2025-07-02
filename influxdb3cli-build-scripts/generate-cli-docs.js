// generate-cli-docs.js
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = path.join(__dirname, 'content', 'shared', 'influxdb3-cli');
const BASE_CMD = 'influxdb3';
const DEBUG = true; // Set to true for verbose logging

// Debug logging function
function debug(message, data) {
  if (DEBUG) {
    console.log(`DEBUG: ${message}`);
    if (data) console.log(JSON.stringify(data, null, 2));
  }
}

// Function to remove ANSI escape codes
function stripAnsiCodes(str) {
  // Regular expression to match ANSI escape codes
  // eslint-disable-next-line no-control-regex
  return str.replace(/[][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '');
}

// Ensure output directories exist
function ensureDirectoryExistence(filePath) {
  const dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return true;
  }
  ensureDirectoryExistence(dirname);
  fs.mkdirSync(dirname);
}

// Get all available commands and subcommands
function getCommands() {
  try {
    debug('Getting base commands');
    let helpOutput = execSync(`${BASE_CMD} --help`).toString();
    helpOutput = stripAnsiCodes(helpOutput); // Strip ANSI codes
    debug('Cleaned help output received', helpOutput);
    
    // Find all command sections (Common Commands, Resource Management, etc.)
    const commandSections = helpOutput.match(/^[A-Za-z\s]+:\s*$([\s\S]+?)(?=^[A-Za-z\s]+:\s*$|\n\s*$|\n[A-Z]|\n\n|$)/gm);
    
    if (!commandSections || commandSections.length === 0) {
      debug('No command sections found in help output');
      return [];
    }
    
    debug(`Found ${commandSections.length} command sections`);
    
    let commands = [];
    
    // Process each section to extract commands
    commandSections.forEach(section => {
      // Extract command lines (ignoring section headers)
      const cmdLines = section.split('\n')
        .slice(1) // Skip the section header
        .map(line => line.trim())
        .filter(line => line && !line.startsWith('-') && !line.startsWith('#')); // Skip empty lines, flags and comments
      
      debug('Command lines in section', cmdLines);
      
      // Extract command names and descriptions
      cmdLines.forEach(line => {
        // Handle commands with aliases (like "query, q")
        const aliasMatch = line.match(/^\s*([a-zA-Z0-9_,-\s]+?)\s{2,}(.+)$/);
        
        if (aliasMatch) {
          // Get primary command and any aliases
          const commandParts = aliasMatch[1].split(',').map(cmd => cmd.trim());
          const primaryCmd = commandParts[0]; // Use the first as primary
          const description = aliasMatch[2].trim();
          
          commands.push({ 
            cmd: primaryCmd, 
            description: description 
          });
          
          debug(`Added command: ${primaryCmd} - ${description}`);
        }
      });
    });
    
    debug('Extracted commands', commands);
    return commands;
  } catch (error) {
    console.error('Error getting commands:', error.message);
    if (DEBUG) console.error(error.stack);
    return [];
  }
}

// Get subcommands for a specific command
function getSubcommands(cmd) {
  try {
    debug(`Getting subcommands for: ${cmd}`);
    let helpOutput = execSync(`${BASE_CMD} ${cmd} --help`).toString();
    helpOutput = stripAnsiCodes(helpOutput); // Strip ANSI codes
    debug(`Cleaned help output for ${cmd} received`, helpOutput);
    
    // Look for sections containing commands (similar to top-level help)
    // First try to find a dedicated Commands: section
    let subcommands = [];
    
    // Try to find a dedicated "Commands:" section first
    const commandsMatch = helpOutput.match(/Commands:\s+([\s\S]+?)(?=^[A-Za-z\s]+:\s*$|\n\s*$|\n[A-Z]|\n\n|$)/m);
    
    if (commandsMatch) {
      debug(`Found dedicated Commands section for ${cmd}`);
      const cmdLines = commandsMatch[1].split('\n')
        .map(line => line.trim())
        .filter(line => line && !line.startsWith('-') && !line.startsWith('#')); // Skip empty lines, flags, comments
      
      cmdLines.forEach(line => {
        const match = line.match(/^\s*([a-zA-Z0-9_,-\s]+?)\s{2,}(.+)$/);
        if (match) {
          // Get primary command name (before any commas for aliases)
          const commandName = match[1].split(',')[0].trim();
          const description = match[2].trim();
          
          subcommands.push({
            cmd: `${cmd} ${commandName}`,
            description: description
          });
          
          debug(`Added subcommand: ${cmd} ${commandName} - ${description}`);
        }
      });
    } else {
      // Look for sections like "Common Commands:", "Resource Management:", etc.
      const sectionMatches = helpOutput.match(/^[A-Za-z\s]+:\s*$([\s\S]+?)(?=^[A-Za-z\s]+:\s*$|\n\s*$|\n[A-Z]|\n\n|$)/gm);
      
      if (sectionMatches) {
        debug(`Found ${sectionMatches.length} sections with potential commands for ${cmd}`);
        
        sectionMatches.forEach(section => {
          const cmdLines = section.split('\n')
            .slice(1) // Skip the section header
            .map(line => line.trim())
            .filter(line => line && !line.startsWith('-') && !line.startsWith('#')); // Skip empty lines, flags, comments
          
          cmdLines.forEach(line => {
            const match = line.match(/^\s*([a-zA-Z0-9_,-\s]+?)\s{2,}(.+)$/);
            if (match) {
              // Get primary command name (before any commas for aliases)
              const commandName = match[1].split(',')[0].trim();
              const description = match[2].trim();
              
              subcommands.push({
                cmd: `${cmd} ${commandName}`,
                description: description
              });
              
              debug(`Added subcommand from section: ${cmd} ${commandName} - ${description}`);
            }
          });
        });
      }
    }
    
    debug(`Extracted ${subcommands.length} subcommands for ${cmd}`, subcommands);
    return subcommands;
  } catch (error) {
    debug(`Error getting subcommands for ${cmd}:`, error.message);
    return [];
  }
}

// Helper functions to generate descriptions for different command types
function getQueryDescription(cmd, fullCmd) {
  return ` executes a query against a running {{< product-name >}} server.`;
}

function getWriteDescription(cmd, fullCmd) {
  return ` writes data to a running {{< product-name >}} server.`;
}

function getShowDescription(cmd, fullCmd) {
  const cmdParts = cmd.split(' ');
  const resourceType = cmdParts.length > 1 ? cmdParts[1] : 'resources';
  return ` lists ${resourceType} in your {{< product-name >}} server.`;
}

function getCreateDescription(cmd, fullCmd) {
  const cmdParts = cmd.split(' ');
  const createType = cmdParts.length > 1 ? cmdParts[1] : 'resources';
  return ` creates ${createType} in your {{< product-name >}} server.`;
}

function getDeleteDescription(cmd, fullCmd) {
  const cmdParts = cmd.split(' ');
  const deleteType = cmdParts.length > 1 ? cmdParts[1] : 'resources';
  return ` deletes ${deleteType} from your {{< product-name >}} server.`;
}

function getServeDescription(cmd, fullCmd) {
  return ` starts the {{< product-name >}} server.`;
}

function getDefaultDescription(cmd, fullCmd) {
  return `.`;
}

// Helper functions to generate examples for different command types
function getQueryExample(cmd) {
  return {
    title: 'Query data using SQL',
    code: `${BASE_CMD} ${cmd} --database DATABASE_NAME "SELECT * FROM home"`
  };
}

function getWriteExample(cmd) {
  return {
    title: 'Write data from a file',
    code: `${BASE_CMD} ${cmd} --database DATABASE_NAME --file data.lp`
  };
}

function getShowExample(cmd) {
  const cmdParts = cmd.split(' ');
  const resourceType = cmdParts.length > 1 ? cmdParts[1] : 'resources';
  return {
    title: `List ${resourceType}`,
    code: `${BASE_CMD} ${cmd}`
  };
}

function getCreateExample(cmd) {
  const cmdParts = cmd.split(' ');
  const resourceType = cmdParts.length > 1 ? cmdParts[1] : 'resource';
  return {
    title: `Create a new ${resourceType}`,
    code: `${BASE_CMD} ${cmd} --name new-${resourceType}-name`
  };
}

function getDeleteExample(cmd) {
  const cmdParts = cmd.split(' ');
  const resourceType = cmdParts.length > 1 ? cmdParts[1] : 'resource';
  return {
    title: `Delete a ${resourceType}`,
    code: `${BASE_CMD} ${cmd} --name ${resourceType}-to-delete`
  };
}

function getServeExample(cmd) {
  return {
    title: 'Start the InfluxDB server',
    code: `${BASE_CMD} serve --node-id my-node --object-store file --data-dir ~/.influxdb3_data`
  };
}

function getDefaultExample(fullCmd, cmd) {
  return {
    title: `Run the ${fullCmd} command`,
    code: `${BASE_CMD} ${cmd}`
  };
}

// Generate frontmatter for a command
function generateFrontmatter(cmd) {
  const parts = cmd.split(' ');
  const lastPart = parts[parts.length - 1];
  const fullCmd = cmd === '' ? BASE_CMD : `${BASE_CMD} ${cmd}`;
  
  // Determine a good description based on the command
  let description = '';
  if (cmd === '') {
    description = `The ${BASE_CMD} CLI runs and interacts with the {{< product-name >}} server.`;
  } else {
    const cmdParts = cmd.split(' ');
    const lastCmd = cmdParts[cmdParts.length - 1];
    
    // Use the description helper functions for consistency
    switch (lastCmd) {
      case 'query':
      case 'q':
        description = `The \`${fullCmd}\` command${getQueryDescription(cmd, fullCmd)}`;
        break;
      case 'write':
      case 'w':
        description = `The \`${fullCmd}\` command${getWriteDescription(cmd, fullCmd)}`;
        break;
      case 'show':
        description = `The \`${fullCmd}\` command${getShowDescription(cmd, fullCmd)}`;
        break;
      case 'create':
        description = `The \`${fullCmd}\` command${getCreateDescription(cmd, fullCmd)}`;
        break;
      case 'delete':
        description = `The \`${fullCmd}\` command${getDeleteDescription(cmd, fullCmd)}`;
        break;
      case 'serve':
        description = `The \`${fullCmd}\` command${getServeDescription(cmd, fullCmd)}`;
        break;
      default:
        description = `The \`${fullCmd}\` command${getDefaultDescription(cmd, fullCmd)}`;
    }
  }
  
  // Create the frontmatter
  let frontmatter = `---
title: ${fullCmd}
description: >
  ${description}
`;

  // Add source attribute for shared files
  if (cmd !== '') {
    // Build the path relative to the /content/shared/influxdb3-cli/ directory
    const relativePath = cmd.split(' ').join('/');
    frontmatter += `source: /shared/influxdb3-cli/${relativePath === '' ? '_index' : relativePath}.md
`;
  }

  // Close the frontmatter
  frontmatter += `---

`;

  return frontmatter;
}

// Generate Markdown for a command
function generateCommandMarkdown(cmd) {
  try {
    debug(`Generating markdown for command: ${cmd}`);
    const fullCmd = cmd === '' ? BASE_CMD : `${BASE_CMD} ${cmd}`;
    let helpOutput = execSync(`${fullCmd} --help`).toString();
    helpOutput = stripAnsiCodes(helpOutput); // Strip ANSI codes
    debug(`Cleaned help output for ${fullCmd} received`, helpOutput);

    // Extract sections from help output
    const usageMatch = helpOutput.match(/Usage:\s+([\s\S]+?)(?:\n\n|$)/);
    const usage = usageMatch ? usageMatch[1].trim() : '';

    const argsMatch = helpOutput.match(/Arguments:\s+([\s\S]+?)(?:\n\n|$)/);
    const args = argsMatch ? argsMatch[1].trim() : '';

    // Store option sections separately
    const optionSections = {};
    const optionSectionRegex = /^([A-Za-z\s]+ Options?|Required):\s*$([\s\S]+?)(?=\n^[A-Za-z\s]+:|^$|\n\n)/gm;
    let sectionMatch;
    while ((sectionMatch = optionSectionRegex.exec(helpOutput)) !== null) {
      const sectionTitle = sectionMatch[1].trim();
      const sectionContent = sectionMatch[2].trim();
      debug(`Found option section: ${sectionTitle}`);
      optionSections[sectionTitle] = sectionContent;
    }

    // Fallback if no specific sections found
    if (Object.keys(optionSections).length === 0) {
        const flagsMatch = helpOutput.match(/(?:Flags|Options):\s+([\s\S]+?)(?:\n\n|$)/);
        if (flagsMatch) {
            debug('Using fallback Flags/Options section');
            optionSections['Options'] = flagsMatch[1].trim();
        }
    }
    debug('Extracted option sections', optionSections);


    // Format flags as a table, processing sections and handling duplicates/multi-lines
    let flagsTable = '';
    const addedFlags = new Set(); // Track added long flags
    const tableRows = [];
    const sectionOrder = ['Required', ...Object.keys(optionSections).filter(k => k !== 'Required')]; // Prioritize Required

    for (const sectionTitle of sectionOrder) {
        if (!optionSections[sectionTitle]) continue;

        const sectionContent = optionSections[sectionTitle];
        const lines = sectionContent.split('\n');
        let i = 0;
        while (i < lines.length) {
            const line = lines[i];
            // Regex to capture flag and start of description
            const flagMatch = line.match(/^\s+(?:(-\w),\s+)?(--[\w-]+(?:[=\s]<[^>]+>)?)?\s*(.*)/);


            if (flagMatch) {
                const shortFlag = flagMatch[1] || '';
                const longFlagRaw = flagMatch[2] || ''; // Might be empty if only short flag exists (unlikely here)
                const longFlag = longFlagRaw.split(/[=\s]/)[0]; // Get only the flag name, e.g., --cluster-id from --cluster-id <CLUSTER_ID>
                let description = flagMatch[3].trim();

                // Check for multi-line description (indented lines following)
                let j = i + 1;
                while (j < lines.length && lines[j].match(/^\s{4,}/)) { // Look for lines with significant indentation
                    description += ' ' + lines[j].trim();
                    j++;
                }
                i = j; // Move main index past the multi-line description

                // Clean description
                description = description
                    .replace(/\s+\[default:.*?\]/g, '')
                    .replace(/\s+\[env:.*?\]/g, '')
                    .replace(/\s+\[possible values:.*?\]/g, '')
                    .trim();

                // Check if required based on section
                const isRequired = sectionTitle === 'Required';

                // Add to table if not already added
                if (longFlag && !addedFlags.has(longFlag)) {
                    // Use longFlagRaw which includes the placeholder for display
                    tableRows.push(`| \`${shortFlag}\` | \`${longFlagRaw.trim()}\` | ${isRequired ? '_({{< req >}})_ ' : ''}${description} |`);
                    addedFlags.add(longFlag);
                    debug(`Added flag: ${longFlag} (Required: ${isRequired})`);
                } else if (!longFlag && shortFlag && !addedFlags.has(shortFlag)) {
                     // Handle case where only short flag might exist (though unlikely for this CLI)
                     tableRows.push(`| \`${shortFlag}\` |  | ${isRequired ? '_({{< req >}})_ ' : ''}${description} |`);
                     addedFlags.add(shortFlag); // Use short flag for tracking if no long flag
                     debug(`Added flag: ${shortFlag} (Required: ${isRequired})`);
                } else if (longFlag) {
                    debug(`Skipping duplicate flag: ${longFlag}`);
                } else {
                     debug(`Skipping flag line with no long or short flag found: ${line}`);
                }
            } else {
                debug(`Could not parse flag line in section "${sectionTitle}": ${line}`);
                i++; // Move to next line if current one doesn't match
            }
        }
    }


    if (tableRows.length > 0) {
      // Sort rows alphabetically by long flag, putting required flags first
      tableRows.sort((a, b) => {
        const isARequired = a.includes('_({{< req >}})_');
        const isBRequired = b.includes('_({{< req >}})_');
        if (isARequired && !isBRequired) return -1;
        if (!isARequired && isBRequired) return 1;
        // Extract long flag for sorting (second column content between backticks)
        const longFlagA = (a.match(/\|\s*`.*?`\s*\|\s*`(--[\w-]+)/) || [])[1] || '';
        const longFlagB = (b.match(/\|\s*`.*?`\s*\|\s*`(--[\w-]+)/) || [])[1] || '';
        return longFlagA.localeCompare(longFlagB);
      });
      flagsTable = `| Short | Long | Description |\n| :---- | :--- | :---------- |\n${tableRows.join('\n')}`;
    }


    // Extract description from help text (appears before Usage section or other sections)
    let descriptionText = '';
    // Updated regex to stop before any known section header
    const descMatches = helpOutput.match(/^([\s\S]+?)(?=Usage:|Common Commands:|Examples:|Options:|Flags:|Required:|Arguments:|$)/);
    if (descMatches && descMatches[1]) {
      descriptionText = descMatches[1].trim();
    }

    // Example commands
    const examples = [];
    // Updated regex to stop before any known section header
    const exampleMatch = helpOutput.match(/(?:Example|Examples):\s*([\s\S]+?)(?=\n\n|Usage:|Options:|Flags:|Required:|Arguments:|$)/i);

    if (exampleMatch) {
      // Found examples in help output, use them
      const exampleBlocks = exampleMatch[1].trim().split(/\n\s*#\s+/); // Split by lines starting with # (section comments)

      exampleBlocks.forEach((block, index) => {
          const lines = block.trim().split('\n');
          const titleLine = lines[0].startsWith('#') ? lines[0].substring(1).trim() : `Example ${index + 1}`;
          const codeLines = lines.slice(titleLine === `Example ${index + 1}` ? 0 : 1) // Skip title line if we extracted it
                                .map(line => line.replace(/^\s*\d+\.\s*/, '').trim()) // Remove numbering like "1. "
                                .filter(line => line);
          if (codeLines.length > 0) {
             examples.push({ title: titleLine, code: codeLines.join('\n') });
          }
      });

    } else {
      // Fallback example generation
      if (cmd === '') {
        // ... (existing base command examples) ...
      } else {
        // ... (existing command-specific example generation using helpers) ...
      }
    }

    // Construct markdown content
    const frontmatter = generateFrontmatter(cmd);
    let markdown = frontmatter;

    markdown += `The \`${fullCmd}\` command`;

    // Use extracted description if available, otherwise fallback
    if (descriptionText) {
      markdown += ` ${descriptionText.toLowerCase().replace(/\.$/, '')}.`;
    } else if (cmd === '') {
      markdown += ` runs and interacts with the {{< product-name >}} server.`;
    } else {
      // Fallback description generation using helpers
      const cmdParts = cmd.split(' ');
      const lastCmd = cmdParts[cmdParts.length - 1];
      switch (lastCmd) {
        case 'query': case 'q': markdown += getQueryDescription(cmd, fullCmd); break;
        case 'write': case 'w': markdown += getWriteDescription(cmd, fullCmd); break;
        case 'show': markdown += getShowDescription(cmd, fullCmd); break;
        case 'create': markdown += getCreateDescription(cmd, fullCmd); break;
        case 'delete': markdown += getDeleteDescription(cmd, fullCmd); break;
        case 'serve': markdown += getServeDescription(cmd, fullCmd); break;
        default: markdown += getDefaultDescription(cmd, fullCmd);
      }
    }

    markdown += `\n\n## Usage\n\n<!--pytest.mark.skip-->\n\n\`\`\`bash\n${usage}\n\`\`\`\n\n`;

    if (args) {
      markdown += `## Arguments\n\n${args}\n\n`;
    }

    if (flagsTable) {
      markdown += `## Options\n\n${flagsTable}\n\n`;
    }

    if (examples.length > 0) {
      markdown += `## Examples\n\n`;
      examples.forEach(ex => {
        markdown += `### ${ex.title}\n\n<!--pytest.mark.skip-->\n\n\`\`\`bash\n${ex.code}\n\`\`\`\n\n`;
      });
    }

    return markdown;
  } catch (error) {
    console.error(`Error generating markdown for '${cmd}':`, error.message);
    if (DEBUG) console.error(error.stack);
    return null;
  }
}

// Generate reference page with proper frontmatter that imports from shared content
function generateReferencePage(cmd, product) {
  // Skip the base command since it's not typically needed as a reference
  if (cmd === '') {
    return null;
  }
  
  const parts = cmd.split(' ');
  const fullCmd = cmd === '' ? BASE_CMD : `${BASE_CMD} ${cmd}`;
  
  // Build the appropriate menu path
  let menuParent;
  if (parts.length === 1) {
    menuParent = 'influxdb3'; // Top-level command
  } else {
    // For nested commands, the parent is the command's parent command
    menuParent = `influxdb3 ${parts.slice(0, -1).join(' ')}`;
  }
  
  // Determine a good description
  let description;
  const lastCmd = parts.length > 0 ? parts[parts.length - 1] : '';
  
  switch (lastCmd) {
    case 'query':
    case 'q':
      description = `Use the ${fullCmd} command to query data in your {{< product-name >}} instance.`;
      break;
    case 'write':
    case 'w':
      description = `Use the ${fullCmd} command to write data to your {{< product-name >}} instance.`;
      break;
    case 'show':
      const showType = parts.length > 1 ? parts[1] : 'resources';
      description = `Use the ${fullCmd} command to list ${showType} in your {{< product-name >}} instance.`;
      break;
    case 'create':
      const createType = parts.length > 1 ? parts[1] : 'resources';
      description = `Use the ${fullCmd} command to create ${createType} in your {{< product-name >}} instance.`;
      break;
    case 'delete':
      const deleteType = parts.length > 1 ? parts[1] : 'resources';
      description = `Use the ${fullCmd} command to delete ${deleteType} from your {{< product-name >}} instance.`;
      break;
    case 'serve':
      description = `Use the ${fullCmd} command to start and run your {{< product-name >}} server.`;
      break;
    default:
      description = `Use the ${fullCmd} command.`;
  }
  
  // Build the path to the shared content
  const sharedPath = parts.join('/');
  
  // Create the frontmatter for the reference page
  const frontmatter = `---
title: ${fullCmd}
description: >
  ${description}
menu:
  ${product}:
    parent: ${menuParent}
    name: ${fullCmd}
weight: 400
source: /shared/influxdb3-cli/${sharedPath}.md
---

<!-- The content for this page is at
// SOURCE content/shared/influxdb3-cli/${sharedPath}.md
-->`;

  return frontmatter;
}

// Create the reference page files for different product variants
async function createReferencePages(cmd) {
  if (cmd === '') return; // Skip the base command
  
  // Define the InfluxDB products that use this CLI
  const products = [
    { id: 'influxdb3_core', path: 'influxdb3/core' },
    { id: 'influxdb3_enterprise', path: 'influxdb3/enterprise' }
  ];
  
  // Generate reference pages for each product
  for (const product of products) {
    const frontmatter = generateReferencePage(cmd, product.id);
    if (!frontmatter) continue;
    
    const parts = cmd.split(' ');
    const cmdPath = parts.join('/');
    
    // Create the directory path for the reference file
    const refDirPath = path.join(__dirname, '..', 'content', product.path, 'reference', 'cli', 'influxdb3', ...parts.slice(0, -1));
    const refFilePath = path.join(refDirPath, `${parts[parts.length - 1]}.md`);
    
    // Create directory if it doesn't exist
    ensureDirectoryExistence(refFilePath);
    
    // Write the reference file
    fs.writeFileSync(refFilePath, frontmatter);
    console.log(`Generated reference page: ${refFilePath}`);
  }
}

// Process a command and its subcommands recursively
async function processCommand(cmd = '', depth = 0) {
  debug(`Processing command: "${cmd}" at depth ${depth}`);
  
  // Generate markdown for this command
  const markdown = generateCommandMarkdown(cmd);
  if (!markdown) {
    console.error(`Failed to generate markdown for command: ${cmd}`);
    return;
  }
  
  // Create file path and write content
  let filePath;
  if (cmd === '') {
    // Base command
    filePath = path.join(OUTPUT_DIR, '_index.md');
  } else {
    const parts = cmd.split(' ');
    const dirPath = path.join(OUTPUT_DIR, ...parts.slice(0, -1));
    const fileName = parts[parts.length - 1] === '' ? '_index.md' : `${parts[parts.length - 1]}.md`;
    filePath = path.join(dirPath, fileName);
    
    // For commands with subcommands, also create an index file
    if (depth < 3) {  // Limit recursion depth
      try {
        const subcommandOutput = execSync(`${BASE_CMD} ${cmd} --help`).toString();
        if (subcommandOutput.includes('Commands:')) {
          const subDirPath = path.join(OUTPUT_DIR, ...parts);
          const indexFilePath = path.join(subDirPath, '_index.md');
          ensureDirectoryExistence(indexFilePath);
          fs.writeFileSync(indexFilePath, markdown);
          debug(`Created index file: ${indexFilePath}`);
        }
      } catch (error) {
        debug(`Error checking for subcommands: ${error.message}`);
      }
    }
  }
  
  ensureDirectoryExistence(filePath);
  fs.writeFileSync(filePath, markdown);
  console.log(`Generated: ${filePath}`);
  
  // Create reference pages for this command
  await createReferencePages(cmd);
  
  // Get and process subcommands
  if (depth < 3) {  // Limit recursion depth
    const subcommands = getSubcommands(cmd);
    debug(`Found ${subcommands.length} subcommands for "${cmd}"`);
    
    for (const subCmd of subcommands) {
      await processCommand(subCmd.cmd, depth + 1);
    }
  }
}

// Main function
async function main() {
  try {
    debug('Starting documentation generation');
    
    // Process base command
    await processCommand();
    
    // Get top-level commands
    const commands = getCommands();
    debug(`Found ${commands.length} top-level commands`);
    
    if (commands.length === 0) {
      console.warn('Warning: No commands were found. Check the influxdb3 CLI help output format.');
    }
    
    // Process each top-level command
    for (const { cmd } of commands) {
      await processCommand(cmd, 1);
    }
    
    console.log('Documentation generation complete!');
  } catch (error) {
    console.error('Error in main execution:', error.message);
    if (DEBUG) console.error(error.stack);
  }
}

// Run the script
main();