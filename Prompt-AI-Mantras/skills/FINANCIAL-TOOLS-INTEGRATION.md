# Financial Tools Integration Guide

This document explains how Python financial analysis tools are integrated into the AIMantras framework through Skills.

## Overview

Python scripts for portfolio analysis can be made accessible to AIMantras personas through formalized Skills that bridge the cognitive framework with computational tools.

## Integrated Skills

### 1. Sharpe Ratio Calculation
**Skill File**: `skills/analysis/sharpe-ratio-calculation.md`
**Python Tool**: `scripts/sharpe.py`
**Purpose**: Calculate risk-adjusted returns for securities

**Primary Personas**: Clara, Simons, Markowitz
**Example Usage**:
```bash
python sharpe.py AAPL --period 1y --risk-free-rate 4.5
```

**AI Invocation Example**:
```
Persona: Clara. Task: Evaluate risk-adjusted returns for AAPL over 1 year.
Skill: sharpe-ratio-calculation.
Output: Risk assessment with Sharpe ratio, volatility, and recommendation.
```

### 2. Drawdown Analysis
**Skill File**: `skills/analysis/drawdown-analysis.md`
**Python Tool**: `scripts/drawdown.py`
**Purpose**: Analyze peak-to-trough declines and recovery patterns

**Primary Personas**: Taleb, Markowitz, Clara
**Example Usage**:
```bash
python drawdown.py TSLA --period 2y --show-history
```

**AI Invocation Example**:
```
Persona: Taleb. Task: Assess maximum loss exposure for TSLA position.
Skill: drawdown-analysis.
Output: Maximum drawdown, recovery time, current drawdown status.
```

### 3. Portfolio Stress Testing
**Skill File**: `skills/analysis/stress-testing.md`
**Python Tool**: `scripts/stress_test.py`
**Purpose**: Simulate portfolio performance under crisis scenarios

**Primary Personas**: Taleb, Markowitz
**Example Usage**:
```bash
# Run all scenarios
python stress_test.py

# Custom scenario
python stress_test.py --custom --market -20 --tech -40
```

**AI Invocation Example**:
```
Persona: Taleb. Task: Stress test portfolio against 2008-style crisis.
Skill: stress-testing.
Pattern: threat-modeling.
Output: Portfolio impact, limit violations, remediation plan.
```

### 4. Portfolio Analysis
**Skill File**: `skills/analysis/portfolio-analysis.md`
**Python Tools**: `scripts/portfolio.py`, `scripts/portfolio_multicurrency.py`, `scripts/journal.py`
**Purpose**: Comprehensive portfolio monitoring and analysis

**Primary Personas**: Markowitz, Taleb
**Example Usage**:
```bash
# Holdings overview
python portfolio.py

# Multi-currency consolidation
python portfolio_multicurrency.py --currency USD

# Transaction journal
python journal.py --from 2024-01-01 --to 2024-12-31
```

**AI Invocation Example**:
```
Persona: Markowitz. Task: Review current portfolio allocations and identify rebalancing needs.
Skill: portfolio-analysis.
Output: Position breakdown, limit compliance, rebalancing recommendations.
```

## Additional Available Tools

The following tools are also available but not yet formalized into Skills (can be added as needed):

| Tool | Purpose | Potential Skill Category |
|------|---------|------------------------|
| `correlation.py` | Analyze correlation between securities | `analysis/correlation-analysis.md` |
| `scenarios.py` | Scenario definitions for stress testing | (Library, used by stress_test.py) |
| `fetch_history.py` | Fetch historical price data | `research/market-data-fetching.md` |
| `fetch_financials.py` | Fetch fundamental data | `research/fundamental-analysis.md` |
| `fetch_earnings.py` | Fetch earnings data | `research/earnings-analysis.md` |
| `fetch_fx.py` | Fetch FX rates | `analysis/currency-analysis.md` |
| `fetch_news.py` | Fetch news and sentiment | `research/news-analysis.md` |
| `check_limits.py` | Verify position limit compliance | (Built into portfolio-analysis) |

## How AI Agents Use These Skills

### 1. Skill Discovery
Personas reference skills in their skill lists:
```markdown
## Available Skills
**Primary Skills:**
- `skills/analysis/sharpe-ratio-calculation.md`
- `skills/analysis/stress-testing.md`
```

### 2. Skill Invocation
When a task requires quantitative analysis:
```
User: "What's the risk-adjusted return for AAPL?"

Clara internally:
1. Recognizes need for Sharpe ratio calculation
2. References skill file for invocation syntax
3. Executes: python sharpe.py AAPL --period 1y
4. Parses output and interprets results
5. Formulates response with investment recommendation
```

### 3. Multi-Skill Workflows
Complex tasks chain multiple skills:
```
User: "Evaluate TSLA for addition to portfolio"

Clara's workflow:
1. sharpe-ratio-calculation.md → Risk-adjusted returns
2. drawdown-analysis.md → Downside risk assessment
3. stress-testing.md → Impact on portfolio if added
4. comparative-analysis.md → Compare vs. sector ETF alternative
5. Report → Integrated recommendation with evidence
```

## Persona-Skill Mappings

### Clara (Financial Analyst)
- **Primary**: sharpe-ratio-calculation, drawdown-analysis, financial-modeling
- **Secondary**: portfolio-analysis, comparative-analysis
- **Use Cases**: Single security evaluation, investment recommendations

### Simons (Quant Researcher)
- **Primary**: sharpe-ratio-calculation, data-analysis, code-generation
- **Secondary**: drawdown-analysis, literature-review
- **Use Cases**: Strategy validation, backtest analysis, signal evaluation

### Markowitz (Portfolio Manager)
- **Primary**: portfolio-analysis, stress-testing, risk-assessment
- **Secondary**: sharpe-ratio-calculation, comparative-analysis
- **Use Cases**: Capital allocation, rebalancing, strategy lifecycle management

### Taleb (Risk Manager)
- **Primary**: stress-testing, drawdown-analysis, risk-assessment
- **Secondary**: portfolio-analysis, compliance-review
- **Use Cases**: Risk monitoring, limit enforcement, crisis preparedness

### Thorp (Execution Trader)
- **Primary**: data-analysis (for TCA), comparative-analysis (venues)
- **Use Cases**: Transaction cost analysis, execution quality monitoring

### Nightingale (Data Engineer)
- **Primary**: data-analysis, code-generation
- **Use Cases**: Data quality validation, pipeline maintenance

### Schapiro (Compliance Officer)
- **Primary**: compliance-review, risk-assessment
- **Secondary**: portfolio-analysis (for limit checks)
- **Use Cases**: Policy enforcement, surveillance monitoring

## Creating New Skills from Python Tools

To integrate additional Python tools, follow this template:

1. **Create Skill File**: `skills/<category>/<skill-name>.md`
2. **Follow Structure**:
   - Purpose
   - When to Use
   - Inputs Required
   - Outputs Produced
   - Invocation (with Python command examples)
   - Constraints
   - Interpretation Guidelines
   - Example Usage
   - Recommended Personas
   - Related Skills

3. **Update Toolset**: Add entry to `skills/toolset.md`
4. **Update Personas**: Reference in persona skill lists
5. **Document Patterns**: Show which reasoning patterns pair well with this skill

## Example: Adding Correlation Analysis Skill

```markdown
# Correlation Analysis

## Purpose
Calculate correlation coefficients between securities to assess diversification benefits.

## Invocation
```bash
python correlation.py AAPL MSFT QQQ --period 1y
```

## Recommended Personas
- Markowitz (Portfolio Manager): Diversification analysis
- Taleb (Risk Manager): Concentration risk assessment
```

Then update:
- `skills/toolset.md`: Add to Analysis Skills table
- Persona files: Add to Markowitz and Taleb's primary/secondary skills
- Manifest: `ai-mantras-manifest.yaml` if using MCP integration

## Benefits of This Integration

### For AI Agents
- **Concrete Tools**: Access to real computation, not just reasoning
- **Reproducibility**: Standardized calculations with documented methods
- **Evidence-Based**: Numerical backing for recommendations

### For Users
- **Automation**: AI agents can run analyses autonomously
- **Consistency**: Same tools used every time, reducing errors
- **Auditability**: Clear trail from data → calculation → recommendation

### For Framework
- **Extensibility**: Easy to add new tools as needs evolve
- **Modularity**: Skills can be mixed and matched for complex workflows
- **Interoperability**: Python tools callable from any persona/pattern combination

## Next Steps

1. **Test Integration**: Try invoking skills through AI personas
2. **Add More Skills**: Formalize correlation, fundamental analysis, news analysis
3. **Create Workflows**: Document common multi-skill workflows
4. **MCP Integration**: Connect skills to MCP server for seamless invocation
