"""Weather tool: get_weather"""
import httpx
from friday.config import config

def register(mcp):

    @mcp.tool()
    async def get_weather(city: str = "Chennai") -> str:
        """Get current weather for a city."""
        # TODO: implement OpenWeatherMap API call
        return f"[get_weather] city={city} — not yet implemented"

