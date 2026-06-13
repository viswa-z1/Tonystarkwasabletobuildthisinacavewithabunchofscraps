"""Dashboard tools: push panel open events to the connected web client."""
import httpx
from friday.config import config

def register(mcp):

    @mcp.tool()
    async def open_world_monitor() -> str:
        """
        Opens the World Monitor dashboard in the connected web client.
        Use this when the user wants a visual overview of global events or a real-time map.
        """
        try:
            async with httpx.AsyncClient() as client:
                await client.post(
                    f"{config.GATEWAY_URL}/internal/event",
                    json={"type": "dashboard_event", "payload": {"panel": "world_map"}},
                    headers={"X-Internal-Secret": config.GATEWAY_INTERNAL_SECRET},
                    timeout=5,
                )
            return "Displaying the World Monitor on your primary screen now, boss."
        except Exception as e:
            return f"I'm unable to initialize the visual monitor: {e}"

    @mcp.tool()
    async def open_finance_world_monitor() -> str:
        """
        Opens the Finance World Monitor dashboard in the connected web client.
        Use this when the user wants a visual overview of global financial markets and trends.
        """
        try:
            async with httpx.AsyncClient() as client:
                await client.post(
                    f"{config.GATEWAY_URL}/internal/event",
                    json={"type": "dashboard_event", "payload": {"panel": "finance_map"}},
                    headers={"X-Internal-Secret": config.GATEWAY_INTERNAL_SECRET},
                    timeout=5,
                )
            return "Displaying the Finance World Monitor on your primary screen now, boss."
        except Exception as e:
            return f"I'm unable to initialize the finance monitor: {e}"

