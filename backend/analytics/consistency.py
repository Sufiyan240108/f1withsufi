"""
Consistency index analytics.
Computes lap time standard deviation normalized to a 0–100 score per driver.
Lower std dev → higher score (more consistent).
"""
import logging
import statistics
from typing import Optional

logger = logging.getLogger(__name__)

# If std dev is above this threshold in ms, score is 0
MAX_STD_MS = 3000.0


def _get_representative_laps(laps: list[dict]) -> list[float]:
    """Filter to clean laps: exclude outlaps, inlaps, SC laps, and outliers."""
    times = []
    for lap in laps:
        lap_time = lap.get("lap_time_ms")
        track_status = str(lap.get("track_status", ""))
        if lap_time is None or lap_time <= 0:
            continue
        if any(sc in track_status for sc in ["4", "5", "6"]):
            continue  # Safety car affected
        times.append(lap_time)

    if len(times) < 3:
        return times

    # Remove outliers: keep within 2 std devs of median
    median = statistics.median(times)
    std = statistics.stdev(times)
    return [t for t in times if abs(t - median) <= 2 * std]


def compute_consistency_index(laps: list[dict]) -> float:
    """
    Returns a 0–100 consistency score for the driver's laps.
    100 = perfectly consistent, 0 = very inconsistent.
    """
    clean = _get_representative_laps(laps)
    if len(clean) < 3:
        return 0.0
    std = statistics.stdev(clean)
    score = max(0.0, 100.0 * (1.0 - std / MAX_STD_MS))
    return round(score, 1)


def compute_consistency_per_driver(laps: list[dict]) -> dict[str, float]:
    """Group laps by driver and return consistency score per driver."""
    from collections import defaultdict
    driver_laps: dict = defaultdict(list)
    for lap in laps:
        driver = lap.get("driver_id", "")
        if driver:
            driver_laps[driver].append(lap)
    return {
        driver: compute_consistency_index(dlaps)
        for driver, dlaps in driver_laps.items()
    }
