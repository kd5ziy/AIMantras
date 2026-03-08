#!/usr/bin/env python3
"""Fetch foreign exchange rates.

Usage:
    python fetch_fx.py EUR USD          # Get EUR/USD rate
    python fetch_fx.py SEK EUR          # Get SEK/EUR rate
    python fetch_fx.py --base EUR       # Show all rates vs EUR
    python fetch_fx.py --convert 1000 SEK EUR  # Convert 1000 SEK to EUR
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


def display_rate(provider, from_currency: str, to_currency: str):
    """Display exchange rate between two currencies."""
    try:
        rate = provider.get_fx_rate(from_currency, to_currency)
        inverse_rate = 1.0 / rate if rate > 0 else 0.0

        print(f"\nExchange Rate")
        print("=" * 60)
        print(f"1 {from_currency} = {rate:.6f} {to_currency}")
        print(f"1 {to_currency} = {inverse_rate:.6f} {from_currency}")
        print()

        # Show common conversion amounts
        common_amounts = [1, 10, 100, 1000, 10000]
        print(f"{'Amount ' + from_currency:>12} | {to_currency + ' Equivalent':<12}")
        print("-" * 27)
        for amt in common_amounts:
            converted = amt * rate
            print(f"{amt:>12,.0f} | {converted:<12,.2f}")
        print()

    except ValueError as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)


def display_base_rates(provider, base_currency: str):
    """Display rates for multiple currencies vs a base currency."""
    base = base_currency.upper()

    # Common currencies to check
    currencies = ["USD", "EUR", "GBP", "JPY", "CHF", "CAD", "AUD", "SEK", "NOK", "DKK", "PLN"]

    # Remove base currency from list
    if base in currencies:
        currencies.remove(base)

    print(f"\nExchange Rates (Base: {base})")
    print("=" * 60)
    print(f"{'Currency':<10} {'1 {base} =':<15} {'Rate':>12}")
    print("-" * 60)

    for currency in currencies:
        try:
            rate = provider.get_fx_rate(base, currency)
            print(f"{currency:<10} 1 {base} = {rate:>12.6f} {currency}")
        except ValueError:
            print(f"{currency:<10} {'N/A':>28}")

    print()


def main():
    parser = argparse.ArgumentParser(
        description="Fetch foreign exchange rates",
        formatter_class=argparse.RawDescriptionHelpFormatter
    )

    # Positional arguments for basic rate lookup
    parser.add_argument(
        "from_currency",
        nargs="?",
        help="Source currency (e.g., SEK, USD)"
    )
    parser.add_argument(
        "to_currency",
        nargs="?",
        help="Target currency (e.g., EUR, USD)"
    )

    # Options
    parser.add_argument(
        "--base",
        help="Show rates for all currencies vs base currency"
    )
    parser.add_argument(
        "--convert",
        nargs=3,
        metavar=("AMOUNT", "FROM", "TO"),
        help="Convert amount from one currency to another"
    )
    parser.add_argument(
        "--provider",
        default=DEFAULT_PROVIDER,
        choices=PROVIDERS.keys(),
        help=f"Data provider (default: {DEFAULT_PROVIDER})"
    )

    args = parser.parse_args()
    provider = get_provider(args.provider)

    # Handle different modes
    if args.convert:
        # Convert mode
        try:
            amount = float(args.convert[0])
            from_curr = args.convert[1].upper()
            to_curr = args.convert[2].upper()

            rate = provider.get_fx_rate(from_curr, to_curr)
            converted = amount * rate

            print(f"\nCurrency Conversion")
            print("=" * 60)
            print(f"{amount:,.2f} {from_curr} = {converted:,.2f} {to_curr}")
            print(f"Exchange rate: 1 {from_curr} = {rate:.6f} {to_curr}")
            print()

        except ValueError as e:
            print(f"Error: {e}", file=sys.stderr)
            sys.exit(1)

    elif args.base:
        # Show all rates vs base currency
        display_base_rates(provider, args.base)

    elif args.from_currency and args.to_currency:
        # Simple rate lookup
        display_rate(provider, args.from_currency, args.to_currency)

    else:
        # No valid arguments provided
        parser.print_help()
        sys.exit(1)


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        sys.exit(0)
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)
