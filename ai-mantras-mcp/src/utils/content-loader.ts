/**
 * Content Loader - Reads markdown files from the content directory
 *
 * Priority:
 * 1. MANTRAS_CONTENT_PATH environment variable (for power users)
 * 2. Bundled content directory (default for npm users)
 */

import { readFileSync, existsSync, readdirSync, statSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { parse as parseYaml } from 'yaml';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Content path: env variable or bundled content
const CONTENT_PATH = process.env.MANTRAS_CONTENT_PATH || join(__dirname, '../../content');

export interface ManifestData {
  metadata: {
    name: string;
    version: string;
    description: string;
  };
  personas: {
    orchestration: { members: PersonaInfo[] };
    domain: { members: PersonaInfo[] };
    evaluation: { members: PersonaInfo[] };
  };
  patterns: {
    layer1_foundational: { members: PatternInfo[] };
    layer2_thinking_primitives: { members: PatternInfo[] };
    layer3_evaluation: { members: PatternInfo[] };
  };
  workflows: Record<string, WorkflowInfo>;
  complexity_tiers: Record<string, TierInfo>;
}

export interface PersonaInfo {
  name: string;
  path: string;
  purpose: string;
  style: string;
  expertise?: string[];
  recommended_patterns?: string[];
}

export interface PatternInfo {
  name: string;
  path: string;
  purpose: string;
  when_to_use?: string[];
}

export interface WorkflowInfo {
  name: string;
  description: string;
  flow: { step: number; actor: string; action: string }[];
}

export interface TierInfo {
  description: string;
  loads: string[];
  workflow: string;
}

let cachedManifest: ManifestData | null = null;

/**
 * Get the base content path
 */
export function getContentPath(): string {
  return CONTENT_PATH;
}

/**
 * Read a file from the content directory
 */
export function readContentFile(relativePath: string): string {
  const fullPath = join(CONTENT_PATH, relativePath);
  if (!existsSync(fullPath)) {
    throw new Error(`Content file not found: ${relativePath}`);
  }
  return readFileSync(fullPath, 'utf-8');
}

/**
 * Check if a content file exists
 */
export function contentFileExists(relativePath: string): boolean {
  return existsSync(join(CONTENT_PATH, relativePath));
}

/**
 * Load and parse the manifest YAML
 */
export function loadManifest(): ManifestData {
  if (cachedManifest) {
    return cachedManifest;
  }
  const content = readContentFile('ai-mantras-manifest.yaml');
  cachedManifest = parseYaml(content) as ManifestData;
  return cachedManifest;
}

/**
 * Load guiding principles
 */
export function loadPrinciples(): string {
  return readContentFile('Prompt-AI-Mantras/principles/guiding-principles.md');
}

/**
 * Load the bootstrapper document
 */
export function loadBootstrapper(): string {
  return readContentFile('Agent-bootstrapper.md');
}

/**
 * Load the entry point document
 */
export function loadEntryPoint(): string {
  return readContentFile('AIMantra.md');
}

/**
 * Load a persona by name
 */
export function loadPersona(name: string): string {
  const manifest = loadManifest();

  // Search all persona categories
  const categories = ['orchestration', 'domain', 'evaluation'] as const;
  for (const category of categories) {
    const personas = manifest.personas[category].members;
    const found = personas.find(p => p.name === name || p.name.toLowerCase() === name.toLowerCase());
    if (found) {
      return readContentFile(found.path);
    }
  }

  throw new Error(`Persona not found: ${name}`);
}

/**
 * Load a pattern by name
 */
export function loadPattern(name: string): string {
  const manifest = loadManifest();

  // Search all pattern layers
  const layers = ['layer1_foundational', 'layer2_thinking_primitives', 'layer3_evaluation'] as const;
  for (const layer of layers) {
    const patterns = manifest.patterns[layer].members;
    const found = patterns.find(p =>
      p.name === name ||
      p.name.toLowerCase() === name.toLowerCase() ||
      p.name.replace(/-/g, '_') === name.replace(/-/g, '_')
    );
    if (found) {
      return readContentFile(found.path);
    }
  }

  throw new Error(`Pattern not found: ${name}`);
}

/**
 * Get all personas with their metadata
 */
export function getAllPersonas(): { category: string; personas: PersonaInfo[] }[] {
  const manifest = loadManifest();
  return [
    { category: 'orchestration', personas: manifest.personas.orchestration.members },
    { category: 'domain', personas: manifest.personas.domain.members },
    { category: 'evaluation', personas: manifest.personas.evaluation.members }
  ];
}

/**
 * Get all patterns with their metadata
 */
export function getAllPatterns(): { layer: string; patterns: PatternInfo[] }[] {
  const manifest = loadManifest();
  return [
    { layer: 'layer1_foundational', patterns: manifest.patterns.layer1_foundational.members },
    { layer: 'layer2_thinking_primitives', patterns: manifest.patterns.layer2_thinking_primitives.members },
    { layer: 'layer3_evaluation', patterns: manifest.patterns.layer3_evaluation.members }
  ];
}

/**
 * Get workflow for a complexity tier
 */
export function getWorkflow(tier: 'simple' | 'moderate' | 'complex'): WorkflowInfo | undefined {
  const manifest = loadManifest();
  return manifest.workflows[tier];
}

/**
 * Get tier information
 */
export function getTierInfo(tier: 'simple' | 'moderate' | 'complex'): TierInfo | undefined {
  const manifest = loadManifest();
  return manifest.complexity_tiers[tier];
}
