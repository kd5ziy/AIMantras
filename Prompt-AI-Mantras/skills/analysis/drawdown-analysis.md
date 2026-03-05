# Drawdown Analysis

## Purpose
Identify and analyze peak-to-trough declines in security prices to assess downside risk, recovery patterns, and portfolio resilience during market stress.

## When to Use
- Evaluating maximum loss exposure for a position or strategy
- Understanding recovery time after significant declines
- Comparing downside risk across different securities
- Setting stop-loss levels and risk limits
- Assessing investor pain tolerance and redemption risk
- Validating backtest results against crisis scenarios

## Inputs Required
- **Symbol**: Ticker symbol to analyze (e.g., "AAPL", "SPY", "QQQ")
- **Period**: Time horizon for analysis (3mo, 6mo, 1y, 2y, 5y, 10y, ytd, max)
- **Interval**: Data frequency (1d, 5d, 1wk) - default: daily
- **Show History**: Optional flag to display drawdown distribution chart

## Outputs Produced
Comprehensive drawdown metrics including:
- **Current Drawdown**: Distance from current price to all-time high
- **Maximum Drawdown**: Worst peak-to-trough decline in period
- **Peak/Trough Dates**: When maximum drawdown started and bottomed
- **Recovery Time**: Days to recover from maximum drawdown (if recovered)
- **Drawdown Statistics**: Average, median, days below peak
- **Significant Drawdowns**: All periods exceeding 5% decline
- **Drawdown Distribution**: Histogram of time spent at various drawdown levels

## Invocation

### Using Python Script Directly
```bash
python drawdown.py <SYMBOL> --period <PERIOD> [--show-history]
```

### Examples
```bash
# 1-year drawdown analysis
python drawdown.py AAPL

# 2-year analysis with distribution chart
python drawdown.py MSFT --period 2y --show-history

# Maximum available history
python drawdown.py SPY --period max
```

### Via Claude Code
When AI agents need to analyze drawdowns, they should:
1. Execute the Python script with appropriate parameters
2. Parse structured output (current status, max drawdown, statistics, periods)
3. Identify crisis periods and recovery patterns
4. Incorporate findings into risk assessments

## Constraints
- Requires internet connection for price data (market data provider)
- Limited to publicly traded securities with available price history
- Recovery calculations require data after trough (ongoing drawdowns show "Not Yet Recovered")
- Does not account for dividends (uses price-only returns)
- Weekly/monthly intervals may miss intraday drawdowns

## Interpretation Guidelines

### Maximum Drawdown Severity
- **< 10%**: Low volatility, defensive characteristics
- **10-20%**: Moderate drawdown typical for quality equities
- **20-30%**: High volatility, cyclical or growth stocks
- **30-50%**: Severe drawdown, high-risk securities
- **> 50%**: Extreme risk, speculative or distressed

### Current Drawdown Status
- **At/Near Peak** (<5% from ATH): Currently at strong levels
- **Minor Drawdown** (5-10%): Normal pullback territory
- **Moderate Drawdown** (10-20%): Significant decline, monitor closely
- **Deep Drawdown** (>20%): Crisis-level decline, risk management critical

### Recovery Time
- **Quick Recovery** (<3 months): Strong resilience, buying support
- **Moderate Recovery** (3-12 months): Normal recovery pattern
- **Slow Recovery** (1-2 years): Structural challenges or secular decline
- **No Recovery**: Ongoing drawdown, potential structural impairment

## Example Usage

### Risk Assessment
```bash
# Evaluate maximum loss exposure before adding position
python drawdown.py TSLA --period 5y
```
**Use Case**: Taleb (Risk Manager) assessing worst-case historical drawdown to set position limits

### Crisis Recovery Analysis
```bash
# Analyze how long it took to recover from COVID crash
python drawdown.py SPY --period 5y --show-history
```
**Use Case**: Markowitz (Portfolio Manager) understanding recovery patterns for drawdown tolerance setting

### Position Monitoring
```bash
# Check if current drawdown triggers risk review
python drawdown.py AMZN --period 1y
```
**Use Case**: Simons (Quant Researcher) monitoring if strategy drawdown exceeds kill criteria (-15%)

### Comparative Risk Analysis
```bash
# Compare drawdown profiles of two investment options
python drawdown.py MSFT --period 2y > msft_dd.txt
python drawdown.py QQQ --period 2y > qqq_dd.txt
```
**Use Case**: Clara (Financial Analyst) comparing single-stock vs. diversified ETF downside risk

## Recommended Personas
- **Taleb** (Risk Manager): Primary - maximum drawdown is critical risk metric
- **Markowitz** (Portfolio Manager): Primary - drawdown tolerance sets allocation limits
- **Clara** (Financial Analyst): Primary - evaluating downside risk vs. return potential
- **Simons** (Quant Researcher): Secondary - validating backtest drawdown assumptions

## Related Skills
- `analysis/sharpe-ratio-calculation.md`: Risk-adjusted returns complement drawdown analysis
- `analysis/stress-testing.md`: Simulate future drawdowns under crisis scenarios
- `analysis/risk-assessment.md`: Comprehensive risk evaluation framework
- `analysis/correlation-analysis.md`: Understand diversification during drawdowns

## Technical Details

### Calculation Methodology
1. **Running Maximum**: Track highest price achieved to date
2. **Drawdown**: (Current Price - Running Max) / Running Max
3. **Maximum Drawdown**: Minimum value of drawdown series
4. **Recovery**: First date where drawdown returns to within 0.1% of zero

### Drawdown Period Detection
- Identifies start (peak), trough (maximum decline), and end (recovery)
- Tracks multiple distinct drawdown events
- Flags significant periods (>5% decline threshold)
- Calculates duration metrics (days to trough, days to recovery, total duration)

### Data Source
- Market data provider API (e.g., Yahoo Finance, Alpha Vantage)
- Adjusted close prices (accounts for splits/dividends)
- Time-series analysis with expanding window calculations

## Integration with AIMantras Framework
This skill enables personas to:
- Quantify downside risk with concrete historical evidence
- Set realistic risk limits based on actual drawdown history
- Evaluate crisis resilience and recovery capabilities
- Make informed comparisons between investment alternatives
- Communicate risk to stakeholders with data-backed metrics

## Risk Management Applications

### Position Sizing
Use maximum drawdown to calibrate position sizes:
- If security has 30% max drawdown and portfolio tolerates 15% loss
- Position should be sized at ~50% of normal allocation

### Stop-Loss Setting
Set stops based on historical drawdown patterns:
- If typical drawdowns are 10-15%, a 20% stop provides buffer
- Avoid stops tighter than normal volatility (causes premature exits)

### Strategy Kill Criteria
Define when to terminate underperforming strategies:
- If backtest shows 10% max drawdown but live exceeds 15%, investigate
- If recovery time exceeds historical average by 2x, consider shutdown

### Investor Communication
Prepare clients for realistic drawdown expectations:
- "Historically, this portfolio experienced a 25% max drawdown in 2020"
- "Recovery took 8 months; maintain 12-month time horizon"
