#!/usr/bin/env node

/**
 * Validate canonical agent instructions, skills, and generated adapters.
 */
import fs from 'fs';
import path from 'path';
import process from 'process';
import { execSync } from 'child_process';
import matter from 'gray-matter';
import {
  buildAgentInstructionAdapters,
  buildPlatformReference,
  ensureClaudeSkillsSymlink,
} from './build-agent-instructions.js';

const PROJECT_ROOT = process.cwd();
const INSTRUCTIONS_DIR = path.join(PROJECT_ROOT, '.agents', 'instructions');
const SKILLS_DIR = path.join(PROJECT_ROOT, '.agents', 'skills');
const CLAUDE_SKILLS_PATH = path.join(PROJECT_ROOT, '.claude', 'skills');
const NAME_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const errors = [];

validateInstructions();
validateSkills();
validateClaudeSkillsSymlink();
await validateGeneratedAdapters();

if (errors.length > 0) {
  console.error('Agent instruction validation failed:');
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log('✅ Agent instructions and skills are valid');

function validateInstructions() {
  if (!fs.existsSync(INSTRUCTIONS_DIR)) {
    errors.push('.agents/instructions directory is missing');
    return;
  }

  for (const file of fs.readdirSync(INSTRUCTIONS_DIR).sort()) {
    if (!file.endsWith('.md')) continue;

    const filePath = path.join(INSTRUCTIONS_DIR, file);
    const parsed = matter.read(filePath);
    const expectedName = path.basename(file, '.md');
    const { name, description, paths } = parsed.data;
    const relPath = path.relative(PROJECT_ROOT, filePath);

    if (name !== expectedName) {
      errors.push(`${relPath} name must match file name (${expectedName})`);
    }

    if (!NAME_PATTERN.test(name || '')) {
      errors.push(`${relPath} name must be lower hyphen-case`);
    }

    if (!description || typeof description !== 'string') {
      errors.push(`${relPath} must define a description`);
    }

    if (!Array.isArray(paths) || paths.length === 0) {
      errors.push(`${relPath} must define one or more paths`);
    } else {
      for (const glob of paths) {
        if (typeof glob !== 'string' || glob.startsWith('/')) {
          errors.push(`${relPath} has invalid path glob: ${glob}`);
        }
      }
    }

    if (!parsed.content.trim()) {
      errors.push(`${relPath} must contain instruction body content`);
    }
  }
}

function validateSkills() {
  if (!fs.existsSync(SKILLS_DIR)) {
    errors.push('.agents/skills directory is missing');
    return;
  }

  const names = new Map();
  for (const entry of fs.readdirSync(SKILLS_DIR).sort()) {
    const skillDir = path.join(SKILLS_DIR, entry);
    if (!fs.statSync(skillDir).isDirectory()) continue;

    const skillPath = path.join(skillDir, 'SKILL.md');
    const relPath = path.relative(PROJECT_ROOT, skillPath);

    if (!fs.existsSync(skillPath)) {
      const relSkillDir = path.relative(PROJECT_ROOT, skillDir);
      errors.push(`${relSkillDir} is missing SKILL.md`);
      continue;
    }

    const parsed = matter.read(skillPath);
    const { name, description } = parsed.data;

    if (name !== entry) {
      errors.push(`${relPath} name must match directory name (${entry})`);
    }

    if (!NAME_PATTERN.test(name || '')) {
      errors.push(`${relPath} name must be lower hyphen-case`);
    }

    if (!description || typeof description !== 'string') {
      errors.push(`${relPath} must define a description`);
    }

    if (names.has(name)) {
      errors.push(`${relPath} duplicates skill name from ${names.get(name)}`);
    }
    names.set(name, relPath);
  }
}

function validateClaudeSkillsSymlink() {
  if (!fs.existsSync(CLAUDE_SKILLS_PATH)) {
    errors.push('.claude/skills symlink is missing');
    return;
  }

  const stat = fs.lstatSync(CLAUDE_SKILLS_PATH);
  if (!stat.isSymbolicLink()) {
    errors.push('.claude/skills must be a symlink to ../.agents/skills');
    return;
  }

  const target = fs.readlinkSync(CLAUDE_SKILLS_PATH);
  if (target !== '../.agents/skills') {
    errors.push(
      `.claude/skills points to ${target}, expected ../.agents/skills`
    );
  }
}

async function validateGeneratedAdapters() {
  const before = gitPorcelain();

  try {
    await buildPlatformReference();
    await buildAgentInstructionAdapters();
    ensureClaudeSkillsSymlink();
  } catch (error) {
    errors.push(error.message);
    return;
  }

  const after = gitPorcelain();
  if (after !== before) {
    errors.push(
      'generated agent instruction adapters are out of date; run yarn build:agent:instructions'
    );
  }
}

function gitPorcelain() {
  return execSync('git status --porcelain', {
    cwd: PROJECT_ROOT,
    encoding: 'utf8',
  });
}
