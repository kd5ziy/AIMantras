# Portfolio Analysis

## Purpose
Comprehensive portfolio evaluation including position sizing, allocation breakdown, performance metrics, risk concentration, and compliance with investment policy limits.

## When to Use
- Daily/weekly portfolio monitoring and rebalancing decisions
- Pre-trade analysis before adding or removing positions
- Performance attribution and reporting
- Limit compliance verification
- Multi-currency portfolio consolidation and FX exposure analysis
- Transaction journal and P&L tracking

## Inputs Required
- **Portfolio Data**: Broker CSV transaction history or position file
- **Analysis Type**: Holdings overview, multi-currency consolidation, or transaction journal
- **Currency**: Base currency for multi-currency analysis (USD, EUR)
- **Date Range**: For transaction journal and performance analysis

## Outputs Produced
Depending on analysis type:

### Holdings Analysis
- Current positions with quantity, avg cost, current price
- Unrealized P&L by position ($ and %)
- Allocation percentages
- Sector/thematic concentration
- Total portfolio value and cost basis

### Multi-Currency Analysis
- Consolidated view across multiple currencies
- FX exposure breakdown
- Currency-converted position values
- Cross-currency performance metrics

### Transaction Journal
- Chronological transaction history
- Realized P&L from closed positions
- Trade frequency and patterns
- Cost basis tracking
- Dividend and corporate action history

## Invocation

### Using Python Scripts Directly
```bash
# Basic portfolio overview
python portfolio.py

# Multi-currency consolidation
python portfolio_multicurrency.py --currency USD

# Transaction journal with date range
python journal.py --from 2024-01-01 --to 2024-12-31
```

### Via Claude Code
When AI agents need portfolio analysis, they should:
1. Select appropriate script based on analysis objective
2. Execute with portfolio CSV path
3. Parse structured output (positions, allocations, P&L)
4. Identify concentration risks or limit violations
5. Generate recommendations for rebalancing or risk management

## Constraints
- Requires broker transaction history CSV (parser may need adapting per broker)
- Current prices fetched from a market data provider (live data required)
- FX rates from reliable sources (for multi-currency analysis)
- Does not include:
  - Options, futures, or derivatives (equity-focused)
  - Margin calculations (assumes cash portfolio)
  - Tax lot optimization (uses average cost basis)
  - Bid-ask spread costs (uses mid-price)

## Position Limits & Policy Compliance

### Single Position Limits
- **Max Single Position**: 15% of portfolio
- **Max Speculative**: 15% allocated to unproven/high-risk holdings
- **Min Cash Buffer**: 5% for liquidity and opportunistic deployment

### Sector Concentration Limits
- **Max Sector Exposure**: 35% in any single sector
- Examples: Technology, Semiconductors, Financials, Healthcare, Energy

### Risk Classification
- **Core Holdings**: Established, profitable companies (>50% portfolio)
- **Growth Positions**: High-growth but proven business models (20-30%)
- **Speculative**: Unproven, early-stage, or distressed (<15%)
- **Cash & Equivalents**: Dry powder for opportunities (5-10%)

## Interpretation Guidelines

### Allocation Health
- **Well-Diversified**: No position >10%, sectors <30%, multiple themes
- **Moderately Concentrated**: Few positions 10-15%, one dominant sector 30-35%
- **Highly Concentrated**: Positions >15%, single sector >40%

### Performance Metrics
- **Strong**: >10% unrealized gains on majority of positions
- **Mixed**: Some winners (+15%+), some laggards (-10%+)
- **Weak**: Majority of positions underwater or flat

### Position Sizing Appropriateness
- Core holdings should be largest (8-15% each)
- Growth positions moderate (5-10% each)
- Speculative positions small (2-5% each)

## Example Usage

### Daily Portfolio Check
```bash
# Quick overview of current holdings and P&L
python portfolio.py --summary
```
**Use Case**: Markowitz (Portfolio Manager) morning routine to check positions and identify needs for rebalancing

### Multi-Currency Consolidation
```bash
# Consolidate EUR and USD positions
python portfolio_multicurrency.py --currency USD --fx-source live
```
**Use Case**: Clara (Financial Analyst) reporting total portfolio value accounting for FX exposure

### Limit Compliance Check
```bash
# Verify no positions exceed policy limits
python check_limits.py
```
**Use Case**: Taleb (Risk Manager) weekly compliance verification against investment policy

### Transaction Analysis
```bash
# Review all transactions in Q4 2024
python journal.py --from 2024-10-01 --to 2024-12-31
```
**Use Case**: Markowitz (Portfolio Manager) quarterly review of trading activity and realized gains/losses

### Rebalancing Planning
```bash
# Identify overweight/underweight positions
python portfolio.py --compare-target-allocation targets.json
```
**Use Case**: Markowitz (Portfolio Manager) determining which positions to trim or add to reach target allocations

## Recommended Personas
- **Markowitz** (Portfolio Manager): Primary - capital allocation and rebalancing decisions
- **Taleb** (Risk Manager): Primary - limit compliance and concentration monitoring
- **Clara** (Financial Analyst): Secondary - position evaluation and reporting
- **Simons** (Quant Researcher): Secondary - strategy capacity and sizing validation

## Related Skills
- `analysis/sharpe-ratio-calculation.md`: Calculate risk-adjusted returns for each position
- `analysis/drawdown-analysis.md`: Assess maximum loss exposure per position
- `analysis/stress-testing.md`: Simulate portfolio under adverse scenarios
- `analysis/correlation-analysis.md`: Understand diversification benefits
- `analysis/risk-assessment.md`: Comprehensive portfolio risk evaluation

## Technical Details

### Data Sources
- **Transaction History**: Broker CSV export (format varies by broker; parser may need adapting)
- **Current Prices**: Market data provider API (e.g., Yahoo Finance, Alpha Vantage)
- **FX Rates**: Currency conversion APIs (ECB, Fed, live feeds)
- **Sector Classification**: Manual mapping or API enrichment

### Position Aggregation
- Aggregates transactions by ISIN/ticker
- Calculates average cost basis (total cost / total shares)
- Tracks corporate actions (splits, dividends, mergers)
- Handles partial position closures

### Performance Calculations
- **Unrealized P&L**: (Current Price - Avg Cost) × Shares
- **Unrealized %**: ((Current Price / Avg Cost) - 1) × 100
- **Total Return**: Unrealized + Realized + Dividends
- **Allocation**: Position Value / Total Portfolio Value

### Multi-Currency Handling
- Converts all positions to base currency using live FX rates
- Tracks FX exposure separately (currency risk)
- Supports EUR, USD, GBP, CHF, JPY
- Handles cross-rate calculations

## Integration with AIMantras Framework
This skill enables personas to:
- Monitor portfolio health with automated analysis
- Identify rebalancing opportunities based on allocation drift
- Verify compliance with investment policy limits
- Track performance and attribution systematically
- Make data-driven capital allocation decisions

## Analysis Workflows

### Morning Routine (Markowitz, Taleb)
1. Run `portfolio.py` to check current positions
2. Identify positions outside target ranges
3. Review overnight price movements and impacts
4. Flag limit violations or concentration risks

### Weekly Risk Review (Taleb)
1. Run `check_limits.py` for policy compliance
2. Run `portfolio.py` for sector concentration analysis
3. Review largest positions and recent additions
4. Escalate violations or borderline risks

### Monthly Performance Review (Markowitz, Clara)
1. Run `journal.py` for transaction history
2. Calculate realized vs. unrealized gains
3. Analyze winning vs. losing trades
4. Review portfolio evolution over time

### Quarterly Investor Reporting (Markowitz)
1. Run `portfolio_multicurrency.py` for consolidated view
2. Generate allocation breakdown by sector/theme
3. Calculate total return including FX effects
4. Prepare narrative explaining performance drivers

## Advanced Features

### Correlation-Aware Rebalancing
Combine with correlation analysis:
```bash
# Identify correlated positions for diversification
python correlation.py AAPL MSFT QQQ
```
**Use Case**: Reduce effective concentration by identifying highly correlated holdings

### Cost Basis Optimization
Track tax lots for:
- Highest-cost lot sales (minimize taxable gains)
- Long-term vs. short-term holding period optimization
- Tax-loss harvesting opportunities

### Scenario-Based Sizing
Use stress test results to calibrate position sizes:
- If stress test shows 30% loss on a position in a sector downturn scenario
- And portfolio tolerates 5% total loss
- Then that position should be < 16.7% of portfolio
