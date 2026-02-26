"""
Practice session analytics — Practice Performance Index.
"""


def compute_practice_performance_index(
    pace_score: float,
    consistency_score: float,
    weights: tuple = (0.6, 0.4),
) -> float:
    """
    Weighted composite of pace score and consistency score.
    pace_score: 0–100 (100 = fastest relative to field)
    consistency_score: 0–100 (100 = perfectly consistent)
    Returns: PPI (0–100)
    """
    w_pace, w_cons = weights
    ppi = w_pace * pace_score + w_cons * consistency_score
    return round(min(100.0, max(0.0, ppi)), 1)


def compute_pace_scores(laps_by_driver: dict[str, list[dict]]) -> dict[str, float]:
    """
    Convert per-driver median lap times into 0–100 pace scores
    (fastest driver gets 100, others scored relative).
    laps_by_driver: {driver_id: [lap dicts]}
    """
    import statistics

    driver_medians = {}
    for driver, laps in laps_by_driver.items():
        times = [l["lap_time_ms"] for l in laps if l.get("lap_time_ms")]
        if times:
            driver_medians[driver] = statistics.median(times)

    if not driver_medians:
        return {}

    best = min(driver_medians.values())
    worst = max(driver_medians.values())
    spread = worst - best if worst != best else 1.0

    return {
        driver: round(100.0 * (1.0 - (median - best) / spread), 1)
        for driver, median in driver_medians.items()
    }
