import logging
import os
import math
from typing import Optional
from config import get_settings

logger = logging.getLogger(__name__)
settings = get_settings()


def _enable_cache():
    try:
        import fastf1
        cache_dir = settings.FASTF1_CACHE_DIR
        os.makedirs(cache_dir, exist_ok=True)
        fastf1.Cache.enable_cache(cache_dir)
    except Exception as e:
        logger.warning(f"FastF1 cache setup failed: {e}")


def get_session(season: int, round_num: int, session_type: str):
    """
    Load a FastF1 session.
    session_type: 'FP1','FP2','FP3','Q','SQ','S','R', or 'Testing'
    Returns a loaded FastF1 Session object or None on failure.
    """
    try:
        import fastf1
        _enable_cache()
        session = fastf1.get_session(season, round_num, session_type)
        session.load(telemetry=True, weather=False, messages=False)
        return session
    except Exception as e:
        logger.error(f"FastF1 get_session failed (season={season} round={round_num} type={session_type}): {e}")
        return None


def get_laps(session) -> list[dict]:
    """
    Extract lap data from a loaded FastF1 session.
    Returns a list of dicts (one per lap).
    """
    if session is None:
        return []
    try:
        laps = session.laps
        result = []
        for _, row in laps.iterrows():
            def ms_or_none(td):
                try:
                    return td.total_seconds() * 1000
                except Exception:
                    return None

            result.append({
                "driver_id": row.get("Driver", ""),
                "lap_number": int(row.get("LapNumber", 0)),
                "lap_time_ms": ms_or_none(row.get("LapTime")),
                "sector1_ms": ms_or_none(row.get("Sector1Time")),
                "sector2_ms": ms_or_none(row.get("Sector2Time")),
                "sector3_ms": ms_or_none(row.get("Sector3Time")),
                "compound": str(row.get("Compound", "")),
                "stint": int(row.get("Stint", 0)) if not _is_nan(row.get("Stint")) else None,
                "is_personal_best": bool(row.get("IsPersonalBest", False)),
                "track_status": str(row.get("TrackStatus", "")),
                "gap_to_leader_s": None,  # computed separately if needed
                "gap_ahead_s": None,
            })
        return result
    except Exception as e:
        logger.error(f"get_laps failed: {e}")
        return []


def get_telemetry(session, driver_code: str, lap_number: Optional[int] = None) -> list[dict]:
    """
    Extract telemetry for a specific driver from a loaded session.
    If lap_number is None, returns fastest lap telemetry.
    Returns list of dicts (one per telemetry sample).
    """
    if session is None:
        return []
    try:
        driver_laps = session.laps.pick_drivers(driver_code)
        if lap_number is not None:
            lap = driver_laps[driver_laps["LapNumber"] == lap_number].iloc[0]
        else:
            lap = driver_laps.pick_fastest()
        tel = lap.get_telemetry()
        result = []
        for _, row in tel.iterrows():
            result.append({
                "distance": float(row.get("Distance", 0)),
                "speed": float(row.get("Speed", 0)),
                "throttle": float(row.get("Throttle", 0)),
                "brake": float(row.get("Brake", 0)),
                "gear": int(row.get("nGear", 0)),
                "rpm": int(row.get("RPM", 0)),
                "drs": int(row.get("DRS", 0)),
                "x": float(row.get("X", 0)),
                "y": float(row.get("Y", 0)),
            })
        return result
    except Exception as e:
        logger.error(f"get_telemetry failed for {driver_code}: {e}")
        return []


def _is_nan(val) -> bool:
    try:
        return math.isnan(float(val))
    except Exception:
        return True
