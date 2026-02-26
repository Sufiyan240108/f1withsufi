"""
Pace analytics — clean air baseline and traffic loss estimators.
"""
import statistics
from typing import Optional


def estimate_clean_air_baseline(laps: list[dict], gap_threshold_s: float = 2.0) -> Optional[float]:
    """
    Median lap time (ms) of laps where gap_ahead_s > threshold.
    These laps are assumed to be unaffected by dirty air.
    """
    clean_laps = [
        lap["lap_time_ms"]
        for lap in laps
        if lap.get("lap_time_ms")
        and lap.get("gap_ahead_s") is not None
        and lap["gap_ahead_s"] > gap_threshold_s
        and str(lap.get("track_status", "")) in ["", "1"]
    ]
    if len(clean_laps) < 3:
        return None
    return round(statistics.median(clean_laps), 1)


def estimate_traffic_loss(
    laps: list[dict],
    baseline_ms: Optional[float],
    gap_threshold_s: float = 1.0,
) -> Optional[float]:
    """
    Mean excess time above baseline for laps with tight gap ahead.
    Returns estimated ms lost per lap in traffic on average.
    """
    if baseline_ms is None:
        return None
    traffic_laps = [
        lap["lap_time_ms"]
        for lap in laps
        if lap.get("lap_time_ms")
        and lap.get("gap_ahead_s") is not None
        and lap["gap_ahead_s"] < gap_threshold_s
        and str(lap.get("track_status", "")) in ["", "1"]
    ]
    if len(traffic_laps) < 2:
        return None
    excess = [t - baseline_ms for t in traffic_laps if t > baseline_ms]
    if not excess:
        return 0.0
    return round(statistics.mean(excess), 1)
