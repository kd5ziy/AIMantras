#!/usr/bin/env python3
"""Earnings calendar - fetch earnings dates and historical surprises.

Usage:
    python fetch_earnings.py AAPL
    python fetch_earnings.py AAPL --history 8
"""

import argparse
import sys
from typing import Optional

from config import DEFAULT_PROVIDER
from providers import (
    YFinanceProvider,
    EarningsCalendar,
    EarningsHistory,
    EarningsTrend,
)


# Registry of available providers
PROVIDERS = {
    "yfinance": YFinanceProvider,
}


def get_provider(name: str):
    """Get provider instance by name."""
    if name not in PROVIDERS:
        available = ", ".join(PROVIDERS.keys())
        raise ValueError(f"Unknown provider '{name}'. Available: {available}")
    return PROVIDERS[name]()


def format_eps(value: Optional[float]) -> str:
    """Format EPS value."""
    if value is None:
        return "N/A"
    return f"${value:.2f}"


def format_surprise(value: Optional[float]) -> str:
    """Format earnings surprise percentage."""
    if value is None:
        return "N/A"
    sign = "+" if value >= 0 else ""
    return f"{sign}{value:.1f}%"


def display_earnings_calendar(cal: EarningsCalendar):
    """Display upcoming earnings information."""
    print("\n" + "=" * 80)
    print(f"EARNINGS CALENDAR: {cal.name} ({cal.symbol})")
    print("=" * 80)

    # Next earnings date
    if cal.next_earnings_date:
        if cal.next_earnings_date_end and cal.next_earnings_date != cal.next_earnings_date_end:
            print(f"\nNext Earnings Date: {cal.next_earnings_date} to {cal.next_earnings_date_end}")
        else:
            print(f"\nNext Earnings Date: {cal.next_earnings_date}")
    else:
        print("\nNext Earnings Date: Not available")

    # Analyst estimates
    print("\n" + "-" * 80)
    print("ANALYST ESTIMATES")
    print("-" * 80)

    if cal.forward_eps is not None:
        print(f"  Forward EPS (Next FY):      {format_eps(cal.forward_eps)}")

    if cal.recommendation:
        print(f"  Analyst Recommendation:     {cal.recommendation}")

    if cal.num_analysts is not None:
        print(f"  Number of Analysts:         {cal.num_analysts}")

    if cal.target_price_mean is not None:
        print(f"\n  Price Target (Mean):        ${cal.target_price_mean:.2f}")
    if cal.target_price_low is not None and cal.target_price_high is not None:
        print(f"  Price Target Range:         ${cal.target_price_low:.2f} - ${cal.target_price_high:.2f}")


def display_earnings_history(history: EarningsHistory):
    """Display historical earnings with surprises."""
    if not history.records:
        print(f"\nNo historical earnings data available for {history.symbol}")
        return

    print("\n" + "=" * 80)
    print(f"HISTORICAL EARNINGS: {history.symbol}")
    print("=" * 80)

    # Display header
    print(f"\n{'Date':<12} {'Reported EPS':>12} {'Estimate':>12} {'Surprise':>12} {'Surprise %':>12}")
    print("-" * 80)

    beat_count = 0
    miss_count = 0
    surprise_count = 0

    for rec in history.records:
        surprise_str = format_eps(rec.surprise) if rec.surprise is not None else "N/A"
        surprise_pct_str = format_surprise(rec.surprise_percent) if rec.surprise_percent is not None else "N/A"

        print(f"{rec.date:<12} {format_eps(rec.reported_eps):>12} {format_eps(rec.estimated_eps):>12} "
              f"{surprise_str:>12} {surprise_pct_str:>12}")

        if rec.surprise is not None:
            surprise_count += 1
            if rec.surprise > 0:
                beat_count += 1
            elif rec.surprise < 0:
                miss_count += 1

    # Summary statistics
    if surprise_count > 0:
        print("\n" + "-" * 80)
        print("EARNINGS TRACK RECORD")
        print("-" * 80)
        print(f"  Beats:    {beat_count} ({beat_count/surprise_count*100:.1f}%)")
        print(f"  Meets:    {surprise_count - beat_count - miss_count}")
        print(f"  Misses:   {miss_count} ({miss_count/surprise_count*100:.1f}%)")

        if beat_count > miss_count * 2:
            print("\n  Strong track record of beating estimates")
        elif beat_count > miss_count:
            print("\n  Generally beats estimates")
        elif miss_count > beat_count:
            print("\n  Frequently misses estimates")

    print()


def display_earnings_trend(trend: EarningsTrend):
    """Display earnings trend analysis."""
    if not trend.quarters:
        return

    print("\n" + "=" * 80)
    print(f"QUARTERLY EARNINGS TREND: {trend.symbol}")
    print("=" * 80)

    print(f"\n{'Quarter':<12} {'Revenue':>12} {'Earnings':>12}")
    print("-" * 80)

    for q in trend.quarters:
        revenue_str = f"${q.revenue/1e9:.2f}B" if q.revenue is not None and q.revenue > 0 else "N/A"
        earnings_str = f"${q.earnings/1e9:.2f}B" if q.earnings is not None and q.earnings > 0 else "N/A"
        print(f"{q.quarter:<12} {revenue_str:>12} {earnings_str:>12}")

    # Calculate growth rates
    if len(trend.quarters) >= 2:
        latest = trend.quarters[-1].earnings
        prev = trend.quarters[-2].earnings
        if latest is not None and prev is not None and prev != 0:
            qoq_growth = (latest - prev) / abs(prev) * 100
            print(f"\n  QoQ Earnings Growth: {qoq_growth:+.1f}%", end="")
            if qoq_growth > 20:
                print("  Strong growth")
            elif qoq_growth > 0:
                print("  Positive growth")
            elif qoq_growth < -20:
                print("  Significant decline")
            else:
                print()

    print()


def main():
    parser = argparse.ArgumentParser(
        description="Fetch earnings calendar and historical data",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python fetch_earnings.py AAPL              # Earnings calendar + recent history
  python fetch_earnings.py AAPL --history 12 # Show 12 historical earnings
        """
    )
    parser.add_argument(
        "symbol",
        help="Stock symbol to analyze"
    )
    parser.add_argument(
        "--history",
        type=int,
        default=8,
        help="Number of historical earnings to show (default: 8)"
    )
    parser.add_argument(
        "--provider",
        default=DEFAULT_PROVIDER,
        choices=PROVIDERS.keys(),
        help=f"Data provider (default: {DEFAULT_PROVIDER})"
    )

    args = parser.parse_args()
    provider = get_provider(args.provider)

    print(f"Fetching earnings data for {args.symbol.upper()}...")

    try:
        # Display earnings calendar
        cal = provider.get_earnings_calendar(args.symbol)
        display_earnings_calendar(cal)

        # Display earnings history
        history = provider.get_earnings_history(args.symbol, args.history)
        display_earnings_history(history)

        # Display earnings trend
        trend = provider.get_earnings_trend(args.symbol)
        display_earnings_trend(trend)

    except Exception as e:
        print(f"Error fetching earnings data for {args.symbol}: {e}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        sys.exit(0)
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)
