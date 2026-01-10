/**
 * Get Skill Tool - Load a skill by name or find skills for a domain
 */

import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { loadSkill, getAllSkills, loadToolset } from '../utils/content-loader.js';

// Skill category keywords for matching
const SKILL_KEYWORDS: Record<string, string[]> = {
  research: ['search', 'find', 'discover', 'explore', 'investigate', 'lookup', 'research'],
  analysis: ['analyze', 'review', 'assess', 'evaluate', 'compare', 'model', 'risk'],
  creation: ['create', 'generate', 'write', 'build', 'draft', 'produce', 'document'],
  evaluation: ['check', 'verify', 'audit', 'test', 'validate', 'quality', 'security', 'compliance'],
  orchestration: ['coordinate', 'plan', 'handoff', 'decompose', 'track', 'summarize'],
  utility: ['help', 'discover', 'navigate', 'learn'],
};

export const getSkillTool: Tool = {
  name: 'get_skill',
  description: 'Load an AI Mantras skill by exact name or find the best match for a task. Skills are actionable capabilities that personas can invoke.',
  inputSchema: {
    type: 'object',
    properties: {
      name: {
        type: 'string',
        description: 'Exact skill name (e.g., "web-search", "code-review", "task-decomposition")',
      },
      task: {
        type: 'string',
        description: 'Task description to match (e.g., "search the web", "review code for security")',
      },
      category: {
        type: 'string',
        enum: ['research', 'analysis', 'creation', 'evaluation', 'orchestration', 'utility'],
        description: 'Filter skills by category',
      },
      list_all: {
        type: 'boolean',
        description: 'If true, returns the skills toolset index instead of a specific skill',
      },
    },
  },
};

export async function handleGetSkill(
  args: Record<string, unknown>
): Promise<string> {
  const name = args.name as string | undefined;
  const task = args.task as string | undefined;
  const category = args.category as string | undefined;
  const listAll = args.list_all as boolean | undefined;

  // If list_all, return the toolset
  if (listAll) {
    return loadToolset();
  }

  // If name provided, load directly
  if (name) {
    try {
      return loadSkill(name);
    } catch {
      // If not found, suggest similar skills
      const allSkills = getAllSkills();
      const suggestions: string[] = [];

      for (const { skills } of allSkills) {
        for (const skill of skills) {
          if (skill.name.toLowerCase().includes(name.toLowerCase()) ||
              name.toLowerCase().includes(skill.name.toLowerCase())) {
            suggestions.push(skill.name);
          }
        }
      }

      if (suggestions.length > 0) {
        return `Skill "${name}" not found. Did you mean: ${suggestions.join(', ')}?`;
      }
      throw new Error(`Skill not found: ${name}`);
    }
  }

  // If task provided, find matching skills
  if (task) {
    const taskLower = task.toLowerCase();
    const matchedSkills: { skill: string; category: string; purpose: string; score: number }[] = [];

    const allSkills = getAllSkills();
    for (const { category: cat, skills } of allSkills) {
      // Skip if category filter doesn't match
      if (category && cat !== category) {
        continue;
      }

      for (const skill of skills) {
        let score = 0;

        // Check skill name match
        if (taskLower.includes(skill.name.replace(/-/g, ' ')) ||
            taskLower.includes(skill.name.replace(/-/g, ''))) {
          score += 3;
        }

        // Check category keywords
        const keywords = SKILL_KEYWORDS[cat] || [];
        for (const keyword of keywords) {
          if (taskLower.includes(keyword)) {
            score += 1;
          }
        }

        // Check purpose match
        const purposeWords = skill.purpose.toLowerCase().split(/\s+/);
        for (const word of purposeWords) {
          if (word.length > 3 && taskLower.includes(word)) {
            score += 0.5;
          }
        }

        if (score > 0) {
          matchedSkills.push({
            skill: skill.name,
            category: cat,
            purpose: skill.purpose,
            score,
          });
        }
      }
    }

    if (matchedSkills.length === 0) {
      // Return all skills in the category if specified, otherwise list categories
      if (category) {
        const catSkills = allSkills.find(s => s.category === category);
        if (catSkills) {
          let response = `# ${category.charAt(0).toUpperCase() + category.slice(1)} Skills\n\n`;
          for (const skill of catSkills.skills) {
            response += `- **${skill.name}**: ${skill.purpose}\n`;
          }
          return response;
        }
      }
      return 'No matching skills found. Use list_all: true to see all available skills.';
    }

    // Sort by score and return top matches
    matchedSkills.sort((a, b) => b.score - a.score);

    if (matchedSkills.length === 1 || matchedSkills[0].score > matchedSkills[1]?.score * 1.5) {
      // Clear winner - load it
      return loadSkill(matchedSkills[0].skill);
    }

    // Multiple good matches - list them
    let response = `# Skills Matching: "${task}"\n\n`;
    response += 'Multiple skills match your task. Here are the top matches:\n\n';

    for (const match of matchedSkills.slice(0, 5)) {
      response += `## ${match.skill} (${match.category})\n`;
      response += `${match.purpose}\n\n`;
    }

    response += '\nUse `get_skill` with a specific `name` to load one of these skills.';
    return response;
  }

  // If only category provided, list skills in that category
  if (category) {
    const allSkills = getAllSkills();
    const catSkills = allSkills.find(s => s.category === category);

    if (!catSkills) {
      return `Category "${category}" not found. Valid categories: research, analysis, creation, evaluation, orchestration, utility`;
    }

    let response = `# ${category.charAt(0).toUpperCase() + category.slice(1)} Skills\n\n`;
    for (const skill of catSkills.skills) {
      response += `## ${skill.name}\n`;
      response += `${skill.purpose}\n\n`;
    }
    return response;
  }

  // No parameters - return summary
  const allSkills = getAllSkills();
  let response = '# AI Mantras Skills\n\n';
  response += 'Skills are actionable capabilities that personas can invoke.\n\n';
  response += '## Categories\n\n';

  for (const { category: cat, skills } of allSkills) {
    response += `### ${cat.charAt(0).toUpperCase() + cat.slice(1)} (${skills.length} skills)\n`;
    for (const skill of skills) {
      response += `- **${skill.name}**: ${skill.purpose}\n`;
    }
    response += '\n';
  }

  response += '\nUse `name` to load a specific skill, `task` to find matching skills, or `list_all: true` for the full toolset.';
  return response;
}
