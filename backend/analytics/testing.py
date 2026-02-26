"""
Pre-season testing analytics — long-run clustering, performance band grouping.
"""
import statistics
from collections import defaultdict
from typing import Optional


def cluster_long_runs(laps: list[dict], min_stint_length: int = 8) -> list[dict]:
    """
    Groups consecutive laps by driver+stint+compound into runs of >= min_stint_length.
    Returns cluster list with median pace and compound info.
    """
    # Group by driver → stint → compound
    groups: dict = defaultdict(list)
    for lap in laps:
        driver = lap.get("driver_id", "")
        stint = lap.get("stint")
        compound = lap.get("compound", "UNKNOWN")
        lap_time = lap.get("lap_time_ms")
        if lap_time is None or stint is None:
            continue
        key = (driver, stint, compound)
        groups[key].append(lap)

    clusters = []
    for (driver, stint, compound), group_laps in groups.items():
        if len(group_laps) < min_stint_length:
            continue
        times = [l["lap_time_ms"] for l in group_laps if l.get("lap_time_ms")]
        if not times:
            continue
        lap_numbers = [l["lap_number"] for l in group_laps if l.get("lap_number")]
        clusters.append({
            "driver_id": driver,
            "stint": stint,
            "compound": compound,
            "lap_count": len(times),
            "median_ms": round(statistics.median(times), 1),
            "std_ms": round(statistics.stdev(times), 1) if len(times) > 1 else 0.0,
            "lap_start": min(lap_numbers) if lap_numbers else None,
            "lap_end": max(lap_numbers) if lap_numbers else None,
        })

    clusters.sort(key=lambda c: (c["driver_id"], c["stint"]))
    return clusters


def performance_band_grouping(clusters: list[dict]) -> list[dict]:
    """
    Groups drivers into performance bands based on their best long-run median.
    Returns drivers sorted into Top | Midfield | Tail.
    """
    driver_best: dict = {}
    for cluster in clusters:
        d = cluster["driver_id"]
        m = cluster["median_ms"]
        if d not in driver_best or m < driver_best[d]:
            driver_best[d] = m

    if not driver_best:
        return []

    sorted_drivers = sorted(driver_best.items(), key=lambda x: x[1])
    n = len(sorted_drivers)
    top_n = max(1, n // 3)

    result = []
    for i, (driver, best_ms) in enumerate(sorted_drivers):
        if i < top_n:
            band = "Top"
        elif i < 2 * top_n:
            band = "Midfield"
        else:
            band = "Tail"
        result.append({
            "driver_id": driver,
            "best_long_run_ms": round(best_ms, 1),
            "band": band,
            "rank": i + 1,
        })
    return result


def compute_stability_index(laps_by_driver: dict[str, list[dict]]) -> dict[str, float]:
    """Std deviation of lap times per driver across entire test. Lower = more stable."""
    result = {}
    for driver, laps in laps_by_driver.items():
        times = [l["lap_time_ms"] for l in laps if l.get("lap_time_ms")]
        if len(times) > 1:
            result[driver] = round(statistics.stdev(times), 1)
        elif times:
            result[driver] = 0.0
    return result
