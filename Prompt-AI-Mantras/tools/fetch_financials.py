#!/usr/bin/env python3
"""Financial statements fetcher - get fundamental financial data.

Usage:
    python fetch_financials.py AAPL
    python fetch_financials.py AAPL --statement income
    python fetch_financials.py AAPL --statement balance
    python fetch_financials.py AAPL --statement cashflow
    python fetch_financials.py AAPL --period quarterly
"""

import argparse
import sys
from typing import Optional

from config import DEFAULT_PROVIDER
from providers import YFinanceProvider, FinancialSummary, FinancialStatement


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


def format_number(value: Optional[float], is_currency: bool = True) -> str:
    """Format large numbers with B/M/K suffix."""
    if value is None:
        return "N/A"

    abs_value = abs(value)
    sign = "-" if value < 0 else ""
    prefix = "$" if is_currency else ""

    if abs_value >= 1e9:
        return f"{sign}{prefix}{abs_value/1e9:.2f}B"
    elif abs_value >= 1e6:
        return f"{sign}{prefix}{abs_value/1e6:.2f}M"
    elif abs_value >= 1e3:
        return f"{sign}{prefix}{abs_value/1e3:.2f}K"
    else:
        return f"{sign}{prefix}{abs_value:.2f}"


def format_percent(value: Optional[float]) -> str:
    """Format percentage values."""
    if value is None:
        return "N/A"
    return f"{value*100:.2f}%"


def display_summary(summary: FinancialSummary):
    """Display high-level financial summary."""
    print("\n" + "=" * 80)
    print(f"FINANCIAL SUMMARY: {summary.name} ({summary.symbol})")
    print("=" * 80)

    # Company info
    print(f"\nSector: {summary.sector}")
    print(f"Industry: {summary.industry}")
    print(f"Market Cap: {format_number(summary.market_cap)}")

    # Key metrics
    print("\n" + "-" * 80)
    print("KEY METRICS")
    print("-" * 80)

    # Revenue & Profitability
    print(f"  Revenue (TTM):              {format_number(summary.revenue)}")
    print(f"  Revenue Growth (YoY):       {format_percent(summary.revenue_growth)}")
    print(f"  Gross Margin:               {format_percent(summary.gross_margin)}")
    print(f"  Operating Margin:           {format_percent(summary.operating_margin)}")
    print(f"  Profit Margin:              {format_percent(summary.profit_margin)}")

    # Earnings
    print(f"\n  EPS (TTM):                  {format_number(summary.trailing_eps, False)}")
    print(f"  EPS Forward:                {format_number(summary.forward_eps, False)}")
    print(f"  P/E Ratio:                  {format_number(summary.trailing_pe, False)}")
    print(f"  PEG Ratio:                  {format_number(summary.peg_ratio, False)}")

    # Balance sheet
    print(f"\n  Total Cash:                 {format_number(summary.total_cash)}")
    print(f"  Total Debt:                 {format_number(summary.total_debt)}")
    if summary.debt_to_equity is not None:
        print(f"  Debt to Equity:             {summary.debt_to_equity:.2f}")

    # Cash flow
    print(f"\n  Operating Cash Flow:        {format_number(summary.operating_cashflow)}")
    print(f"  Free Cash Flow:             {format_number(summary.free_cashflow)}")

    # Returns
    if summary.return_on_equity is not None:
        print(f"\n  Return on Equity (ROE):     {format_percent(summary.return_on_equity)}")
    if summary.return_on_assets is not None:
        print(f"  Return on Assets (ROA):     {format_percent(summary.return_on_assets)}")

    print()


# Line items to display for each statement type
INCOME_LINE_ITEMS = [
    ("Total Revenue", "Total Revenue"),
    ("Cost of Revenue", "Cost Of Revenue"),
    ("Gross Profit", "Gross Profit"),
    ("Operating Expense", "Operating Expense"),
    ("Operating Income", "Operating Income"),
    ("Net Income", "Net Income"),
    ("EBITDA", "EBITDA"),
]

BALANCE_LINE_ITEMS = [
    ("ASSETS", None),
    ("  Total Assets", "Total Assets"),
    ("  Current Assets", "Current Assets"),
    ("  Cash & Equivalents", "Cash And Cash Equivalents"),
    ("", None),
    ("LIABILITIES", None),
    ("  Total Liabilities", "Total Liabilities Net Minority Interest"),
    ("  Current Liabilities", "Current Liabilities"),
    ("  Total Debt", "Total Debt"),
    ("", None),
    ("EQUITY", None),
    ("  Stockholders Equity", "Stockholders Equity"),
]

CASHFLOW_LINE_ITEMS = [
    ("Operating Cash Flow", "Operating Cash Flow"),
    ("Investing Cash Flow", "Investing Cash Flow"),
    ("Financing Cash Flow", "Financing Cash Flow"),
    ("Free Cash Flow", "Free Cash Flow"),
    ("Capital Expenditure", "Capital Expenditure"),
]


def display_statement(stmt: FinancialStatement):
    """Display a financial statement."""
    if not stmt.dates:
        print(f"\nNo {stmt.statement_type} statement data available for {stmt.symbol}")
        return

    titles = {
        "income": "INCOME STATEMENT",
        "balance": "BALANCE SHEET",
        "cashflow": "CASH FLOW STATEMENT",
    }
    line_items_map = {
        "income": INCOME_LINE_ITEMS,
        "balance": BALANCE_LINE_ITEMS,
        "cashflow": CASHFLOW_LINE_ITEMS,
    }

    title = titles.get(stmt.statement_type, stmt.statement_type.upper())
    line_items = line_items_map.get(stmt.statement_type, [])

    print("\n" + "=" * 80)
    print(f"{title}: {stmt.symbol} ({stmt.period.capitalize()})")
    print("=" * 80)

    # Build a lookup from label to row values
    row_lookup = {row.label: row.values for row in stmt.rows}

    # Display header
    print(f"\n{'Line Item':<25}", end="")
    for date in stmt.dates:
        print(f"{date:>15}", end="")
    print()
    print("-" * 80)

    # Display each line item
    for label, key in line_items:
        if key is None:
            if label:  # Section header
                print(f"\n{label}")
            else:  # Blank line
                print()
        elif key in row_lookup:
            print(f"{label:<25}", end="")
            for date in stmt.dates:
                value = row_lookup[key].get(date)
                print(f"{format_number(value):>15}", end="")
            print()

    print()


def main():
    parser = argparse.ArgumentParser(
        description="Fetch financial statements for a security",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python fetch_financials.py AAPL                    # Summary + all statements
  python fetch_financials.py AAPL --statement income # Income statement only
  python fetch_financials.py AAPL --period quarterly # Quarterly data
        """
    )
    parser.add_argument(
        "symbol",
        help="Stock symbol to analyze"
    )
    parser.add_argument(
        "--statement",
        choices=["summary", "income", "balance", "cashflow", "all"],
        default="all",
        help="Which statement to display (default: all)"
    )
    parser.add_argument(
        "--period",
        choices=["annual", "quarterly"],
        default="annual",
        help="Annual or quarterly data (default: annual)"
    )
    parser.add_argument(
        "--provider",
        default=DEFAULT_PROVIDER,
        choices=PROVIDERS.keys(),
        help=f"Data provider (default: {DEFAULT_PROVIDER})"
    )

    args = parser.parse_args()
    provider = get_provider(args.provider)

    print(f"Fetching financial data for {args.symbol.upper()}...")

    try:
        if args.statement in ["summary", "all"]:
            summary = provider.get_financial_summary(args.symbol)
            display_summary(summary)

        if args.statement in ["income", "all"]:
            stmt = provider.get_financial_statement(args.symbol, "income", args.period)
            display_statement(stmt)

        if args.statement in ["balance", "all"]:
            stmt = provider.get_financial_statement(args.symbol, "balance", args.period)
            display_statement(stmt)

        if args.statement in ["cashflow", "all"]:
            stmt = provider.get_financial_statement(args.symbol, "cashflow", args.period)
            display_statement(stmt)

    except Exception as e:
        print(f"Error fetching financials for {args.symbol}: {e}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        sys.exit(0)
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)
