#!/usr/bin/env python3
"""Sharpe ratio calculator - analyze risk-adjusted returns.

Usage:
    python sharpe.py MU
    python sharpe.py MU --period 1y
    python sharpe.py MU --period 1y --risk-free-rate 4.5
"""

import argparse
import sys

import numpy as np
import pandas as pd

from providers import YFinanceProvider


# Default risk-free rate (annual %)
DEFAULT_RISK_FREE_RATE = 4.5  # Current US Treasury rate approximation


def fetch_historical_data(
    symbol: str,
    period: str,
    interval: str,
    provider: YFinanceProvider
) -> pd.Series:
    """Fetch historical close prices for a symbol.

    Returns:
        Series with dates as index and close prices
    """
    try:
        history = provider.get_history(symbol, period=period, interval=interval)
        if history and history.bars:
            closes = pd.Series(
                [bar.close for bar in history.bars],
                index=[bar.date for bar in history.bars],
                name=symbol
            )
            return closes
        else:
            return pd.Series()
    except Exception as e:
        print(f"Error fetching data for {symbol}: {e}", file=sys.stderr)
        return pd.Series()


def calculate_returns(prices: pd.Series) -> pd.Series:
    """Calculate periodic returns from prices."""
    return prices.pct_change().dropna()


def annualization_factor(interval: str) -> float:
    """Get annualization factor based on data interval."""
    factors = {
        "1d": 252,    # Trading days per year
        "5d": 52,     # Weeks per year
        "1wk": 52,    # Weeks per year
        "1mo": 12,    # Months per year
        "3mo": 4,     # Quarters per year
    }
    return factors.get(interval, 252)


def calculate_sharpe_ratio(
    returns: pd.Series,
    risk_free_rate: float,
    interval: str
) -> float:
    """Calculate annualized Sharpe ratio.

    Args:
        returns: Periodic returns
        risk_free_rate: Annual risk-free rate (%)
        interval: Data interval for annualization

    Returns:
        Annualized Sharpe ratio
    """
    if len(returns) == 0:
        return 0.0

    # Annualization factor
    periods_per_year = annualization_factor(interval)

    # Convert annual risk-free rate to periodic
    risk_free_periodic = (1 + risk_free_rate / 100) ** (1 / periods_per_year) - 1

    # Calculate excess returns
    excess_returns = returns - risk_free_periodic

    # Annualized metrics
    mean_excess = excess_returns.mean() * periods_per_year
    volatility = returns.std() * np.sqrt(periods_per_year)

    if volatility == 0:
        return 0.0

    return mean_excess / volatility


def calculate_metrics(
    prices: pd.Series,
    returns: pd.Series,
    risk_free_rate: float,
    interval: str
) -> dict:
    """Calculate comprehensive risk/return metrics."""

    if len(returns) == 0:
        return {}

    periods_per_year = annualization_factor(interval)

    # Annualized return
    total_return = (prices.iloc[-1] / prices.iloc[0]) - 1
    num_periods = len(prices) - 1
    years = num_periods / periods_per_year
    annualized_return = (1 + total_return) ** (1 / years) - 1 if years > 0 else 0

    # Volatility (annualized standard deviation)
    volatility = returns.std() * np.sqrt(periods_per_year)

    # Sharpe ratio
    sharpe = calculate_sharpe_ratio(returns, risk_free_rate, interval)

    # Sortino ratio (uses downside deviation)
    risk_free_periodic = (1 + risk_free_rate / 100) ** (1 / periods_per_year) - 1
    excess_returns = returns - risk_free_periodic
    downside_returns = excess_returns[excess_returns < 0]
    downside_std = downside_returns.std() * np.sqrt(periods_per_year)
    sortino = (excess_returns.mean() * periods_per_year / downside_std) if downside_std > 0 else 0

    # Maximum drawdown
    cumulative = (1 + returns).cumprod()
    running_max = cumulative.expanding().max()
    drawdown = (cumulative - running_max) / running_max
    max_drawdown = drawdown.min()

    # Win rate
    win_rate = (returns > 0).sum() / len(returns)

    # Best/worst day
    best_day = returns.max()
    worst_day = returns.min()

    return {
        "total_return": total_return,
        "annualized_return": annualized_return,
        "volatility": volatility,
        "sharpe_ratio": sharpe,
        "sortino_ratio": sortino,
        "max_drawdown": max_drawdown,
        "win_rate": win_rate,
        "best_day": best_day,
        "worst_day": worst_day,
        "num_periods": num_periods,
        "years": years,
    }


def display_sharpe_report(
    symbol: str,
    name: str,
    metrics: dict,
    risk_free_rate: float,
    period: str,
    interval: str
):
    """Display comprehensive Sharpe ratio and risk metrics report."""

    print("\n" + "=" * 80)
    print(f"RISK-ADJUSTED PERFORMANCE: {name} ({symbol})")
    print("=" * 80)

    print(f"\nAnalysis Period: {period} | Interval: {interval}")
    print(f"Data Points: {metrics['num_periods']} | Years: {metrics['years']:.2f}")
    print(f"Risk-Free Rate: {risk_free_rate:.2f}% (annual)")

    print("\n" + "-" * 80)
    print("RETURN METRICS")
    print("-" * 80)
    print(f"  Total Return:          {metrics['total_return']:>8.2%}")
    print(f"  Annualized Return:     {metrics['annualized_return']:>8.2%}")
    print(f"  Win Rate:              {metrics['win_rate']:>8.2%}")

    print("\n" + "-" * 80)
    print("RISK METRICS")
    print("-" * 80)
    print(f"  Volatility (Annual):   {metrics['volatility']:>8.2%}")
    print(f"  Max Drawdown:          {metrics['max_drawdown']:>8.2%}")
    print(f"  Best Period:           {metrics['best_day']:>8.2%}")
    print(f"  Worst Period:          {metrics['worst_day']:>8.2%}")

    print("\n" + "-" * 80)
    print("RISK-ADJUSTED RETURNS")
    print("-" * 80)

    # Sharpe ratio
    sharpe = metrics['sharpe_ratio']
    print(f"  Sharpe Ratio:          {sharpe:>8.2f}", end="")
    if sharpe >= 2.0:
        print("  ⭐ Excellent")
    elif sharpe >= 1.0:
        print("  ✓ Good")
    elif sharpe >= 0.5:
        print("  ⚠️  Fair")
    else:
        print("  ❌ Poor")

    # Sortino ratio
    sortino = metrics['sortino_ratio']
    print(f"  Sortino Ratio:         {sortino:>8.2f}", end="")
    if sortino >= 2.0:
        print("  ⭐ Excellent")
    elif sortino >= 1.0:
        print("  ✓ Good")
    else:
        print()

    print("\n" + "=" * 80)
    print("SHARPE RATIO INTERPRETATION")
    print("=" * 80)
    print("  < 0.5  : Poor risk-adjusted returns")
    print("  0.5-1.0: Fair risk-adjusted returns")
    print("  1.0-2.0: Good risk-adjusted returns")
    print("  > 2.0  : Excellent risk-adjusted returns")
    print()

    # Commentary
    if sharpe < 0:
        print("⚠️  Negative Sharpe: Returns below risk-free rate. Consider alternatives.")
    elif sharpe < 0.5:
        print("⚠️  Low Sharpe: Taking significant risk for minimal excess returns.")
    elif sharpe >= 2.0:
        print("✓ High Sharpe: Strong risk-adjusted returns. Well-compensated for risk taken.")
    elif sharpe >= 1.0:
        print("✓ Solid Sharpe: Reasonable compensation for risk. Acceptable risk/reward.")

    print()


def main():
    parser = argparse.ArgumentParser(
        description="Calculate Sharpe ratio and risk-adjusted returns",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python sharpe.py MU                          # 3-month Sharpe ratio
  python sharpe.py MU --period 1y              # 1-year Sharpe ratio
  python sharpe.py MU --period 1y --risk-free-rate 5.0
        """
    )
    parser.add_argument(
        "symbol",
        help="Stock symbol to analyze"
    )
    parser.add_argument(
        "--period",
        default="3mo",
        choices=["1mo", "3mo", "6mo", "1y", "2y", "5y", "10y", "ytd", "max"],
        help="Time period for analysis (default: 3mo)"
    )
    parser.add_argument(
        "--interval",
        default="1d",
        choices=["1d", "5d", "1wk", "1mo"],
        help="Data interval (default: 1d)"
    )
    parser.add_argument(
        "--risk-free-rate",
        type=float,
        default=DEFAULT_RISK_FREE_RATE,
        help=f"Annual risk-free rate %% (default: {DEFAULT_RISK_FREE_RATE})"
    )
    parser.add_argument(
        "--provider",
        "-p",
        default="yfinance",
        choices=["yfinance"],
        help="Data provider (default: yfinance)"
    )

    args = parser.parse_args()

    print(f"Fetching {args.period} historical data for {args.symbol}...")

    # Fetch data
    provider = YFinanceProvider()
    prices = fetch_historical_data(args.symbol, args.period, args.interval, provider)

    if prices.empty or len(prices) < 2:
        print(f"Error: Insufficient data for {args.symbol}", file=sys.stderr)
        sys.exit(1)

    # Get symbol name
    try:
        quote = provider.get_quote(args.symbol)
        name = quote.name
    except:
        name = args.symbol

    print(f"Analyzing {len(prices)} data points from {prices.index[0].date()} to {prices.index[-1].date()}")

    # Calculate returns
    returns = calculate_returns(prices)

    if returns.empty:
        print("Error: Unable to calculate returns", file=sys.stderr)
        sys.exit(1)

    # Calculate metrics
    metrics = calculate_metrics(prices, returns, args.risk_free_rate, args.interval)

    # Display report
    display_sharpe_report(args.symbol, name, metrics, args.risk_free_rate, args.period, args.interval)


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        sys.exit(0)
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)
