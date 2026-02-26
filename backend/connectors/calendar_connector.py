import logging
import httpx
import time
from typing import Optional

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


def get_calendar(season: int) -> list[dict]:
    """Returns list of race dicts for the given season."""
    url = f"{BASE_URL}/{season}.json"
    data = _fetch(url)
    try:
        races = data["MRData"]["RaceTable"]["Races"]
    except KeyError as e:
        raise ConnectorError(f"Unexpected calendar schema: {e}")

    result = []
    for race in races:
        # Sprint detection: sprint schedule key exists in newer API format
        is_sprint = "Sprint" in race or "SprintDate" in race
        sprint_date = race.get("SprintDate") or (race.get("Sprint", {}).get("date") if "Sprint" in race else None)
        result.append({
            "round": int(race["round"]),
            "season": int(race["season"]),
            "name": race["raceName"],
            "circuit_id": race["Circuit"]["circuitId"],
            "circuit_name": race["Circuit"]["circuitName"],
            "locality": race["Circuit"]["Location"]["locality"],
            "country": race["Circuit"]["Location"]["country"],
            "lat": race["Circuit"]["Location"].get("lat"),
            "long": race["Circuit"]["Location"].get("long"),
            "date": race["date"],
            "time": race.get("time"),
            "is_sprint": is_sprint,
            "sprint_date": sprint_date,
        })
    return result
