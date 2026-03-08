#!/usr/bin/env python3
"""Fetch real-time stock quote.

Usage:
    python fetch_quote.py AAPL
    python fetch_quote.py MU --provider yfinance
"""

import argparse
import sys

from config import DEFAULT_PROVIDER
from providers import YFinanceProvider


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


def main():
    parser = argparse.ArgumentParser(
        description="Fetch real-time stock quote"
    )
    parser.add_argument(
        "symbol",
        help="Ticker symbol (e.g., MU, AAPL, SPY)"
    )
    parser.add_argument(
        "--provider", "-p",
        default=DEFAULT_PROVIDER,
        choices=PROVIDERS.keys(),
        help=f"Data provider to use (default: {DEFAULT_PROVIDER})"
    )

    args = parser.parse_args()

    provider = get_provider(args.provider)
    quote = provider.get_quote(args.symbol)
    quote.display()


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        sys.exit(0)
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)
