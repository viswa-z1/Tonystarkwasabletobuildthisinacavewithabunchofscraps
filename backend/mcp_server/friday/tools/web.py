"""
Web tools — global news briefings, finance news, web search, and URL fetching.
"""
import httpx
import xml.etree.ElementTree as ET
import asyncio
import re

WORLD_NEWS_FEEDS = [
    "https://feeds.bbci.co.uk/news/world/rss.xml",
    "https://www.cnbc.com/id/100727362/device/rss/rss.html",
    "https://rss.nytimes.com/services/xml/rss/nyt/World.xml",
    "https://www.aljazeera.com/xml/rss/all.xml",
]

FINANCE_NEWS_FEEDS = [
    "https://www.cnbc.com/id/10000664/device/rss/rss.html",
    "https://feeds.bloomberg.com/markets/news.rss",
    "https://rss.nytimes.com/services/xml/rss/nyt/Business.xml",
    "https://feeds.marketwatch.com/marketwatch/topstories/",
]


async def _fetch_feed(client: httpx.AsyncClient, url: str) -> list[dict]:
    try:
        response = await client.get(url, headers={"User-Agent": "Friday-AI/1.0"}, timeout=5.0)
        if response.status_code != 200:
            return []
        root = ET.fromstring(response.content)
        source = url.split(".")[1].upper()
        items = []
        for item in root.findall(".//item")[:5]:
            title = item.findtext("title")
            description = item.findtext("description")
            link = item.findtext("link")
            if description:
                description = re.sub("<[^<]+?>", "", description).strip()
            items.append({
                "source": source,
                "title": title,
                "summary": description[:200] + "..." if description else "",
                "link": link,
            })
        return items
    except Exception:
        return []


def register(mcp):

    @mcp.tool()
    async def get_world_news() -> str:
        """
        Fetches the latest global headlines from major news outlets simultaneously.
        Use this when the user asks what's happening in the world or for recent events.
        """
        async with httpx.AsyncClient(follow_redirects=True, timeout=10) as client:
            results = await asyncio.gather(*[_fetch_feed(client, url) for url in WORLD_NEWS_FEEDS])
        articles = [item for sublist in results for item in sublist]
        if not articles:
            return "The global news grid is unresponsive, boss. I'm unable to pull headlines."
        lines = ["### GLOBAL NEWS BRIEFING (LIVE)\n"]
        for entry in articles[:12]:
            lines.append(f"**[{entry['source']}]** {entry['title']}")
            lines.append(f"{entry['summary']}")
            lines.append(f"Link: {entry['link']}\n")
        return "\n".join(lines)

    @mcp.tool()
    async def get_world_finance_news() -> str:
        """
        Fetches the latest finance and market headlines from major financial outlets.
        Use this when the user asks about finance news, market updates, or economic developments.
        """
        async with httpx.AsyncClient(follow_redirects=True, timeout=10) as client:
            results = await asyncio.gather(*[_fetch_feed(client, url) for url in FINANCE_NEWS_FEEDS])
        articles = [item for sublist in results for item in sublist]
        if not articles:
            return "The financial feeds are unresponsive right now, boss. I can't pull market headlines."
        lines = ["### FINANCE BRIEFING (LIVE)\n"]
        for entry in articles[:12]:
            lines.append(f"**[{entry['source']}]** {entry['title']}")
            lines.append(f"{entry['summary']}")
            lines.append(f"Link: {entry['link']}\n")
        return "\n".join(lines)

    @mcp.tool()
    async def search_web(query: str) -> str:
        """Search the web for a given query. Use for factual questions requiring a web lookup."""
        return f"[stub] Search results for: {query}"

    @mcp.tool()
    async def fetch_url(url: str) -> str:
        """Fetch the raw text content of a URL."""
        async with httpx.AsyncClient(follow_redirects=True, timeout=10) as client:
            response = await client.get(url)
            response.raise_for_status()
            return response.text[:4000]
