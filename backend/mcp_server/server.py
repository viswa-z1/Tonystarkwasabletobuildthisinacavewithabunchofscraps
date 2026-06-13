"""
Friday MCP Server — Entry Point
Run with: uv run friday
"""
from mcp.server.fastmcp import FastMCP
from friday.tools import register_all_tools
from friday.prompts import register_all_prompts
from friday.resources import register_all_resources
from friday.config import config

mcp = FastMCP(
    name=config.SERVER_NAME,
    instructions=(
        "You are F.R.I.D.A.Y., Tony Stark's AI, now serving Viswa. "
        "Be concise, accurate, and a little witty. Never say tool names aloud."
    ),
)

register_all_tools(mcp)
register_all_prompts(mcp)
register_all_resources(mcp)

def main():
    mcp.run(transport="sse")

if __name__ == "__main__":
    main()

