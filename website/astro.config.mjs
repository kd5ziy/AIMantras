import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
  site: 'https://aimantras.org',
  integrations: [
    starlight({
      title: 'AI Mantras',
      description: 'An AI prompt framework to help everyone think deeper and collaboratively.',
      logo: {
        src: './src/assets/logo.jpeg',
        alt: 'AI Mantras Logo'
      },
      social: [
        { icon: 'github', label: 'GitHub', href: 'https://github.com/kd5ziy/AIMantras' },
        { icon: 'external', label: 'ChatGPT Custom GPT', href: 'https://chatgpt.com/g/g-6981945caaa08191ac4540d162a89cb2-ai-mantras' },
      ],
      customCss: [
        './src/styles/custom.css',
      ],
      sidebar: [
        {
          label: 'Getting Started',
          items: [
            { label: 'Quick Start', slug: 'getting-started/quick-start' },
            { label: 'MCP Server Setup', slug: 'getting-started/mcp-server' },
            { label: 'Manual Setup', slug: 'getting-started/manual-setup' },
            { label: 'Building Agents', slug: 'getting-started/building-agents' },
          ],
        },
        {
          label: 'Personas',
          items: [
            { label: 'Overview', slug: 'personas' },
            {
              label: 'Orchestration',
              items: [
                { label: 'Hopper - Project Planner', slug: 'personas/orchestration/hopper-project-planner' },
                { label: 'Bernstein - Orchestrator', slug: 'personas/orchestration/bernstein-orchestrator' },
                { label: 'Lovell - Crisis Planner', slug: 'personas/orchestration/lovell-crisis-planner' },
              ],
            },
            {
              label: 'Domain',
              items: [
                { label: 'Clara - Financial Analyst', slug: 'personas/domain/clara-financial-analyst' },
                { label: 'Kestra - Systems Architect', slug: 'personas/domain/kestra-systems-architect' },
                { label: 'Watson - Medical Advisor', slug: 'personas/domain/watson-medical-advisor' },
                { label: 'Franklin - Deep Reasoner', slug: 'personas/domain/franklin-deep-reasoner' },
                { label: 'Goeth - Philosophical Synthesizer', slug: 'personas/domain/goeth-philosophical-synthesizer' },
                { label: 'Matsushita - CEO', slug: 'personas/domain/matsushita-ceo' },
                { label: 'Schneier - Blue Team', slug: 'personas/domain/schneier-blue-team' },
                { label: 'Mitnick - Red Team', slug: 'personas/domain/mitnick-red-team' },
                { label: 'Morris - Black Hat', slug: 'personas/domain/morris-black-hat' },
                { label: 'Pennyworth - Executive Assistant', slug: 'personas/domain/pennyworth-executive-assistant' },
                { label: 'LeHand - Executive Assistant', slug: 'personas/domain/lehand-executive-assistant' },
              ],
            },
            {
              label: 'Evaluation',
              items: [
                { label: 'Ada - QA Reviewer', slug: 'personas/evaluation/ada-qa-reviewer' },
                { label: 'Drucker - Goal Evaluator', slug: 'personas/evaluation/drucker-goal-evaluator' },
                { label: 'Rickover - Safety Evaluator', slug: 'personas/evaluation/rickover-safety-evaluator' },
              ],
            },
          ],
        },
        {
          label: 'Patterns',
          items: [
            { label: 'Overview', slug: 'patterns' },
            { label: 'Chain of Thought', slug: 'patterns/chain-of-thought' },
            { label: 'Planning Phase', slug: 'patterns/planning-phase' },
            { label: 'Orchestration', slug: 'patterns/orchestration' },
            { label: 'Graph Orchestration', slug: 'patterns/graph-orchestration' },
            { label: 'Recursive Self-Eval', slug: 'patterns/recursive-self-eval' },
            { label: 'Meta Rules', slug: 'patterns/meta-rules' },
            { label: 'Rule-Based Reasoning', slug: 'patterns/rule-based-reasoning' },
            { label: 'Guardrail Creative', slug: 'patterns/guardrail-creative' },
            { label: 'Agentic Loop', slug: 'patterns/agentic-loop' },
            { label: 'Criterion-Based Evaluation', slug: 'patterns/criterion-based-evaluation' },
            { label: 'Threat Modeling', slug: 'patterns/threat-modeling' },
          ],
        },
        {
          label: 'Skills',
          items: [
            { label: 'Overview', slug: 'skills' },
            { label: 'Research Skills', slug: 'skills/research' },
            { label: 'Analysis Skills', slug: 'skills/analysis' },
            { label: 'Creation Skills', slug: 'skills/creation' },
            { label: 'Evaluation Skills', slug: 'skills/evaluation' },
            { label: 'Orchestration Skills', slug: 'skills/orchestration' },
            { label: 'Utility Skills', slug: 'skills/utility' },
          ],
        },
        {
          label: 'Principles',
          items: [
            { label: 'Guiding Principles', slug: 'principles/guiding-principles' },
          ],
        },
        {
          label: 'Contributing',
          items: [
            { label: 'How to Contribute', slug: 'contributing' },
          ],
        },
      ],
      head: [
        {
          tag: 'meta',
          attrs: {
            property: 'og:image',
            content: '/logos/AIMantras-ChatBubble.jpeg',
          },
        },
      ],
    }),
  ],
});
