"""System tools: time, environment info."""
from datetime import datetime
import platform
import pytz

def register(mcp):

    @mcp.tool()
    def get_current_time(timezone: str = "Asia/Kolkata") -> str:
        """Return the current date and time. Defaults to IST (Viswa's timezone)."""
        tz = pytz.timezone(timezone)
        now = datetime.now(tz)
        return now.strftime("%I:%M %p, %A %d %B %Y (%Z)")

    @mcp.tool()
    def get_system_info() -> dict:
        """Return basic information about the host system."""
        return {
            "os": platform.system(),
            "os_version": platform.version(),
            "machine": platform.machine(),
            "python_version": platform.python_version(),
            "server": "FRIDAY MCP",
            "status": "operational",
        }

