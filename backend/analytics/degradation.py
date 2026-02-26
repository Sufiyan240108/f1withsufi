"""
Tyre degradation slope analytics.
Computes linear regression of lap_time_ms vs lap_number per stint per compound.
"""
import logging
from typing import Optional

logger = logging.getLogger(__name__)


def _linear_slope(x: list[float], y: list[float]) -> Optional[float]:
    """Simple linear regression slope (ms/lap). Returns None if insufficient data."""
    n = len(x)
    if n < 3:
        return None
    mean_x = sum(x) / n
    mean_y = sum(y) / n
    num = sum((xi - mean_x) * (yi - mean_y) for xi, yi in zip(x, y))
    den = sum((xi - mean_x) ** 2 for xi in x)
    if den == 0:
        return None
    return num / den


def compute_degradation_slope(laps: list[dict]) -> dict:
    """
    Groups laps by driver → stint → compound, runs linear regression.
    Returns: {driver_id: [{stint, compound, slope_ms_per_lap, lap_count, median_time_ms}]}
    """
    from collections import defaultdict
    import statistics

    groups: dict = defaultdict(lambda: defaultdict(list))

    for lap in laps:
        driver = lap.get("driver_id", "")
        stint = lap.get("stint")
        compound = lap.get("compound", "UNKNOWN")
        lap_time = lap.get("lap_time_ms")
        lap_num = lap.get("lap_number")
        track_status = lap.get("track_status", "")

        # Skip invalid, outlap (typically first in stint), inlap, SC laps
        if lap_time is None or lap_num is None or stint is None:
            continue
        if track_status and any(sc in str(track_status) for sc in ["4", "5", "6"]):
            continue  # SC/VSC/red flag laps skewed

        key = (stint, compound)
        groups[driver][key].append((lap_num, lap_time))

    result = {}
    for driver, stints in groups.items():
        driver_stints = []
        for (stint, compound), data in stints.items():
            data.sort(key=lambda x: x[0])
            # Skip first lap of stint (outlap) and last (inlap)
            representative = data[1:-1] if len(data) > 3 else data
            if not representative:
                continue
            x = [d[0] for d in representative]
            y = [d[1] for d in representative]
            slope = _linear_slope(x, y)
            driver_stints.append({
                "stint": stint,
                "compound": compound,
                "slope_ms_per_lap": round(slope, 3) if slope is not None else None,
                "lap_count": len(data),
                "median_time_ms": round(statistics.median(y), 1),
            })
        result[driver] = driver_stints

    return result
