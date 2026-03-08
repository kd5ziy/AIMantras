"""Yahoo Finance provider using yfinance library."""

from datetime import datetime
import yfinance as yf

import pandas as pd

from .base import (
    EarningsCalendar,
    EarningsHistory,
    EarningsRecord,
    EarningsTrend,
    FinancialStatement,
    FinancialSummary,
    HistoricalBar,
    HistoricalData,
    NewsItem,
    NewsFeed,
    Provider,
    QuarterlyEarning,
    Quote,
    StatementRow,
)




class YFinanceProvider(Provider):
    """Market data provider using Yahoo Finance (via yfinance)."""

    @property
    def name(self) -> str:
        return "Yahoo Finance"

    def get_quote(self, symbol: str) -> Quote:
        """Fetch real-time quote for a symbol."""
        ticker = yf.Ticker(symbol)
        info = ticker.info

        # yfinance returns different fields depending on security type
        # Handle common variations
        price = info.get("regularMarketPrice") or info.get("currentPrice") or 0
        prev_close = info.get("regularMarketPreviousClose") or info.get("previousClose")

        # Calculate change
        if prev_close and price:
            change = price - prev_close
            change_pct = (change / prev_close) * 100
        else:
            change = info.get("regularMarketChange", 0)
            change_pct = info.get("regularMarketChangePercent", 0)

        return Quote(
            symbol=symbol.upper(),
            name=info.get("shortName") or info.get("longName") or symbol.upper(),
            price=price,
            change=change,
            change_percent=change_pct,
            open=info.get("regularMarketOpen") or info.get("open"),
            high=info.get("regularMarketDayHigh") or info.get("dayHigh"),
            low=info.get("regularMarketDayLow") or info.get("dayLow"),
            previous_close=prev_close,
            volume=info.get("regularMarketVolume") or info.get("volume"),
            market_cap=info.get("marketCap"),
            currency=info.get("currency", "USD"),
        )

    def get_history(
        self,
        symbol: str,
        period: str = "1mo",
        interval: str = "1d",
    ) -> HistoricalData:
        """Fetch historical OHLCV data for a symbol."""
        ticker = yf.Ticker(symbol)
        info = ticker.info
        df = ticker.history(period=period, interval=interval)

        if df.empty:
            raise ValueError(f"No historical data found for {symbol}")

        bars = []
        for date, row in df.iterrows():
            bars.append(
                HistoricalBar(
                    date=date.to_pydatetime(),
                    open=row["Open"],
                    high=row["High"],
                    low=row["Low"],
                    close=row["Close"],
                    volume=int(row["Volume"]),
                )
            )

        # Map interval codes to display names
        interval_names = {
            "1d": "daily",
            "5d": "5-day",
            "1wk": "weekly",
            "1mo": "monthly",
            "3mo": "quarterly",
        }

        return HistoricalData(
            symbol=symbol.upper(),
            name=info.get("shortName") or info.get("longName") or symbol.upper(),
            interval=interval_names.get(interval, interval),
            bars=bars,
            currency=info.get("currency", "USD"),
        )

    def get_news(self, symbol: str, limit: int = 10) -> NewsFeed:
        """Fetch recent news for a symbol."""
        ticker = yf.Ticker(symbol)
        info = ticker.info

        # Fetch news from yfinance
        try:
            news_data = ticker.news
        except Exception:
            news_data = []

        if not news_data:
            # Return empty feed if no news available
            return NewsFeed(
                symbol=symbol.upper(),
                name=info.get("shortName") or info.get("longName") or symbol.upper(),
                items=[]
            )

        # Parse news items
        items = []
        for article in news_data[:limit]:
            # yfinance returns news with nested 'content' field
            content = article.get("content", article)

            # Extract fields from content
            title = content.get("title", "No title")

            # Publisher can be in provider field
            provider_data = content.get("provider", {})
            publisher = provider_data.get("displayName", "Unknown")

            # Parse timestamp - yfinance uses ISO format string in pubDate
            pub_date = content.get("pubDate") or content.get("displayTime")
            if pub_date:
                try:
                    # Parse ISO format: "2026-01-20T16:16:08Z"
                    published_at = datetime.fromisoformat(pub_date.replace('Z', '+00:00'))
                except (ValueError, AttributeError):
                    published_at = datetime.now()
            else:
                published_at = datetime.now()

            # Link can be in different fields
            link = content.get("previewUrl") or content.get("link")
            if link and not link.startswith('http'):
                link = f"https://finance.yahoo.com{link}"

            # Summary field
            summary = content.get("summary") or content.get("description")

            items.append(NewsItem(
                title=title,
                publisher=publisher,
                published_at=published_at,
                link=link,
                summary=summary
            ))

        return NewsFeed(
            symbol=symbol.upper(),
            name=info.get("shortName") or info.get("longName") or symbol.upper(),
            items=items
        )

    def get_fx_rate(self, from_currency: str, to_currency: str) -> float:
        """Fetch exchange rate between two currencies."""
        from_currency = from_currency.upper()
        to_currency = to_currency.upper()

        if from_currency == to_currency:
            return 1.0

        # Try direct pair (e.g., EURUSD=X)
        symbol = f"{from_currency}{to_currency}=X"
        try:
            ticker = yf.Ticker(symbol)
            info = ticker.info
            rate = info.get("regularMarketPrice") or info.get("bid")
            if rate:
                return float(rate)
        except Exception:
            pass

        # Try inverse pair and invert
        inverse_symbol = f"{to_currency}{from_currency}=X"
        try:
            ticker = yf.Ticker(inverse_symbol)
            info = ticker.info
            rate = info.get("regularMarketPrice") or info.get("bid")
            if rate and rate > 0:
                return 1.0 / float(rate)
        except Exception:
            pass

        # Cross-rate through USD
        if from_currency != "USD" and to_currency != "USD":
            from_usd = self.get_fx_rate(from_currency, "USD")
            usd_to = self.get_fx_rate("USD", to_currency)
            if from_usd and usd_to:
                return from_usd * usd_to

        raise ValueError(f"Could not find exchange rate for {from_currency}/{to_currency}")

    def get_financial_summary(self, symbol: str) -> FinancialSummary:
        """Fetch high-level financial summary for a company."""
        ticker = yf.Ticker(symbol)
        info = ticker.info

        return FinancialSummary(
            symbol=symbol.upper(),
            name=info.get("shortName") or info.get("longName") or symbol.upper(),
            sector=info.get("sector", "N/A"),
            industry=info.get("industry", "N/A"),
            market_cap=info.get("marketCap"),
            revenue=info.get("totalRevenue") or info.get("revenue"),
            revenue_growth=info.get("revenueGrowth"),
            gross_margin=info.get("grossMargins"),
            operating_margin=info.get("operatingMargins"),
            profit_margin=info.get("profitMargins"),
            trailing_eps=info.get("trailingEps"),
            forward_eps=info.get("forwardEps"),
            trailing_pe=info.get("trailingPE"),
            peg_ratio=info.get("pegRatio"),
            total_cash=info.get("totalCash"),
            total_debt=info.get("totalDebt"),
            debt_to_equity=info.get("debtToEquity"),
            operating_cashflow=info.get("operatingCashflow"),
            free_cashflow=info.get("freeCashflow"),
            return_on_equity=info.get("returnOnEquity"),
            return_on_assets=info.get("returnOnAssets"),
        )

    def get_financial_statement(
        self,
        symbol: str,
        statement_type: str = "income",
        period: str = "annual",
    ) -> FinancialStatement:
        """Fetch a financial statement."""
        ticker = yf.Ticker(symbol)

        # Select the right DataFrame
        if statement_type == "income":
            df = ticker.quarterly_financials if period == "quarterly" else ticker.financials
        elif statement_type == "balance":
            df = ticker.quarterly_balance_sheet if period == "quarterly" else ticker.balance_sheet
        elif statement_type == "cashflow":
            df = ticker.quarterly_cashflow if period == "quarterly" else ticker.cashflow
        else:
            raise ValueError(f"Unknown statement type: {statement_type}")

        if df is None or df.empty:
            return FinancialStatement(
                symbol=symbol.upper(),
                statement_type=statement_type,
                period=period,
            )

        # Transpose so dates are rows
        df = df.T

        # Extract dates as strings
        dates = [d.strftime("%Y-%m-%d") for d in df.index[:4]]

        # Build rows for all available columns
        rows = []
        for col in df.columns:
            values = {}
            for date_idx, date in zip(df.index[:4], dates):
                val = df.loc[date_idx, col]
                values[date] = float(val) if pd.notna(val) else None
            rows.append(StatementRow(label=col, values=values))

        return FinancialStatement(
            symbol=symbol.upper(),
            statement_type=statement_type,
            period=period,
            dates=dates,
            rows=rows,
        )

    def get_earnings_calendar(self, symbol: str) -> EarningsCalendar:
        """Fetch upcoming earnings date and analyst estimates."""
        ticker = yf.Ticker(symbol)
        info = ticker.info

        # Parse earnings date
        next_date = None
        next_date_end = None
        earnings_date = info.get("earningsDate")
        if earnings_date:
            if isinstance(earnings_date, list) and len(earnings_date) > 0:
                next_date = self._format_date_value(earnings_date[0])
                if len(earnings_date) > 1:
                    next_date_end = self._format_date_value(earnings_date[-1])
            else:
                next_date = self._format_date_value(earnings_date)

        return EarningsCalendar(
            symbol=symbol.upper(),
            name=info.get("shortName") or info.get("longName") or symbol.upper(),
            next_earnings_date=next_date,
            next_earnings_date_end=next_date_end,
            forward_eps=info.get("forwardEps"),
            recommendation=info.get("recommendationKey", "").upper() or None,
            num_analysts=info.get("numberOfAnalystOpinions"),
            target_price_mean=info.get("targetMeanPrice"),
            target_price_low=info.get("targetLowPrice"),
            target_price_high=info.get("targetHighPrice"),
        )

    def get_earnings_history(self, symbol: str, limit: int = 8) -> EarningsHistory:
        """Fetch historical earnings with surprises."""
        ticker = yf.Ticker(symbol)

        try:
            earnings = ticker.earnings_dates
        except Exception:
            return EarningsHistory(symbol=symbol.upper())

        if earnings is None or earnings.empty:
            return EarningsHistory(symbol=symbol.upper())

        earnings_sorted = earnings.sort_index(ascending=False).head(limit)
        records = []

        for date, row in earnings_sorted.iterrows():
            reported = row.get("Reported EPS")
            estimate = row.get("EPS Estimate")

            surprise = None
            surprise_pct = None
            if pd.notna(reported) and pd.notna(estimate) and estimate != 0:
                surprise = reported - estimate
                surprise_pct = (surprise / abs(estimate)) * 100

            records.append(EarningsRecord(
                date=date.strftime("%Y-%m-%d"),
                reported_eps=float(reported) if pd.notna(reported) else None,
                estimated_eps=float(estimate) if pd.notna(estimate) else None,
                surprise=float(surprise) if surprise is not None else None,
                surprise_percent=float(surprise_pct) if surprise_pct is not None else None,
            ))

        return EarningsHistory(symbol=symbol.upper(), records=records)

    def get_earnings_trend(self, symbol: str) -> EarningsTrend:
        """Fetch quarterly earnings trend."""
        ticker = yf.Ticker(symbol)

        try:
            quarterly = ticker.quarterly_earnings
        except Exception:
            return EarningsTrend(symbol=symbol.upper())

        if quarterly is None or quarterly.empty:
            return EarningsTrend(symbol=symbol.upper())

        quarters = []
        for date, row in quarterly.tail(4).iterrows():
            quarter_str = date.strftime("%Y Q%q") if hasattr(date, "strftime") else str(date)
            revenue = row.get("Revenue")
            earnings = row.get("Earnings")
            quarters.append(QuarterlyEarning(
                quarter=quarter_str,
                revenue=float(revenue) if pd.notna(revenue) else None,
                earnings=float(earnings) if pd.notna(earnings) else None,
            ))

        return EarningsTrend(symbol=symbol.upper(), quarters=quarters)

    @staticmethod
    def _format_date_value(value) -> str:
        """Format a date value from yfinance info to string."""
        if isinstance(value, str):
            return value
        try:
            if isinstance(value, (int, float)):
                return datetime.fromtimestamp(value).strftime("%Y-%m-%d")
            else:
                return value.strftime("%Y-%m-%d")
        except Exception:
            return str(value)
