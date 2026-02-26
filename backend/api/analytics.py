from fastapi import APIRouter, Path, Query, HTTPException
from connectors.fastf1_connector import get_session, get_laps
from analytics.degradation import compute_degradation_slope
from analytics.consistency import compute_consistency_per_driver
from analytics.pace import estimate_clean_air_baseline, estimate_traffic_loss
from analytics.strategy import pit_timing_efficiency
from analytics.qualifying import sector_dominance, compute_track_evolution
from cache import cache_get, cache_set, cache_key
from collections import defaultdict

router = APIRouter(prefix="/analytics", tags=["Analytics"])


@router.get("/{season}/{round_num}/{session_type}")
def get_session_analytics(
    season: int = Path(...),
    round_num: int = Path(...),
    session_type: str = Path(..., description="FP1, FP2, FP3, Q, R, S, SQ"),
):
    ck = cache_key("analytics", season, round_num, session_type)
    cached = cache_get(ck)
    if cached:
        return cached

    session = get_session(season, round_num, session_type)
    if session is None:
        raise HTTPException(status_code=404, detail="Session data not available")

    laps = get_laps(session)
    if not laps:
        raise HTTPException(status_code=404, detail="No lap data found for session")

    # Per-driver lap grouping
    driver_laps: dict = defaultdict(list)
    for lap in laps:
        driver_laps[lap["driver_id"]].append(lap)

    consistency = compute_consistency_per_driver(laps)
    degradation = compute_degradation_slope(laps)
    baseline = estimate_clean_air_baseline(laps)
    traffic_loss = estimate_traffic_loss(laps, baseline)
    sectors = sector_dominance(laps)
    track_evolution = compute_track_evolution([
        {**l, "session_time_s": l.get("lap_number", 0) * 90}  # rough proxy
        for l in laps
    ])

    result = {
        "season": season,
        "round": round_num,
        "session_type": session_type,
        "consistency_per_driver": consistency,
        "degradation_slopes": degradation,
        "clean_air_baseline_ms": baseline,
        "traffic_loss_ms": traffic_loss,
        "sector_dominance": sectors,
        "track_evolution": track_evolution,
    }
    cache_set(ck, result, ttl_seconds=86400)
    return result
