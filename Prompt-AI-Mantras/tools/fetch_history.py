#!/usr/bin/env python3
"""Fetch historical OHLCV data for a stock.

Usage:
    python fetch_history.py MU
    python fetch_history.py AAPL --period 3mo --interval 1wk
    python fetch_history.py NVDA -n 10
"""

import argparse
import sys

from config import DEFAULT_PROVIDER
from providers import YFinanceProvider


# Registry of available providers
PROVIDERS = {
    "yfinance": YFinanceProvider,
}

# Valid periods and intervals for yfinance
VALID_PERIODS = ["1d", "5d", "1mo", "3mo", "6mo", "1y", "2y", "5y", "10y", "ytd", "max"]
VALID_INTERVALS = ["1d", "5d", "1wk", "1mo", "3mo"]


def get_provider(name: str):
    """Get provider instance by name."""
    if name not in PROVIDERS:
        available = ", ".join(PROVIDERS.keys())
        raise ValueError(f"Unknown provider '{name}'. Available: {available}")
    return PROVIDERS[name]()


def main():
    parser = argparse.ArgumentParser(
        description="Fetch historical OHLCV data for a stock"
    )
    parser.add_argument(
        "symbol",
        help="Ticker symbol (e.g., MU, AAPL, SPY)"
    )
    parser.add_argument(
        "--period",
        default="1mo",
        choices=VALID_PERIODS,
        help="Data period (default: 1mo)"
    )
    parser.add_argument(
        "--interval",
        default="1d",
        choices=VALID_INTERVALS,
        help="Data interval (default: 1d)"
    )
    parser.add_argument(
        "-n", "--limit",
        type=int,
        default=None,
        help="Limit output to last N bars"
    )
    parser.add_argument(
        "--provider", "-p",
        default=DEFAULT_PROVIDER,
        choices=PROVIDERS.keys(),
        help=f"Data provider to use (default: {DEFAULT_PROVIDER})"
    )

    args = parser.parse_args()

    provider = get_provider(args.provider)
    history = provider.get_history(
        args.symbol,
        period=args.period,
        interval=args.interval,
    )
    history.display(limit=args.limit)


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        sys.exit(0)
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)
