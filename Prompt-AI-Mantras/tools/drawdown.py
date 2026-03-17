#!/usr/bin/env python3
"""Drawdown calculator - analyze peak-to-trough declines.

Usage:
    python drawdown.py MU
    python drawdown.py MU --period 1y
    python drawdown.py MU --period 2y --show-history
"""

import argparse
import sys
from datetime import datetime

import numpy as np
import pandas as pd

from providers import YFinanceProvider


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


def calculate_drawdowns(prices: pd.Series) -> pd.DataFrame:
    """Calculate drawdown metrics from price series.

    Returns:
        DataFrame with running_max, drawdown, and drawdown_pct columns
    """
    # Calculate running maximum (peak)
    running_max = prices.expanding().max()

    # Calculate drawdown (absolute and percentage)
    drawdown = prices - running_max
    drawdown_pct = (prices / running_max) - 1

    return pd.DataFrame({
        'price': prices,
        'running_max': running_max,
        'drawdown': drawdown,
        'drawdown_pct': drawdown_pct
    })


def find_drawdown_periods(df: pd.DataFrame, threshold: float = -0.05) -> list[dict]:
    """Identify significant drawdown periods.

    Args:
        df: DataFrame from calculate_drawdowns
        threshold: Minimum drawdown % to report (default: -5%)

    Returns:
        List of drawdown periods with details
    """
    periods = []
    in_drawdown = False
    current_period = None

    for idx, row in df.iterrows():
        dd_pct = row['drawdown_pct']

        if dd_pct < threshold and not in_drawdown:
            # Start of new drawdown period
            in_drawdown = True
            current_period = {
                'start_date': idx,
                'peak_price': row['running_max'],
                'trough_date': idx,
                'trough_price': row['price'],
                'max_dd_pct': dd_pct,
                'recovered': False,
                'recovery_date': None,
                'recovery_days': None,
            }
        elif in_drawdown:
            # Update trough if this is a new low
            if dd_pct < current_period['max_dd_pct']:
                current_period['max_dd_pct'] = dd_pct
                current_period['trough_date'] = idx
                current_period['trough_price'] = row['price']

            # Check for recovery (back to peak)
            if dd_pct >= -0.001:  # Within 0.1% of peak
                current_period['recovered'] = True
                current_period['recovery_date'] = idx
                current_period['recovery_days'] = (idx - current_period['trough_date']).days
                periods.append(current_period)
                in_drawdown = False
                current_period = None

    # If still in drawdown at end, add it
    if in_drawdown and current_period:
        periods.append(current_period)

    return periods


def display_drawdown_report(
    symbol: str,
    name: str,
    df: pd.DataFrame,
    periods: list[dict],
    period: str,
    show_history: bool
):
    """Display comprehensive drawdown analysis report."""

    print("\n" + "=" * 80)
    print(f"DRAWDOWN ANALYSIS: {name} ({symbol})")
    print("=" * 80)

    print(f"\nAnalysis Period: {period}")
    print(f"Data Range: {df.index[0].date()} to {df.index[-1].date()}")
    print(f"Data Points: {len(df)}")

    # Current status
    current_price = df['price'].iloc[-1]
    current_peak = df['running_max'].iloc[-1]
    current_dd = df['drawdown_pct'].iloc[-1]

    print("\n" + "-" * 80)
    print("CURRENT STATUS")
    print("-" * 80)
    print(f"  Current Price:         ${current_price:>10.2f}")
    print(f"  Peak Price (ATH):      ${current_peak:>10.2f}")
    print(f"  Current Drawdown:      {current_dd:>10.2%}", end="")

    if current_dd < -0.20:
        print("  ⚠️  Deep Drawdown")
    elif current_dd < -0.10:
        print("  ⚠️  Moderate Drawdown")
    elif current_dd < -0.05:
        print("  📉 Minor Drawdown")
    else:
        print("  ✓ At/Near Peak")

    # Maximum drawdown
    max_dd = df['drawdown_pct'].min()
    max_dd_idx = df['drawdown_pct'].idxmin()
    max_dd_date = max_dd_idx.date()

    # Find the peak before max drawdown
    peak_before_max = df.loc[:max_dd_idx, 'running_max'].max()
    peak_date_idx = df.loc[:max_dd_idx][df.loc[:max_dd_idx, 'running_max'] == peak_before_max].index[0]
    peak_date = peak_date_idx.date()

    print("\n" + "-" * 80)
    print("MAXIMUM DRAWDOWN")
    print("-" * 80)
    print(f"  Max Drawdown:          {max_dd:>10.2%}")
    print(f"  Peak Date:             {peak_date}")
    print(f"  Trough Date:           {max_dd_date}")
    print(f"  Days to Trough:        {(max_dd_idx - peak_date_idx).days}")

    # Check if recovered from max drawdown
    recovered = df.loc[max_dd_idx:, 'drawdown_pct'].max() >= -0.001
    if recovered:
        recovery_idx = df.loc[max_dd_idx:][df.loc[max_dd_idx:, 'drawdown_pct'] >= -0.001].index[0]
        recovery_date = recovery_idx.date()
        recovery_days = (recovery_idx - max_dd_idx).days
        print(f"  Recovery Date:         {recovery_date}")
        print(f"  Days to Recover:       {recovery_days}")
        print(f"  Total Duration:        {(recovery_idx - peak_date_idx).days} days")
        print(f"  Status:                ✓ Recovered")
    else:
        days_in_dd = (df.index[-1] - max_dd_idx).days
        print(f"  Days in Drawdown:      {days_in_dd}")
        print(f"  Status:                ⚠️  Not Yet Recovered")

    # Drawdown statistics
    drawdowns_only = df[df['drawdown_pct'] < 0]['drawdown_pct']

    print("\n" + "-" * 80)
    print("DRAWDOWN STATISTICS")
    print("-" * 80)
    print(f"  Average Drawdown:      {drawdowns_only.mean():>10.2%}")
    print(f"  Median Drawdown:       {drawdowns_only.median():>10.2%}")
    print(f"  Days Below Peak:       {len(drawdowns_only)} of {len(df)} ({len(drawdowns_only)/len(df):.1%})")

    # Significant drawdown periods
    if periods:
        print("\n" + "-" * 80)
        print(f"SIGNIFICANT DRAWDOWN PERIODS (>{5}%)")
        print("-" * 80)
        print(f"\n{'Peak Date':<12} {'Trough Date':<12} {'Max DD':>8} {'Days':>6} {'Recovered':>10} {'Recovery':>10}")
        print("-" * 80)

        for p in sorted(periods, key=lambda x: x['max_dd_pct']):
            peak_str = p['start_date'].strftime("%Y-%m-%d")
            trough_str = p['trough_date'].strftime("%Y-%m-%d")
            dd_pct = p['max_dd_pct']
            days_to_trough = (p['trough_date'] - p['start_date']).days
            recovered_str = "Yes" if p['recovered'] else "No"
            recovery_str = f"{p['recovery_days']}d" if p['recovered'] else "N/A"

            print(f"{peak_str:<12} {trough_str:<12} {dd_pct:>7.2%} {days_to_trough:>6} {recovered_str:>10} {recovery_str:>10}")

    # Drawdown distribution
    if show_history:
        print("\n" + "-" * 80)
        print("DRAWDOWN DISTRIBUTION")
        print("-" * 80)

        bins = [0, -0.05, -0.10, -0.20, -0.30, -1.0]
        labels = ["0-5%", "5-10%", "10-20%", "20-30%", ">30%"]

        # Count days in each bin
        for i, (low, high) in enumerate(zip(bins[:-1], bins[1:])):
            count = ((df['drawdown_pct'] >= high) & (df['drawdown_pct'] < low)).sum()
            pct = count / len(df) * 100
            bar = "█" * int(pct / 2)
            print(f"  {labels[i]:>8}: {count:>4} days ({pct:>5.1f}%) {bar}")

    print("\n" + "=" * 80)
    print("INTERPRETATION")
    print("=" * 80)

    if max_dd < -0.50:
        print("⚠️  SEVERE: Maximum drawdown exceeds 50%. Very high volatility.")
    elif max_dd < -0.30:
        print("⚠️  HIGH: Maximum drawdown exceeds 30%. Significant risk.")
    elif max_dd < -0.20:
        print("⚠️  MODERATE: Maximum drawdown of 20-30% is typical for volatile stocks.")
    else:
        print("✓ LOW: Maximum drawdown under 20% indicates lower volatility.")

    if current_dd < -0.20:
        print("⚠️  Currently in deep drawdown. Consider risk management rules.")
    elif current_dd < -0.10:
        print("⚠️  Currently in moderate drawdown. Monitor closely.")

    print()


def main():
    parser = argparse.ArgumentParser(
        description="Calculate drawdown metrics for a security",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python drawdown.py MU                        # 1-year drawdown analysis
  python drawdown.py MU --period 2y            # 2-year analysis
  python drawdown.py MU --show-history         # Include distribution chart
        """
    )
    parser.add_argument(
        "symbol",
        help="Stock symbol to analyze"
    )
    parser.add_argument(
        "--period",
        default="1y",
        choices=["3mo", "6mo", "1y", "2y", "5y", "10y", "ytd", "max"],
        help="Time period for analysis (default: 1y)"
    )
    parser.add_argument(
        "--interval",
        default="1d",
        choices=["1d", "5d", "1wk"],
        help="Data interval (default: 1d)"
    )
    parser.add_argument(
        "--show-history",
        action="store_true",
        help="Show drawdown distribution chart"
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

    # Calculate drawdowns
    df = calculate_drawdowns(prices)

    # Find significant drawdown periods
    periods = find_drawdown_periods(df, threshold=-0.05)

    # Display report
    display_drawdown_report(args.symbol, name, df, periods, args.period, args.show_history)


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        sys.exit(0)
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)
