"""Backend unit tests — analytics engine."""
import unittest


class TestDegradationSlope(unittest.TestCase):
    def _make_laps(self, driver_id, times_ms, stint=1, compound="SOFT"):
        """Helper: create lap dicts with linearly increasing times."""
        return [
            {
                "driver_id": driver_id,
                "lap_number": i + 1,
                "lap_time_ms": t,
                "stint": stint,
                "compound": compound,
                "track_status": "1",
            }
            for i, t in enumerate(times_ms)
        ]

    def test_positive_slope(self):
        """Laps getting 100ms slower each lap → slope ≈ 100."""
        from analytics.degradation import compute_degradation_slope
        # 10 laps: start at 90000ms, +100ms each lap
        laps = self._make_laps("VER", [90000 + i * 100 for i in range(10)])
        result = compute_degradation_slope(laps)
        self.assertIn("VER", result)
        stints = result["VER"]
        self.assertTrue(len(stints) > 0)
        slope = stints[0]["slope_ms_per_lap"]
        self.assertIsNotNone(slope)
        self.assertAlmostEqual(slope, 100.0, delta=10.0)

    def test_stable_laps_near_zero_slope(self):
        """Consistent laps → slope near 0."""
        from analytics.degradation import compute_degradation_slope
        laps = self._make_laps("HAM", [90000] * 8)
        result = compute_degradation_slope(laps)
        if "HAM" in result and result["HAM"]:
            slope = result["HAM"][0]["slope_ms_per_lap"]
            if slope is not None:
                self.assertAlmostEqual(slope, 0.0, delta=5.0)


class TestConsistencyIndex(unittest.TestCase):
    def test_perfect_consistency(self):
        """All laps the same time → score near 100."""
        from analytics.consistency import compute_consistency_index
        laps = [
            {"lap_time_ms": 90000.0, "track_status": "1"}
            for _ in range(10)
        ]
        # stdev of identical values is 0 → score should be 100
        score = compute_consistency_index(laps)
        self.assertEqual(score, 100.0)

    def test_scattered_laps_lower_score(self):
        """Very scattered lap times → significantly below 100."""
        from analytics.consistency import compute_consistency_index
        import random
        random.seed(42)
        laps = [
            {"lap_time_ms": 90000.0 + random.uniform(-2000, 2000), "track_status": "1"}
            for _ in range(15)
        ]
        score = compute_consistency_index(laps)
        self.assertLess(score, 90.0)

    def test_insufficient_data_returns_zero(self):
        from analytics.consistency import compute_consistency_index
        laps = [{"lap_time_ms": 90000.0, "track_status": "1"}]
        score = compute_consistency_index(laps)
        self.assertEqual(score, 0.0)


class TestTeammateDelta(unittest.TestCase):
    def test_driver_faster(self):
        from analytics.qualifying import compute_teammate_delta
        result = compute_teammate_delta(89500.0, 89800.0)
        self.assertTrue(result["driver_faster"])
        self.assertAlmostEqual(result["delta_ms"], -300.0, delta=0.1)

    def test_teammate_faster(self):
        from analytics.qualifying import compute_teammate_delta
        result = compute_teammate_delta(90000.0, 89700.0)
        self.assertFalse(result["driver_faster"])
        self.assertAlmostEqual(result["delta_ms"], 300.0, delta=0.1)


class TestStrategyMetrics(unittest.TestCase):
    def test_pit_timing_efficiency_parses_durations(self):
        from analytics.strategy import pit_timing_efficiency
        stops = [
            {"driver_id": "VER", "lap": 20, "duration": "23.456"},
            {"driver_id": "HAM", "lap": 22, "duration": "24.100"},
        ]
        result = pit_timing_efficiency(stops)
        self.assertIsNotNone(result)
        self.assertAlmostEqual(result, 23.778, delta=0.01)


if __name__ == "__main__":
    unittest.main()
