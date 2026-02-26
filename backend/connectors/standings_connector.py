import logging
import httpx
from typing import Optional

logger = logging.getLogger(__name__)

BASE_URL = "https://api.jolpi.ca/ergast/f1"
TIMEOUT = 15.0
MAX_RETRIES = 3


class ConnectorError(Exception):
    pass


def _fetch_with_retry(url: str) -> dict:
    """Fetch a URL with retry/backoff. Returns parsed JSON."""
    import time
    for attempt in range(1, MAX_RETRIES + 1):
        try:
            with httpx.Client(timeout=TIMEOUT) as client:
                resp = client.get(url)
                resp.raise_for_status()
                return resp.json()
        except httpx.HTTPStatusError as e:
            logger.warning(f"HTTP {e.response.status_code} on attempt {attempt}: {url}")
        except Exception as e:
            logger.warning(f"Request error on attempt {attempt}: {e}")
        if attempt < MAX_RETRIES:
            time.sleep(2 ** attempt)
    raise ConnectorError(f"Failed to fetch {url} after {MAX_RETRIES} attempts")


def get_driver_standings(season: int) -> tuple[list[dict], int]:
    url = f"{BASE_URL}/{season}/driverStandings.json"
    data = _fetch_with_retry(url)
    try:
        standings_list = data["MRData"]["StandingsTable"]["StandingsLists"]
        if not standings_list:
            return [], 0
        round_num = int(standings_list[0].get("round", 0))
        return standings_list[0]["DriverStandings"], round_num
    except (KeyError, IndexError) as e:
        raise ConnectorError(f"Unexpected standings schema: {e}")


def get_constructor_standings(season: int) -> list[dict]:
    url = f"{BASE_URL}/{season}/constructorStandings.json"
    data = _fetch_with_retry(url)
    try:
        standings_list = data["MRData"]["StandingsTable"]["StandingsLists"]
        if not standings_list:
            return []
        return standings_list[0]["ConstructorStandings"]
    except (KeyError, IndexError) as e:
        raise ConnectorError(f"Unexpected constructor standings schema: {e}")


def get_driver_standings_all_rounds(season: int) -> list[dict]:
    """Fetch standings after every round for championship progression chart."""
    url = f"{BASE_URL}/{season}/driverStandings/{{}}.json"
    # First get the calendar to know how many rounds
    cal_url = f"{BASE_URL}/{season}.json"
    cal_data = _fetch_with_retry(cal_url)
    races = cal_data["MRData"]["RaceTable"]["Races"]
    all_rounds = []
    for race in races:
        round_num = int(race["round"])
        try:
            rd = _fetch_with_retry(f"{BASE_URL}/{season}/{round_num}/driverStandings.json")
            standings_list = rd["MRData"]["StandingsTable"]["StandingsLists"]
            if standings_list:
                all_rounds.append({
                    "round": round_num,
                    "race_name": race["raceName"],
                    "standings": standings_list[0]["DriverStandings"],
                })
        except ConnectorError:
            break  # stop at current round (future rounds will 404)
    return all_rounds
