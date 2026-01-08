#!/usr/bin/env node

/**
 * Build script: Copies AI Mantras content from parent repo into the MCP package.
 * This bundles the content at build time so the npm package is self-contained.
 */

import { existsSync, mkdirSync, cpSync, rmSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const packageRoot = join(__dirname, '..');
const parentRepo = join(packageRoot, '..');
const contentDest = join(packageRoot, 'content');

// Files and directories to copy from parent repo
const contentToCopy = [
  'AIMantra.md',
  'Agent-bootstrapper.md',
  'ai-mantras-manifest.yaml',
  'Prompt-AI-Mantras'
];

console.log('Copying AI Mantras content...');
console.log(`  Source: ${parentRepo}`);
console.log(`  Destination: ${contentDest}`);

// Clean existing content directory
if (existsSync(contentDest)) {
  rmSync(contentDest, { recursive: true });
}
mkdirSync(contentDest, { recursive: true });

// Copy each item
for (const item of contentToCopy) {
  const src = join(parentRepo, item);
  const dest = join(contentDest, item);

  if (existsSync(src)) {
    cpSync(src, dest, { recursive: true });
    console.log(`  Copied: ${item}`);
  } else {
    console.warn(`  Warning: ${item} not found at ${src}`);
  }
}

console.log('Content copy complete!');
