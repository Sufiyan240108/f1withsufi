import json
import logging
from typing import Optional, Any
import redis as redis_lib
from config import get_settings

logger = logging.getLogger(__name__)
settings = get_settings()

_client: Optional[redis_lib.Redis] = None


def get_redis_client() -> redis_lib.Redis:
    global _client
    if _client is None:
        _client = redis_lib.Redis.from_url(
            settings.REDIS_URL,
            decode_responses=True,
            socket_connect_timeout=5,
        )
    return _client


def cache_key(*args: Any) -> str:
    """Build a namespaced cache key string."""
    return "openf1:" + ":".join(str(a) for a in args)


def cache_get(key: str) -> Optional[dict]:
    """Retrieve and JSON-decode a cached value. Returns None on miss or error."""
    try:
        client = get_redis_client()
        raw = client.get(key)
        if raw is None:
            return None
        return json.loads(raw)
    except Exception as e:
        logger.warning(f"Cache GET failed for key={key}: {e}")
        return None


def cache_set(key: str, value: Any, ttl_seconds: int = 3600) -> None:
    """JSON-encode and cache a value with TTL. Silently ignores errors."""
    try:
        client = get_redis_client()
        client.setex(key, ttl_seconds, json.dumps(value, default=str))
    except Exception as e:
        logger.warning(f"Cache SET failed for key={key}: {e}")
