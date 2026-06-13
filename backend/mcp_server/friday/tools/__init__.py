from .web import register as register_web
from .system import register as register_system
from .dashboard import register as register_dashboard
from .weather import register as register_weather
from .finance import register as register_finance

def register_all_tools(mcp):
    register_web(mcp)
    register_system(mcp)
    register_dashboard(mcp)
    register_weather(mcp)
    register_finance(mcp)

