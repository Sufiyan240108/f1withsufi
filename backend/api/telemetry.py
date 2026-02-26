from fastapi import APIRouter, Path, Query, HTTPException
from connectors.fastf1_connector import get_session, get_telemetry
from cache import cache_get, cache_set, cache_key

router = APIRouter(prefix="/telemetry", tags=["Telemetry"])


@router.get("/{season}/{round_num}/{session_type}/{driver_code}")
def get_driver_telemetry(
    season: int = Path(...),
    round_num: int = Path(...),
    session_type: str = Path(...),
    driver_code: str = Path(..., description="3-letter driver code, e.g. VER, HAM"),
    lap_number: int = Query(default=None, description="Specific lap number, default = fastest"),
):
    ck = cache_key("telemetry", season, round_num, session_type, driver_code, lap_number or "fastest")
    cached = cache_get(ck)
    if cached:
        return cached

    session = get_session(season, round_num, session_type)
    if session is None:
        raise HTTPException(status_code=404, detail="Session not available")

    data = get_telemetry(session, driver_code.upper(), lap_number)
    if not data:
        raise HTTPException(status_code=404, detail=f"Telemetry not found for {driver_code}")

    result = {
        "season": season,
        "round": round_num,
        "session_type": session_type,
        "driver_code": driver_code.upper(),
        "lap_number": lap_number,
        "telemetry": data,
    }
    cache_set(ck, result, ttl_seconds=86400)
    return result
