"""Base provider interface for market data."""

from abc import ABC, abstractmethod
from dataclasses import dataclass, field
from datetime import datetime
from typing import Any, Dict, List, Optional
import textwrap


@dataclass
class HistoricalBar:
    """Single OHLCV bar for historical data."""
    date: datetime
    open: float
    high: float
    low: float
    close: float
    volume: int

    def format_row(self) -> str:
        """Format as a display row."""
        date_str = self.date.strftime("%Y-%m-%d")
        return f"{date_str}  {self.open:>10.2f}  {self.high:>10.2f}  {self.low:>10.2f}  {self.close:>10.2f}  {self.volume:>12,}"


@dataclass
class HistoricalData:
    """Collection of historical OHLCV data."""
    symbol: str
    name: str
    interval: str
    bars: List[HistoricalBar]
    currency: str = "USD"

    def display(self, limit: Optional[int] = None) -> None:
        """Print formatted historical data to stdout."""
        print(f"\n{self.name} ({self.symbol}) - {self.interval.capitalize()} Data")
        print("-" * 80)
        print(f"{'Date':<12}{'Open':>10}  {'High':>10}  {'Low':>10}  {'Close':>10}  {'Volume':>12}")
        print("-" * 80)

        bars_to_show = self.bars[-limit:] if limit else self.bars
        for bar in bars_to_show:
            print(bar.format_row())

        if len(self.bars) > 0:
            print("-" * 80)
            print(f"Showing {len(bars_to_show)} of {len(self.bars)} bars | Currency: {self.currency}")
        print()


@dataclass
class Quote:
    """Standardized quote data returned by all providers."""
    symbol: str
    name: str
    price: float
    change: float
    change_percent: float
    open: Optional[float] = None
    high: Optional[float] = None
    low: Optional[float] = None
    previous_close: Optional[float] = None
    volume: Optional[int] = None
    market_cap: Optional[float] = None
    currency: str = "USD"

    def format_change(self) -> str:
        """Format change with sign and percentage."""
        sign = "+" if self.change >= 0 else ""
        return f"{sign}{self.change:.2f} ({sign}{self.change_percent:.2f}%)"

    def format_volume(self) -> str:
        """Format volume with K/M suffix."""
        if self.volume is None:
            return "N/A"
        if self.volume >= 1e6:
            return f"{self.volume/1e6:.2f}M"
        if self.volume >= 1e3:
            return f"{self.volume/1e3:.1f}K"
        return f"{self.volume:,}"

    def format_market_cap(self) -> str:
        """Format market cap with B/M/T suffix."""
        if self.market_cap is None or self.market_cap <= 0:
            return "N/A"
        if self.market_cap >= 1e12:
            return f"${self.market_cap/1e12:.2f}T"
        if self.market_cap >= 1e9:
            return f"${self.market_cap/1e9:.2f}B"
        if self.market_cap >= 1e6:
            return f"${self.market_cap/1e6:.2f}M"
        return f"${self.market_cap:,.0f}"

    def display(self) -> None:
        """Print formatted quote to stdout."""
        print(f"\n{self.name} ({self.symbol})")
        print("-" * 40)
        print(f"Price:       ${self.price:.2f} {self.currency}")
        print(f"Change:      {self.format_change()}")
        if self.open is not None:
            print(f"Open:        ${self.open:.2f}")
        if self.low is not None and self.high is not None:
            print(f"Day Range:   ${self.low:.2f} - ${self.high:.2f}")
        if self.previous_close is not None:
            print(f"Prev Close:  ${self.previous_close:.2f}")
        print(f"Volume:      {self.format_volume()}")
        print(f"Market Cap:  {self.format_market_cap()}")
        print()


@dataclass
class NewsItem:
    """Single news article or headline."""
    title: str
    publisher: str
    published_at: datetime
    link: Optional[str] = None
    summary: Optional[str] = None

    def format_date(self) -> str:
        """Format published date for display."""
        from datetime import timezone

        # Get current time (make timezone-aware if published_at is timezone-aware)
        if self.published_at.tzinfo is not None:
            now = datetime.now(timezone.utc)
        else:
            now = datetime.now()

        diff = now - self.published_at

        if diff.days == 0:
            hours = diff.seconds // 3600
            if hours == 0:
                minutes = diff.seconds // 60
                return f"{minutes}m ago"
            return f"{hours}h ago"
        elif diff.days == 1:
            return "1 day ago"
        elif diff.days < 7:
            return f"{diff.days} days ago"
        else:
            return self.published_at.strftime("%Y-%m-%d")

    def display(self, show_summary: bool = False, width: int = 80) -> None:
        """Print formatted news item."""
        # Title and metadata
        print(f"• {self.title}")
        print(f"  {self.publisher} | {self.format_date()}")

        # Optional summary
        if show_summary and self.summary:
            wrapped = textwrap.fill(self.summary, width=width-2, initial_indent="  ", subsequent_indent="  ")
            print(wrapped)

        # Optional link
        if self.link:
            print(f"  {self.link}")
        print()


@dataclass
class NewsFeed:
    """Collection of news items for a symbol."""
    symbol: str
    name: str
    items: List[NewsItem]

    def display(self, limit: Optional[int] = None, show_summary: bool = False) -> None:
        """Print formatted news feed."""
        print(f"\n{self.name} ({self.symbol}) - Recent News")
        print("=" * 80)

        items_to_show = self.items[:limit] if limit else self.items

        if not items_to_show:
            print("\nNo recent news found.")
            print()
            return

        for item in items_to_show:
            item.display(show_summary=show_summary)

        if len(self.items) > len(items_to_show):
            print(f"Showing {len(items_to_show)} of {len(self.items)} news items")
        else:
            print(f"Total: {len(items_to_show)} news item(s)")
        print()


@dataclass
class FinancialSummary:
    """High-level financial summary for a company."""
    symbol: str
    name: str
    sector: str = "N/A"
    industry: str = "N/A"
    market_cap: Optional[float] = None
    revenue: Optional[float] = None
    revenue_growth: Optional[float] = None
    gross_margin: Optional[float] = None
    operating_margin: Optional[float] = None
    profit_margin: Optional[float] = None
    trailing_eps: Optional[float] = None
    forward_eps: Optional[float] = None
    trailing_pe: Optional[float] = None
    peg_ratio: Optional[float] = None
    total_cash: Optional[float] = None
    total_debt: Optional[float] = None
    debt_to_equity: Optional[float] = None
    operating_cashflow: Optional[float] = None
    free_cashflow: Optional[float] = None
    return_on_equity: Optional[float] = None
    return_on_assets: Optional[float] = None


@dataclass
class StatementRow:
    """A single row in a financial statement (one line item across periods)."""
    label: str
    values: Dict[str, Optional[float]] = field(default_factory=dict)


@dataclass
class FinancialStatement:
    """A financial statement (income, balance sheet, or cash flow)."""
    symbol: str
    statement_type: str  # "income", "balance", "cashflow"
    period: str  # "annual" or "quarterly"
    dates: List[str] = field(default_factory=list)
    rows: List[StatementRow] = field(default_factory=list)


@dataclass
class EarningsCalendar:
    """Upcoming earnings and analyst estimates."""
    symbol: str
    name: str
    next_earnings_date: Optional[str] = None
    next_earnings_date_end: Optional[str] = None
    forward_eps: Optional[float] = None
    recommendation: Optional[str] = None
    num_analysts: Optional[int] = None
    target_price_mean: Optional[float] = None
    target_price_low: Optional[float] = None
    target_price_high: Optional[float] = None


@dataclass
class EarningsRecord:
    """A single historical earnings record."""
    date: str
    reported_eps: Optional[float] = None
    estimated_eps: Optional[float] = None
    surprise: Optional[float] = None
    surprise_percent: Optional[float] = None


@dataclass
class EarningsHistory:
    """Historical earnings with surprises."""
    symbol: str
    records: List[EarningsRecord] = field(default_factory=list)


@dataclass
class QuarterlyEarning:
    """A single quarter's revenue and earnings."""
    quarter: str
    revenue: Optional[float] = None
    earnings: Optional[float] = None


@dataclass
class EarningsTrend:
    """Quarterly earnings trend data."""
    symbol: str
    quarters: List[QuarterlyEarning] = field(default_factory=list)


class Provider(ABC):
    """Abstract base class for market data providers."""

    @property
    @abstractmethod
    def name(self) -> str:
        """Provider name for display."""
        pass

    @abstractmethod
    def get_quote(self, symbol: str) -> Quote:
        """Fetch real-time quote for a symbol."""
        pass

    @abstractmethod
    def get_history(
        self,
        symbol: str,
        period: str = "1mo",
        interval: str = "1d",
    ) -> HistoricalData:
        """Fetch historical OHLCV data for a symbol.

        Args:
            symbol: Ticker symbol (e.g., MU, AAPL)
            period: Data period - 1d, 5d, 1mo, 3mo, 6mo, 1y, 2y, 5y, 10y, ytd, max
            interval: Data interval - 1d, 5d, 1wk, 1mo, 3mo

        Returns:
            HistoricalData with list of OHLCV bars
        """
        pass

    @abstractmethod
    def get_news(self, symbol: str, limit: int = 10) -> NewsFeed:
        """Fetch recent news for a symbol.

        Args:
            symbol: Ticker symbol (e.g., MU, AAPL)
            limit: Maximum number of news items to return

        Returns:
            NewsFeed with list of news items
        """
        pass

    @abstractmethod
    def get_fx_rate(self, from_currency: str, to_currency: str) -> float:
        """Fetch exchange rate between two currencies.

        Args:
            from_currency: Source currency code (e.g., 'EUR', 'USD')
            to_currency: Target currency code (e.g., 'USD', 'GBP')

        Returns:
            Exchange rate (1 unit of from_currency in to_currency)
        """
        pass

    @abstractmethod
    def get_financial_summary(self, symbol: str) -> FinancialSummary:
        """Fetch high-level financial summary for a company.

        Args:
            symbol: Ticker symbol (e.g., 'AAPL')

        Returns:
            FinancialSummary with key financial metrics
        """
        pass

    @abstractmethod
    def get_financial_statement(
        self,
        symbol: str,
        statement_type: str = "income",
        period: str = "annual",
    ) -> FinancialStatement:
        """Fetch a financial statement (income, balance, cashflow).

        Args:
            symbol: Ticker symbol
            statement_type: 'income', 'balance', or 'cashflow'
            period: 'annual' or 'quarterly'

        Returns:
            FinancialStatement with rows of line items across periods
        """
        pass

    @abstractmethod
    def get_earnings_calendar(self, symbol: str) -> EarningsCalendar:
        """Fetch upcoming earnings date and analyst estimates.

        Args:
            symbol: Ticker symbol

        Returns:
            EarningsCalendar with next date and estimates
        """
        pass

    @abstractmethod
    def get_earnings_history(self, symbol: str, limit: int = 8) -> EarningsHistory:
        """Fetch historical earnings with surprises.

        Args:
            symbol: Ticker symbol
            limit: Number of historical records

        Returns:
            EarningsHistory with list of records
        """
        pass

    @abstractmethod
    def get_earnings_trend(self, symbol: str) -> EarningsTrend:
        """Fetch quarterly earnings trend.

        Args:
            symbol: Ticker symbol

        Returns:
            EarningsTrend with quarterly data
        """
        pass
