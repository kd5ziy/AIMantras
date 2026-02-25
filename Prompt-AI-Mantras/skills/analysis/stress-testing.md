# Portfolio Stress Testing

## Purpose
Evaluate portfolio resilience by simulating performance under adverse market scenarios including historical crises, factor shocks, and custom hypothetical events.

## When to Use
- Pre-trade risk assessment before adding new positions
- Regular portfolio health checks (weekly/monthly)
- Before major market events (earnings, FOMC, geopolitical risk)
- Validating portfolio stays within risk limits under stress
- Setting appropriate position sizes and hedging strategies
- Investor reporting and regulatory compliance (stress test requirements)

## Inputs Required
- **Portfolio Data**: DEGIRO CSV transaction history or position file
- **Scenario Type**: Historical, factor-based, thesis-driven, or custom
- **Specific Scenario**: Named scenario (e.g., "COVID Crash", "Tech Selloff")
- **Custom Shocks**: User-defined price impacts by ticker or sector

## Outputs Produced
For each scenario:
- **Portfolio Impact**: Current value → Stressed value ($ and % change)
- **Position-Level Impacts**: Top losers with shock percentages
- **Limit Violations**: Positions exceeding concentration limits under stress
- **Recovery Estimates**: Historical recovery time for similar events
- **Risk Assessment**: Severity rating (moderate, severe, extreme)
- **Summary Statistics**: Average impact across scenarios, worst case

## Invocation

### Using Python Script Directly
```bash
cd Prompt-AI-Mantras/scripts
python stress_test.py [OPTIONS]
```

### Standard Scenarios
```bash
# Run all predefined scenarios
python stress_test.py

# Run only historical crisis scenarios
python stress_test.py --type historical

# Run specific scenario by name
python stress_test.py --scenario "COVID Crash"

# Summary view only (skip detailed breakdowns)
python stress_test.py --summary
```

### Custom Scenarios
```bash
# Custom scenario: -20% market, -40% semis, -50% MU
python stress_test.py --custom --market -20 --semis -40 --mu -50

# Custom NVDA-specific shock
python stress_test.py --custom --nvda -35 --default -15
```

### Via Claude Code
When AI agents need to stress test portfolios, they should:
1. Navigate to `Prompt-AI-Mantras/scripts/`
2. Determine appropriate scenario type or build custom shocks
3. Execute Python script with portfolio CSV path
4. Parse structured output for each scenario
5. Identify limit violations and high-impact positions
6. Recommend portfolio adjustments or hedging strategies

## Constraints
- Requires transaction history CSV in DEGIRO format (or compatible format)
- Assumes current prices from yfinance (live market data required)
- Position limits defined in CLAUDE.md:
  - Max single position: 15%
  - Max sector exposure: 35%
  - Max speculative allocation: 15%
  - Min cash buffer: 5%
- Does not model correlation changes or liquidity constraints during stress
- Recovery time estimates based on historical precedents (not predictive)

## Scenario Categories

### Historical Scenarios
Real crisis events with documented shocks:
- **COVID Crash (March 2020)**: -34% market, severe sector dislocations
- **2008 Financial Crisis**: -50%+ market, -80% financials
- **Dot-com Crash (2000-2002)**: -78% tech, -49% market
- **Flash Crash (2015)**: Intraday -10% spike

### Factor-Based Scenarios
Systematic risk factor shocks:
- **Rate Spike**: +200 bps, growth stocks -25%, bonds -15%
- **Recession**: -30% market, cyclicals -40%, defensives -15%
- **Inflation Shock**: Commodities +30%, bonds -20%, growth -25%
- **Volatility Spike**: VIX to 50+, across-the-board deleveraging

### Thesis-Driven Scenarios
Specific investment thesis failure modes:
- **AI Bubble Pop**: NVDA -50%, AMD -45%, semis -40%
- **Memory Glut**: MU -50%, memory sector -45%
- **China Tariffs**: Semis -30%, Apple -25%, exporters -20%
- **Semiconductor Cycle Peak**: Mean reversion to historical valuations

### Custom Scenarios
User-defined shocks for:
- Earnings misses or guidance cuts
- Geopolitical events (Taiwan conflict, trade wars)
- Company-specific issues (product delays, competitive threats)
- Portfolio-specific risks unique to current holdings

## Interpretation Guidelines

### Portfolio Impact Severity
- **< -10%**: Moderate stress, within normal volatility
- **-10% to -20%**: Significant stress, elevated risk
- **-20% to -30%**: Severe stress, major losses
- **> -30%**: Extreme stress, portfolio survival at risk

### Limit Violations
- **Single Position >15%**: Concentration risk, diversify or hedge
- **Sector >35%**: Over-exposure to sector-specific risks
- **Speculative >15%**: Excessive risk in unproven holdings

### Recovery Time
- **< 6 months**: Rapid recovery, resilient portfolio
- **6-12 months**: Normal recovery, acceptable
- **1-2 years**: Slow recovery, test investor patience
- **> 2 years**: Prolonged recovery, reassess strategy

## Example Usage

### Pre-Trade Risk Check
```bash
# Before adding new semiconductor position
python stress_test.py --scenario "Memory Glut"
```
**Use Case**: Taleb (Risk Manager) checking if adding more semis exposure creates unacceptable concentration risk

### Weekly Risk Monitoring
```bash
# Run all scenarios to identify emerging risks
python stress_test.py --summary
```
**Use Case**: Markowitz (Portfolio Manager) weekly review to ensure portfolio stays within risk budget

### Custom Thesis Testing
```bash
# Test bearish thesis: AI hype deflates
python stress_test.py --custom --nvda -50 --market -20 --semis -35
```
**Use Case**: Simons (Quant Researcher) quantifying downside if AI bubble thesis proves correct

### Investor Reporting
```bash
# Generate stress test report for monthly investor letter
python stress_test.py --type historical > stress_test_report.txt
```
**Use Case**: Markowitz (Portfolio Manager) demonstrating risk awareness and preparedness

## Recommended Personas
- **Taleb** (Risk Manager): Primary - stress testing is core risk management practice
- **Markowitz** (Portfolio Manager): Primary - portfolio construction and sizing decisions
- **Clara** (Financial Analyst): Secondary - scenario analysis for position evaluation
- **Simons** (Quant Researcher): Secondary - validating strategy robustness

## Related Skills
- `analysis/drawdown-analysis.md`: Historical drawdown patterns inform scenario design
- `analysis/risk-assessment.md`: Comprehensive risk framework incorporating stress tests
- `analysis/correlation-analysis.md`: Understanding correlation breakdown in crises
- `analysis/sharpe-ratio-calculation.md`: Risk-adjusted returns under normal vs. stressed conditions

## Technical Details

### Shock Application Methodology
1. **Ticker-Specific Shocks**: Apply explicit shock to named tickers
2. **Sector Shocks**: Apply sector-wide shocks to classified groups
3. **Default Shock**: Fallback for unmapped positions
4. **Price Calculation**: New Price = Current Price × (1 + Shock)

### Sector Classification
Predefined groups:
- Semiconductors: MU, NVDA, AMD, INTC, TSM, ASML, SOXX
- Technology: AAPL, MSFT, GOOGL, META, QQQ
- Financials: JPM, BAC, GS, V, MA
- Defensives: PG, JNJ, KO, WMT

### Limit Violation Detection
- Calculates post-stress position allocations
- Compares against policy limits
- Flags violations for immediate attention
- Suggests rebalancing or hedging actions

## Integration with AIMantras Framework
This skill enables personas to:
- Proactively identify portfolio vulnerabilities
- Quantify tail risk exposure with concrete scenario analysis
- Set appropriate position sizes based on stress test results
- Communicate risk to stakeholders with scenario-based evidence
- Make informed hedging and rebalancing decisions

## Best Practices

### Scenario Selection
- Run historical scenarios monthly (known crisis patterns)
- Run thesis-driven scenarios before major position changes
- Create custom scenarios for portfolio-specific risks
- Test multiple scenarios, not just base case

### Interpretation
- Focus on worst-case scenarios, not averages
- Identify positions that violate limits under stress
- Consider correlation breakdown (diversification failure)
- Plan remediation before stress occurs, not during

### Action Planning
If stress test reveals:
- **Limit violations**: Reduce position sizes or add hedges
- **Excessive loss**: Diversify, add defensive positions, raise cash
- **Thesis failure**: Define exit criteria and monitoring triggers
- **Acceptable risk**: Document and proceed with awareness
