# Portfolio Analysis

## Purpose
Comprehensive portfolio evaluation including position sizing, allocation breakdown, risk concentration, and compliance with investment policy limits.

## When to Use
- Daily/weekly portfolio monitoring and rebalancing decisions
- Pre-trade analysis before adding or removing positions
- Limit compliance verification
- Concentration risk assessment
- Correlation analysis between holdings

## Inputs Required
- **Portfolio Data**: Broker CSV position file or holdings list
- **Analysis Type**: Concentration analysis, correlation check, or allocation review
- **Tickers**: Securities to analyze for correlation

## Outputs Produced

### Correlation Analysis (`correlation.py`)
- Pairwise correlation matrix between securities
- Identification of highly correlated holdings (diversification risk)
- Cluster analysis for effective concentration

### Allocation Analysis
- Position-level allocation percentages
- Sector and thematic concentration breakdown
- Limit violations flagged (single position, sector, speculative)

## Invocation

### Using Python Scripts Directly
```bash
# Analyze correlations between holdings
python correlation.py AAPL MSFT QQQ --period 1y
```

### Via Claude Code
When AI agents need portfolio analysis, they should:
1. Select appropriate tool based on analysis objective
2. Execute with portfolio data or ticker list
3. Parse structured output (allocations, correlations)
4. Identify concentration risks or limit violations
5. Generate recommendations for rebalancing or risk management

## Constraints
- Requires broker position data (parser may need adapting per broker)
- Current prices fetched from a market data provider (live data required)
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

### Position Sizing Appropriateness
- Core holdings should be largest (8-15% each)
- Growth positions moderate (5-10% each)
- Speculative positions small (2-5% each)

## Example Usage

### Correlation Analysis
```bash
# Identify correlated positions for diversification
python correlation.py AAPL MSFT QQQ --period 1y
```
**Use Case**: Markowitz (Portfolio Manager) reducing effective concentration by identifying highly correlated holdings

### Pre-Trade Diversification Check
```bash
# Check how a new position correlates with existing holdings
python correlation.py GOOGL AAPL MSFT --period 2y
```
**Use Case**: Markowitz (Portfolio Manager) determining if a new position adds diversification or increases concentration

## Recommended Personas
- **Markowitz** (Portfolio Manager): Primary - capital allocation and rebalancing decisions
- **Taleb** (Risk Manager): Primary - limit compliance and concentration monitoring
- **Clara** (Financial Analyst): Secondary - position evaluation and reporting
- **Simons** (Quant Researcher): Secondary - strategy capacity and sizing validation

## Related Skills
- `analysis/sharpe-ratio-calculation.md`: Calculate risk-adjusted returns for each position
- `analysis/drawdown-analysis.md`: Assess maximum loss exposure per position
- `analysis/risk-assessment.md`: Comprehensive portfolio risk evaluation

## Technical Details

### Data Sources
- **Position Data**: Broker CSV export (format varies by broker; parser may need adapting)
- **Current Prices**: Market data provider API (e.g., Yahoo Finance, Alpha Vantage)
- **Sector Classification**: Manual mapping or API enrichment

### Performance Calculations
- **Unrealized P&L**: (Current Price - Avg Cost) × Shares
- **Unrealized %**: ((Current Price / Avg Cost) - 1) × 100
- **Allocation**: Position Value / Total Portfolio Value

## Integration with AIMantras Framework
This skill enables personas to:
- Monitor portfolio health with automated analysis
- Identify rebalancing opportunities based on allocation drift
- Verify compliance with investment policy limits
- Make data-driven capital allocation decisions

## Analysis Workflows

### Weekly Risk Review (Taleb)
1. Run `correlation.py` to check for concentration risks
2. Review largest positions and sector allocations
3. Escalate violations or borderline risks

### Pre-Trade Analysis (Markowitz)
1. Run `correlation.py` to check new position's correlation with existing holdings
2. Assess diversification impact using correlation results
3. Make sizing decision based on combined analysis
