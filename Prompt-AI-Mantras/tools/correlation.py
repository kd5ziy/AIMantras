#!/usr/bin/env python3
"""Correlation matrix calculator - analyze correlation between assets.

Usage:
    python correlation.py MU NVDA AMD
    python correlation.py MU NVDA --period 6mo
    python correlation.py MU NVDA AMD AAPL --period 1y --interval 1wk
"""

import argparse
import sys
from typing import List

import numpy as np
import pandas as pd

from providers import YFinanceProvider


def fetch_historical_data(
    symbols: List[str],
    period: str,
    interval: str,
    provider: YFinanceProvider
) -> pd.DataFrame:
    """Fetch historical close prices for multiple symbols.

    Returns:
        DataFrame with dates as index and symbols as columns
    """
    all_data = {}

    for symbol in symbols:
        try:
            history = provider.get_history(symbol, period=period, interval=interval)
            if history and history.bars:
                # Extract close prices from bars
                closes = pd.Series(
                    [bar.close for bar in history.bars],
                    index=[bar.date for bar in history.bars],
                    name=symbol
                )
                all_data[symbol] = closes
            else:
                print(f"Warning: No data available for {symbol}", file=sys.stderr)
        except Exception as e:
            print(f"Warning: Failed to fetch {symbol}: {e}", file=sys.stderr)

    if not all_data:
        return pd.DataFrame()

    # Combine into single DataFrame
    df = pd.DataFrame(all_data)

    # Drop rows with any missing data
    df = df.dropna()

    return df


def calculate_returns(prices: pd.DataFrame) -> pd.DataFrame:
    """Calculate daily/periodic returns from prices."""
    return prices.pct_change().dropna()


def display_correlation_matrix(corr_matrix: pd.DataFrame, symbols: List[str]):
    """Display correlation matrix in a formatted table."""

    print("\n" + "=" * 80)
    print("CORRELATION MATRIX")
    print("=" * 80)

    print("\nCorrelation values range from -1 to +1:")
    print("  +1.0 = Perfect positive correlation (move together)")
    print("   0.0 = No correlation (independent)")
    print("  -1.0 = Perfect negative correlation (move opposite)")

    # Header row
    print("\n" + " " * 10, end="")
    for symbol in symbols:
        print(f"{symbol:>8}", end="")
    print()
    print("-" * (10 + 8 * len(symbols)))

    # Data rows
    for i, symbol1 in enumerate(symbols):
        print(f"{symbol1:<10}", end="")
        for j, symbol2 in enumerate(symbols):
            corr = corr_matrix.iloc[i, j]

            # Color coding with symbols
            if i == j:
                print(f"{'1.00':>8}", end="")
            elif corr >= 0.8:
                print(f"{corr:>7.2f}*", end="")  # Strong positive
            elif corr >= 0.5:
                print(f"{corr:>8.2f}", end="")   # Moderate positive
            elif corr <= -0.5:
                print(f"{corr:>7.2f}!", end="")  # Negative
            else:
                print(f"{corr:>8.2f}", end="")   # Weak
        print()

    print("\nLegend: * = Strong correlation (≥0.8) | ! = Negative correlation (≤-0.5)")

    # Summary statistics
    print("\n" + "=" * 80)
    print("CORRELATION SUMMARY")
    print("=" * 80)

    # Find strongest correlations (excluding diagonal)
    print("\nStrongest Positive Correlations:")
    pairs = []
    for i in range(len(symbols)):
        for j in range(i + 1, len(symbols)):
            corr = corr_matrix.iloc[i, j]
            pairs.append((symbols[i], symbols[j], corr))

    pairs.sort(key=lambda x: x[2], reverse=True)

    for sym1, sym2, corr in pairs[:5]:
        status = "Very Strong" if corr >= 0.8 else "Strong" if corr >= 0.6 else "Moderate"
        print(f"  {sym1:8s} & {sym2:8s}  {corr:6.2f}  ({status})")

    # Find weakest/negative correlations
    if any(p[2] < 0.3 for p in pairs):
        print("\nWeakest/Negative Correlations:")
        pairs.sort(key=lambda x: x[2])
        for sym1, sym2, corr in pairs[:5]:
            if corr < 0.3:
                status = "Negative" if corr < 0 else "Very Weak" if corr < 0.2 else "Weak"
                print(f"  {sym1:8s} & {sym2:8s}  {corr:6.2f}  ({status})")

    # Average correlation
    avg_corr = corr_matrix.values[~np.eye(len(symbols), dtype=bool)].mean()
    print(f"\nAverage Correlation (excluding self): {avg_corr:.3f}")

    if avg_corr > 0.7:
        print("⚠️  HIGH CORRELATION: Portfolio may lack diversification")
    elif avg_corr > 0.5:
        print("⚠️  MODERATE CORRELATION: Some diversification, but assets tend to move together")
    elif avg_corr > 0.3:
        print("✓  MODERATE DIVERSIFICATION: Assets show some independence")
    else:
        print("✓  GOOD DIVERSIFICATION: Assets are relatively independent")

    print()


def main():
    parser = argparse.ArgumentParser(
        description="Calculate correlation matrix between assets",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python correlation.py MU NVDA AMD           # 3-month correlation
  python correlation.py MU NVDA --period 1y   # 1-year correlation
  python correlation.py MU NVDA AMD AAPL --period 6mo --interval 1wk
        """
    )
    parser.add_argument(
        "symbols",
        nargs="+",
        help="Stock symbols to analyze (minimum 2)"
    )
    parser.add_argument(
        "--period",
        default="3mo",
        choices=["1d", "5d", "1mo", "3mo", "6mo", "1y", "2y", "5y", "10y", "ytd", "max"],
        help="Time period for analysis (default: 3mo)"
    )
    parser.add_argument(
        "--interval",
        default="1d",
        choices=["1d", "5d", "1wk", "1mo", "3mo"],
        help="Data interval (default: 1d)"
    )
    parser.add_argument(
        "--provider",
        "-p",
        default="yfinance",
        choices=["yfinance"],
        help="Data provider (default: yfinance)"
    )

    args = parser.parse_args()

    if len(args.symbols) < 2:
        print("Error: Please provide at least 2 symbols", file=sys.stderr)
        sys.exit(1)

    # Remove duplicates while preserving order
    symbols = list(dict.fromkeys(args.symbols))

    print(f"Fetching {args.period} historical data for {len(symbols)} symbols...")
    print(f"Symbols: {', '.join(symbols)}")

    # Fetch data
    provider = YFinanceProvider()
    prices = fetch_historical_data(symbols, args.period, args.interval, provider)

    if prices.empty:
        print("Error: No data available for correlation calculation", file=sys.stderr)
        sys.exit(1)

    # Check if we have all symbols
    missing = set(symbols) - set(prices.columns)
    if missing:
        print(f"\nWarning: Excluding symbols with no data: {', '.join(missing)}")
        symbols = [s for s in symbols if s in prices.columns]

    if len(symbols) < 2:
        print("Error: Not enough symbols with valid data", file=sys.stderr)
        sys.exit(1)

    print(f"Analyzing {len(prices)} data points from {prices.index[0].date()} to {prices.index[-1].date()}")

    # Calculate returns
    returns = calculate_returns(prices)

    # Calculate correlation matrix
    corr_matrix = returns.corr()

    # Display results
    display_correlation_matrix(corr_matrix, symbols)


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        sys.exit(0)
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)
