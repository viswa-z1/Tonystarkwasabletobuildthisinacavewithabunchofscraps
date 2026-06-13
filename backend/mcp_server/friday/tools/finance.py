"""Finance tools: get_stock_quote, get_market_summary"""

def register(mcp):

    @mcp.tool()
    async def get_stock_quote(symbol: str) -> str:
        """Get current stock price for a ticker symbol."""
        # TODO: implement Alpha Vantage API call
        return f"[get_stock_quote] symbol={symbol} — not yet implemented"

    @mcp.tool()
    async def get_market_summary() -> str:
        """Get a brief summary of major market indices."""
        # TODO: implement market summary
        return "[get_market_summary] — not yet implemented"

