"""
Qualifying analytics — teammate delta, track evolution, peak performance window.
"""
import statistics
from typing import Optional


def compute_teammate_delta(driver_best_ms: float, teammate_best_ms: float) -> dict:
    """
    Returns absolute and percentage delta between two drivers' best Q laps.
    Negative delta = driver was faster than teammate.
    """
    delta_ms = driver_best_ms - teammate_best_ms
    pct = (delta_ms / teammate_best_ms) * 100 if teammate_best_ms else 0
    return {
        "delta_ms": round(delta_ms, 1),
        "delta_pct": round(pct, 3),
        "driver_faster": delta_ms < 0,
    }


def compute_track_evolution(laps_by_time: list[dict]) -> list[dict]:
    """
    Computes track evolution curve: lap time improvement trend over session clock.
    laps_by_time: sorted list of {driver_id, lap_time_ms, session_time_s}
    Returns rolling best lap time per time bucket (every 5 minutes).
    """
    if not laps_by_time:
        return []
    bucket_size = 300  # 5 minutes in seconds
    buckets: dict = {}
    for lap in laps_by_time:
        t = lap.get("session_time_s", 0)
        lt = lap.get("lap_time_ms")
        if lt is None:
            continue
        bucket = int(t // bucket_size) * bucket_size
        if bucket not in buckets or lt < buckets[bucket]:
            buckets[bucket] = lt
    return [
        {"session_time_s": k, "best_lap_time_ms": v}
        for k, v in sorted(buckets.items())
    ]


def compute_peak_performance_window(laps: list[dict]) -> dict:
    """
    Returns the session time window (in seconds) where best laps occurred.
    """
    valid = [l for l in laps if l.get("lap_time_ms") and l.get("session_time_s")]
    if not valid:
        return {}
    times = [l["lap_time_ms"] for l in valid]
    median = statistics.median(times)
    top_percentile = sorted(times)[: max(1, len(times) // 5)]  # top 20%
    threshold = max(top_percentile)
    peak_laps = [l for l in valid if l["lap_time_ms"] <= threshold]
    if not peak_laps:
        return {}
    session_times = [l["session_time_s"] for l in peak_laps]
    return {
        "window_start_s": round(min(session_times)),
        "window_end_s": round(max(session_times)),
        "best_lap_ms": round(min(times), 1),
    }


def sector_dominance(laps: list[dict]) -> dict:
    """
    Returns driver with fastest S1, S2, S3 across all laps in the session.
    """
    sectors = {"sector1": {}, "sector2": {}, "sector3": {}}
    for lap in laps:
        for sec, key in [("sector1", "sector1_ms"), ("sector2", "sector2_ms"), ("sector3", "sector3_ms")]:
            val = lap.get(key)
            driver = lap.get("driver_id")
            if val and driver:
                if driver not in sectors[sec] or val < sectors[sec][driver]:
                    sectors[sec][driver] = val
    result = {}
    for sec, driver_times in sectors.items():
        if driver_times:
            best_driver = min(driver_times, key=lambda d: driver_times[d])
            result[sec] = {
                "driver_id": best_driver,
                "time_ms": round(driver_times[best_driver], 1),
            }
    return result
