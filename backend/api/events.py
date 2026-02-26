from fastapi import APIRouter, Path, Query, HTTPException
from connectors.results_connector import (
    get_race_results, get_race_info, get_sprint_results,
    get_pit_stops, get_qualifying_results, ConnectorError
)
from cache import cache_get, cache_set, cache_key

router = APIRouter(prefix="/event", tags=["Events"])


@router.get("/{round_num}")
def get_event(
    round_num: int = Path(..., description="Race round number"),
    season: int = Query(default=2025),
):
    """Full event detail: race info, results, qualifying, sprint, pit stops."""
    ck = cache_key("event", season, round_num)
    cached = cache_get(ck)
    if cached:
        return cached

    try:
        race_info      = get_race_info(season, round_num)
        race_results   = get_race_results(season, round_num)
        qualifying     = get_qualifying_results(season, round_num)
        sprint_results = get_sprint_results(season, round_num)
        pit_stops      = get_pit_stops(season, round_num)
    except ConnectorError as e:
        raise HTTPException(status_code=502, detail=str(e))

    result = {
        "season":         season,
        "round":          round_num,
        "race_info":      race_info,
        "race_results":   race_results,
        "qualifying":     qualifying,
        "sprint_results": sprint_results,
        "pit_stops":      pit_stops,
    }
    cache_set(ck, result, ttl_seconds=86400)
    return result
