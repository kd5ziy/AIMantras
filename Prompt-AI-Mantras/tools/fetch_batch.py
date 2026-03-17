#!/usr/bin/env python3
"""Fetch quotes for multiple stocks at once.

Usage:
    python fetch_batch.py MU NVDA AAPL
    python fetch_batch.py MU NVDA --provider yfinance
"""

import argparse
import sys
from typing import List

from config import DEFAULT_PROVIDER
from providers import Quote, YFinanceProvider


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


def format_price(price: float) -> str:
    """Format price with dollar sign."""
    return f"${price:,.2f}"


def format_change(quote: Quote) -> str:
    """Format change with color indicators."""
    sign = "+" if quote.change >= 0 else ""
    return f"{sign}{quote.change:.2f} ({sign}{quote.change_percent:.2f}%)"


def format_volume(volume: int | None) -> str:
    """Format volume with K/M suffix."""
    if volume is None:
        return "N/A"
    if volume >= 1e9:
        return f"{volume/1e9:.2f}B"
    if volume >= 1e6:
        return f"{volume/1e6:.2f}M"
    if volume >= 1e3:
        return f"{volume/1e3:.1f}K"
    return f"{volume:,}"


def format_market_cap(cap: float | None) -> str:
    """Format market cap with B/M/T suffix."""
    if cap is None or cap <= 0:
        return "N/A"
    if cap >= 1e12:
        return f"${cap/1e12:.2f}T"
    if cap >= 1e9:
        return f"${cap/1e9:.2f}B"
    if cap >= 1e6:
        return f"${cap/1e6:.2f}M"
    return f"${cap:,.0f}"


def display_batch(quotes: List[Quote], errors: dict) -> None:
    """Display multiple quotes in table format."""
    if not quotes and not errors:
        print("No data to display.")
        return

    # Print table header
    print()
    print(f"{'Symbol':<8} {'Name':<25} {'Price':>12} {'Change':>18} {'Volume':>10} {'Mkt Cap':>10}")
    print("-" * 95)

    # Print each quote
    for q in quotes:
        name = q.name[:24] if len(q.name) > 24 else q.name
        print(
            f"{q.symbol:<8} "
            f"{name:<25} "
            f"{format_price(q.price):>12} "
            f"{format_change(q):>18} "
            f"{format_volume(q.volume):>10} "
            f"{format_market_cap(q.market_cap):>10}"
        )

    # Print errors if any
    if errors:
        print("-" * 95)
        for symbol, error in errors.items():
            print(f"{symbol:<8} Error: {error}")

    print()


def main():
    parser = argparse.ArgumentParser(
        description="Fetch quotes for multiple stocks"
    )
    parser.add_argument(
        "symbols",
        nargs="+",
        help="Ticker symbols (e.g., MU NVDA AAPL)"
    )
    parser.add_argument(
        "--provider", "-p",
        default=DEFAULT_PROVIDER,
        choices=PROVIDERS.keys(),
        help=f"Data provider to use (default: {DEFAULT_PROVIDER})"
    )

    args = parser.parse_args()

    provider = get_provider(args.provider)

    quotes = []
    errors = {}

    for symbol in args.symbols:
        try:
            quote = provider.get_quote(symbol)
            quotes.append(quote)
        except Exception as e:
            errors[symbol.upper()] = str(e)

    display_batch(quotes, errors)


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        sys.exit(0)
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)
