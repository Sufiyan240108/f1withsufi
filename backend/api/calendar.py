from fastapi import APIRouter, Query, HTTPException
from connectors.calendar_connector import get_calendar, ConnectorError
from cache import cache_get, cache_set, cache_key

router = APIRouter(prefix="/calendar", tags=["Calendar"])


@router.get("")
def get_season_calendar(season: int = Query(default=2025)):
    ck = cache_key("calendar", season)
    cached = cache_get(ck)
    if cached:
        return cached

    try:
        events = get_calendar(season)
    except ConnectorError as e:
        raise HTTPException(status_code=502, detail=str(e))

    result = {"season": season, "events": events}
    cache_set(ck, result, ttl_seconds=7200)
    return result
