"""Rate limiting via Redis"""
import redis.asyncio as aioredis
from config import settings

_redis = None

async def get_redis():
    global _redis
    if _redis is None:
        _redis = aioredis.from_url(settings.REDIS_URL)
    return _redis

async def check_rate_limit(key: str, limit: int, window_seconds: int) -> bool:
    r = await get_redis()
    current = await r.incr(key)
    if current == 1:
        await r.expire(key, window_seconds)
    return current <= limit

