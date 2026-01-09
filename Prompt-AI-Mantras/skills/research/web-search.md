# Web Search

## Purpose
Find current, relevant information from the web to inform analysis and decision-making. This skill enables personas to access information beyond their training data cutoff.

## When to Use
- Need current events, prices, or statistics
- Researching recent developments in a field
- Verifying claims that may have changed since training
- Finding official documentation or announcements
- Gathering competitive intelligence

## Inputs Required
- **Query**: Clear search terms or question
- **Scope**: Breadth of search (narrow/focused vs. broad/exploratory)
- **Recency**: How recent the information needs to be
- **Source preference**: Academic, news, official, community, etc.

## Outputs Produced
- Relevant information with source attribution
- Summary of findings
- Confidence level in the information
- Suggestions for follow-up searches if needed

## Invocation
```
[Applying web-search skill]
Query: {search terms}
Scope: {narrow|broad}
Recency: {last day|week|month|year|any}
Sources: {preferred source types}
```

## Constraints
- Cannot access paywalled content
- Results depend on search engine availability
- May not find very recent information (indexing delay)
- Should verify critical information from multiple sources
- Respect rate limits and fair use

## Example Usage

**Scenario**: Clara needs current S&P 500 data for financial analysis

```
[Clara applying web-search skill]
Query: "S&P 500 current value January 2025"
Scope: narrow
Recency: last day
Sources: financial news, market data

Results:
- S&P 500 closed at [value] on [date]
- Source: [financial news outlet]
- Confidence: High (multiple sources confirm)
```

## Recommended Personas
- **Clara**: Market data, financial news, company information
- **Kestra**: Technology updates, security advisories, documentation
- **Watson**: Medical research updates, clinical guidelines
- **Franklin**: Cross-domain current events, emerging trends

## Related Skills
- `literature-review`: For academic/scholarly research
- `document-review`: For analyzing found documents
- `fact-verification`: For validating search results
