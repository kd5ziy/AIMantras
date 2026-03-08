#!/usr/bin/env python3
"""Fetch recent news for a stock.

Usage:
    python fetch_news.py AAPL
    python fetch_news.py MU --limit 5
    python fetch_news.py NVDA --summary
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
        description="Fetch recent news for a stock"
    )
    parser.add_argument(
        "symbol",
        help="Ticker symbol (e.g., MU, AAPL, NVDA)"
    )
    parser.add_argument(
        "--limit", "-n",
        type=int,
        default=10,
        help="Maximum number of news items to show (default: 10)"
    )
    parser.add_argument(
        "--summary", "-s",
        action="store_true",
        help="Show article summaries (if available)"
    )
    parser.add_argument(
        "--provider", "-p",
        default=DEFAULT_PROVIDER,
        choices=PROVIDERS.keys(),
        help=f"Data provider to use (default: {DEFAULT_PROVIDER})"
    )

    args = parser.parse_args()

    provider = get_provider(args.provider)
    news = provider.get_news(args.symbol, limit=args.limit)
    news.display(limit=args.limit, show_summary=args.summary)


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        sys.exit(0)
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)
