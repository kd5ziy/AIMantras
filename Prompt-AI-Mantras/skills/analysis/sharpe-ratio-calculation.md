# Sharpe Ratio Calculation

## Purpose
Calculate risk-adjusted returns (Sharpe ratio) for securities to evaluate performance relative to volatility and compare investment alternatives on a risk-adjusted basis.

## When to Use
- Evaluating single security or fund risk-adjusted performance
- Comparing multiple investment options (stocks, ETFs, strategies)
- Assessing whether returns justify volatility risk
- Portfolio optimization and allocation decisions
- Performance attribution and strategy evaluation

## Inputs Required
- **Symbol**: Ticker symbol to analyze (e.g., "AAPL", "SPY", "QQQ")
- **Period**: Time horizon for analysis (1mo, 3mo, 6mo, 1y, 2y, 5y, 10y, ytd, max)
- **Interval**: Data frequency (1d, 5d, 1wk, 1mo) - default: daily
- **Risk-Free Rate**: Annual risk-free rate % (default: 4.5% for US Treasury)

## Outputs Produced
Comprehensive risk/return metrics including:
- **Sharpe Ratio**: Risk-adjusted return metric (annualized)
- **Sortino Ratio**: Downside deviation-adjusted returns
- **Annualized Return**: Compound annual growth rate (CAGR)
- **Volatility**: Annualized standard deviation of returns
- **Maximum Drawdown**: Worst peak-to-trough decline
- **Win Rate**: Percentage of positive return periods
- **Best/Worst Period**: Extreme return values

## Invocation

### Using Python Script Directly
```bash
python sharpe.py <SYMBOL> --period <PERIOD> --risk-free-rate <RATE>
```

### Examples
```bash
# 3-month Sharpe ratio for Apple
python sharpe.py AAPL

# 1-year analysis with custom risk-free rate
python sharpe.py MSFT --period 1y --risk-free-rate 5.0

# 5-year historical analysis for an ETF
python sharpe.py SPY --period 5y
```

### Via Claude Code
When AI agents need to calculate Sharpe ratios, they should:
1. Execute the Python script with appropriate parameters
2. Parse and interpret the formatted output
3. Incorporate results into analysis or recommendations

## Constraints
- Requires internet connection for price data (market data provider)
- Limited to publicly traded securities with available price history
- Risk-free rate should match the currency and duration of analysis
- Short time periods may produce unreliable Sharpe ratios (prefer 1y+)
- Does not account for trading costs or slippage (pure price returns)

## Interpretation Guidelines

### Sharpe Ratio Thresholds
- **< 0**: Returns below risk-free rate (poor)
- **0 - 0.5**: Low risk-adjusted returns (fair)
- **0.5 - 1.0**: Reasonable risk-adjusted returns (good)
- **1.0 - 2.0**: Strong risk-adjusted returns (very good)
- **> 2.0**: Excellent risk-adjusted returns (exceptional)

### Sortino Ratio
- Similar to Sharpe but penalizes only downside volatility
- More relevant for strategies with asymmetric return distributions
- Higher Sortino with same Sharpe suggests good upside capture with limited downside

### Volatility Considerations
- High volatility (>30% annual) indicates significant price swings
- Low volatility (<15% annual) suggests more stable returns
- Compare volatility to benchmarks (S&P 500 ~15-20% historical)

## Example Usage

### Single Security Evaluation
```bash
# Evaluate risk-adjusted returns for a stock position
python sharpe.py AAPL --period 2y --risk-free-rate 4.5
```
**Use Case**: Clara (Financial Analyst) assessing whether a stock's returns justify its volatility

### Strategy Comparison
```bash
# Compare individual stock vs. sector ETF
python sharpe.py MSFT --period 1y > msft_sharpe.txt
python sharpe.py QQQ --period 1y > qqq_sharpe.txt
```
**Use Case**: Simons (Quant Researcher) comparing individual stock vs. sector ETF for allocation

### Risk Manager Review
```bash
# Check if strategy maintains target Sharpe > 1.5
python sharpe.py <STRATEGY_TICKER> --period 6mo
```
**Use Case**: Taleb (Risk Manager) verifying strategy meets minimum risk-adjusted return requirements

## Recommended Personas
- **Clara** (Financial Analyst): Primary - evaluating investment risk/reward
- **Simons** (Quant Researcher): Primary - validating backtest results with live Sharpe calculations
- **Markowitz** (Portfolio Manager): Primary - comparing strategies for allocation decisions
- **Taleb** (Risk Manager): Secondary - monitoring risk-adjusted performance thresholds

## Related Skills
- `analysis/drawdown-analysis.md`: Complement Sharpe with drawdown assessment
- `analysis/correlation-analysis.md`: Understand diversification benefits
- `analysis/financial-modeling.md`: Incorporate Sharpe into broader portfolio models
- `analysis/comparative-analysis.md`: Systematically compare multiple Sharpe ratios

## Technical Details

### Calculation Methodology
- Uses daily returns with geometric compounding
- Annualizes using appropriate factor (252 trading days for daily data)
- Risk-free rate converted to periodic rate matching data frequency
- Excess returns = Actual returns - Risk-free rate
- Sharpe = Mean(Excess Returns) / StdDev(Returns) × √Periods per year

### Data Source
- Market data provider API (e.g., Yahoo Finance, Alpha Vantage)
- Adjusted close prices (accounts for splits/dividends)
- Real-time and historical data availability

## Integration with AIMantras Framework
This skill connects Python analytics to the AI Mantras cognitive framework, enabling personas to:
- Request quantitative analysis with natural language
- Interpret numerical results in context of investment decisions
- Chain this skill with other analysis skills for comprehensive evaluation
- Reference results in reports, recommendations, and risk assessments
