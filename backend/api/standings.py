from fastapi import APIRouter, Query, HTTPException
from connectors.standings_connector import (
    get_driver_standings, get_constructor_standings, ConnectorError
)
from normalizers.standings_normalizer import normalize_driver_standings, normalize_constructor_standings
from cache import cache_get, cache_set, cache_key

router = APIRouter(prefix="/standings", tags=["Standings"])


@router.get("")
def get_standings(season: int = Query(default=2025, description="F1 season year")):
    """Return driver and constructor standings for the given season."""
    ck = cache_key("standings", season)
    cached = cache_get(ck)
    if cached:
        return cached

    try:
        # get_driver_standings now returns (list, round_num) from one API call
        raw_drivers, round_num = get_driver_standings(season)
        raw_constructors = get_constructor_standings(season)
    except ConnectorError as e:
        raise HTTPException(status_code=502, detail=str(e))

    result = {
        "season": season,
        "round": round_num,
        "drivers": normalize_driver_standings(raw_drivers, season, round_num),
        "constructors": normalize_constructor_standings(raw_constructors, season, round_num),
    }
    cache_set(ck, result, ttl_seconds=3600)
    return result
