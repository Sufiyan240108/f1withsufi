"""
Strategy analytics — undercut/overcut evaluation, pit timing efficiency.
"""
import statistics
from typing import Optional


def evaluate_undercut(
    driver_laps: list[dict],
    competitor_laps: list[dict],
    pit_lap: int,
    window: int = 3,
) -> dict:
    """
    Evaluate undercut success: driver pits before competitor.
    Compare avg lap time in window before pit vs competitor in same window.
    Returns delta (negative = driver gained time).
    """
    def avg_in_window(laps, center, w):
        relevant = [
            l["lap_time_ms"] for l in laps
            if l.get("lap_number") and center - w <= l["lap_number"] <= center
            and l.get("lap_time_ms")
        ]
        return statistics.mean(relevant) if relevant else None

    driver_before = avg_in_window(driver_laps, pit_lap - 1, window)
    comp_in_window = avg_in_window(competitor_laps, pit_lap, window)

    if driver_before is None or comp_in_window is None:
        return {"success": None, "delta_ms": None, "rating": "unknown"}

    delta = driver_before - comp_in_window
    return {
        "success": delta < 0,
        "delta_ms": round(delta, 1),
        "rating": "effective" if delta < -200 else ("marginal" if delta < 0 else "ineffective"),
    }


def evaluate_overcut(
    driver_laps: list[dict],
    competitor_laps: list[dict],
    competitor_pit_lap: int,
    window: int = 3,
) -> dict:
    """
    Evaluate overcut: driver stays out while competitor pits.
    """
    def avg_after_pit(laps, center, w):
        relevant = [
            l["lap_time_ms"] for l in laps
            if l.get("lap_number") and center <= l["lap_number"] <= center + w
            and l.get("lap_time_ms")
        ]
        return statistics.mean(relevant) if relevant else None

    driver_after = avg_after_pit(driver_laps, competitor_pit_lap, window)
    comp_after = avg_after_pit(competitor_laps, competitor_pit_lap, window)

    if driver_after is None or comp_after is None:
        return {"success": None, "delta_ms": None, "rating": "unknown"}

    delta = driver_after - comp_after
    return {
        "success": delta < 0,
        "delta_ms": round(delta, 1),
        "rating": "effective" if delta < -200 else ("marginal" if delta < 0 else "ineffective"),
    }


def pit_timing_efficiency(pit_stops: list[dict]) -> Optional[float]:
    """
    Compute median pit stop loss time in seconds from pit stop duration strings.
    pit_stops: list of {driver_id, lap, duration (str like '23.456')}
    """
    durations = []
    for stop in pit_stops:
        dur = stop.get("duration", "")
        try:
            durations.append(float(str(dur).replace(",", ".")))
        except (ValueError, TypeError):
            pass
    if not durations:
        return None
    return round(statistics.median(durations), 3)
