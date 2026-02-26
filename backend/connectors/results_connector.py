import logging
import httpx
import time

logger = logging.getLogger(__name__)

BASE_URL = "https://api.jolpi.ca/ergast/f1"
TIMEOUT = 15.0
MAX_RETRIES = 3


class ConnectorError(Exception):
    pass


def _fetch(url: str) -> dict:
    for attempt in range(1, MAX_RETRIES + 1):
        try:
            with httpx.Client(timeout=TIMEOUT) as client:
                resp = client.get(url)
                resp.raise_for_status()
                return resp.json()
        except httpx.HTTPStatusError as e:
            logger.warning(f"HTTP {e.response.status_code} attempt {attempt}: {url}")
        except Exception as e:
            logger.warning(f"Request error attempt {attempt}: {e}")
        if attempt < MAX_RETRIES:
            time.sleep(2 ** attempt)
    raise ConnectorError(f"Failed to fetch {url}")


def _parse_driver(d: dict) -> dict:
    return {
        "id": d.get("driverId"),
        "code": d.get("code", ""),
        "full_name": f"{d.get('givenName', '')} {d.get('familyName', '')}".strip(),
        "nationality": d.get("nationality"),
    }


def _parse_constructor(c: dict) -> dict:
    return {
        "id": c.get("constructorId"),
        "name": c.get("name"),
        "nationality": c.get("nationality"),
    }


def get_race_results(season: int, round_num: int) -> list[dict]:
    url = f"{BASE_URL}/{season}/{round_num}/results.json"
    data = _fetch(url)
    try:
        races = data["MRData"]["RaceTable"]["Races"]
        if not races:
            return []
        results = races[0]["Results"]
    except (KeyError, IndexError) as e:
        raise ConnectorError(f"Unexpected results schema: {e}")

    return [
        {
            "position":     int(r["position"]),
            "driver":       _parse_driver(r["Driver"]),
            "constructor":  _parse_constructor(r["Constructor"]),
            "car_number":   r.get("number", ""),
            "grid":         int(r.get("grid", 0)),
            "laps":         int(r.get("laps", 0)),
            "status":       r.get("status"),
            "time":         r.get("Time", {}).get("time") if r.get("Time") else None,
            "points":       float(r.get("points", 0)),
            "fastest_lap":  r.get("FastestLap", {}).get("Time", {}).get("time") if r.get("FastestLap") else None,
            "fastest_lap_rank": int(r.get("FastestLap", {}).get("rank", 0)) if r.get("FastestLap") else None,
        }
        for r in results
    ]


def get_race_info(season: int, round_num: int) -> dict:
    """Fetch race name, circuit, and date — used for page header."""
    url = f"{BASE_URL}/{season}/{round_num}/results.json"
    try:
        data = _fetch(url)
        races = data["MRData"]["RaceTable"]["Races"]
        if not races:
            return {}
        r = races[0]
        return {
            "race_name":    r.get("raceName", ""),
            "circuit_name": r.get("Circuit", {}).get("circuitName", ""),
            "locality":     r.get("Circuit", {}).get("Location", {}).get("locality", ""),
            "country":      r.get("Circuit", {}).get("Location", {}).get("country", ""),
            "date":         r.get("date", ""),
        }
    except (ConnectorError, KeyError, IndexError):
        return {}


def get_sprint_results(season: int, round_num: int) -> list[dict]:
    url = f"{BASE_URL}/{season}/{round_num}/sprint.json"
    try:
        data = _fetch(url)
        races = data["MRData"]["RaceTable"]["Races"]
        if not races:
            return []
        results = races[0].get("SprintResults", [])
    except ConnectorError:
        return []  # Not a sprint weekend

    return [
        {
            "position":    int(r["position"]),
            "driver":      _parse_driver(r["Driver"]),
            "constructor": _parse_constructor(r["Constructor"]),
            "car_number":  r.get("number", ""),
            "grid":        int(r.get("grid", 0)),
            "laps":        int(r.get("laps", 0)),
            "status":      r.get("status"),
            "time":        r.get("Time", {}).get("time") if r.get("Time") else None,
            "points":      float(r.get("points", 0)),
        }
        for r in results
    ]


def get_qualifying_results(season: int, round_num: int) -> list[dict]:
    url = f"{BASE_URL}/{season}/{round_num}/qualifying.json"
    try:
        data = _fetch(url)
        races = data["MRData"]["RaceTable"]["Races"]
        if not races:
            return []
        results = races[0].get("QualifyingResults", [])
    except ConnectorError:
        return []

    output = []
    for r in results:
        pos = int(r.get("position", 99))
        # Determine which rounds each driver reached
        q1 = r.get("Q1") or None
        q2 = r.get("Q2") or None
        q3 = r.get("Q3") or None
        if q3:
            eliminated = None          # Made it to Q3
        elif q2:
            eliminated = "Q2"         # Out in Q3 (pos 11-15)
        else:
            eliminated = "Q1"         # Out in Q1 (pos 16-20)

        output.append({
            "position":    pos,
            "driver":      _parse_driver(r["Driver"]),
            "constructor": _parse_constructor(r["Constructor"]),
            "car_number":  r.get("number", ""),
            "q1":          q1,
            "q2":          q2,
            "q3":          q3,
            "eliminated":  eliminated,
        })
    return output


def get_pit_stops(season: int, round_num: int) -> list[dict]:
    url = f"{BASE_URL}/{season}/{round_num}/pitstops.json"
    try:
        data = _fetch(url)
        races = data["MRData"]["RaceTable"]["Races"]
        if not races:
            return []
        stops = races[0].get("PitStops", [])
        return [
            {
                "driver_id": s["driverId"],
                "stop":      int(s["stop"]),
                "lap":       int(s["lap"]),
                "duration":  s["duration"],
                "time":      s["time"],
            }
            for s in stops
        ]
    except (ConnectorError, KeyError):
        return []

