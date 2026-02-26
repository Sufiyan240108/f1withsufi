"""Backend unit tests — connectors."""
import json
import unittest
from unittest.mock import patch, MagicMock


# ─── Standings Connector ─────────────────────────────────────────────────────

MOCK_DRIVER_STANDINGS_RESPONSE = {
    "MRData": {
        "StandingsTable": {
            "StandingsLists": [
                {
                    "DriverStandings": [
                        {
                            "position": "1",
                            "points": "331",
                            "wins": "9",
                            "Driver": {
                                "driverId": "verstappen",
                                "code": "VER",
                                "givenName": "Max",
                                "familyName": "Verstappen",
                                "nationality": "Dutch",
                            },
                            "Constructors": [
                                {"constructorId": "red_bull", "name": "Red Bull", "nationality": "Austrian"}
                            ],
                        }
                    ]
                }
            ]
        }
    }
}

MOCK_CONSTRUCTOR_STANDINGS_RESPONSE = {
    "MRData": {
        "StandingsTable": {
            "StandingsLists": [
                {
                    "ConstructorStandings": [
                        {
                            "position": "1",
                            "points": "589",
                            "wins": "12",
                            "Constructor": {
                                "constructorId": "red_bull",
                                "name": "Red Bull",
                                "nationality": "Austrian",
                            },
                        }
                    ]
                }
            ]
        }
    }
}


class TestStandingsConnector(unittest.TestCase):
    @patch("connectors.standings_connector.httpx.Client")
    def test_get_driver_standings_parses_correctly(self, mock_client_class):
        mock_resp = MagicMock()
        mock_resp.json.return_value = MOCK_DRIVER_STANDINGS_RESPONSE
        mock_resp.raise_for_status.return_value = None
        mock_client = MagicMock()
        mock_client.__enter__.return_value.get.return_value = mock_resp
        mock_client_class.return_value = mock_client

        from connectors.standings_connector import get_driver_standings
        result = get_driver_standings(2024)
        self.assertEqual(len(result), 1)
        self.assertEqual(result[0]["Driver"]["driverId"], "verstappen")
        self.assertEqual(result[0]["points"], "331")

    @patch("connectors.standings_connector.httpx.Client")
    def test_get_constructor_standings_parses_correctly(self, mock_client_class):
        mock_resp = MagicMock()
        mock_resp.json.return_value = MOCK_CONSTRUCTOR_STANDINGS_RESPONSE
        mock_resp.raise_for_status.return_value = None
        mock_client = MagicMock()
        mock_client.__enter__.return_value.get.return_value = mock_resp
        mock_client_class.return_value = mock_client

        from connectors.standings_connector import get_constructor_standings
        result = get_constructor_standings(2024)
        self.assertEqual(len(result), 1)
        self.assertEqual(result[0]["Constructor"]["constructorId"], "red_bull")


class TestCalendarConnector(unittest.TestCase):
    @patch("connectors.calendar_connector.httpx.Client")
    def test_sprint_detection(self, mock_client_class):
        mock_resp = MagicMock()
        mock_resp.json.return_value = {
            "MRData": {
                "RaceTable": {
                    "Races": [
                        {
                            "round": "6",
                            "season": "2024",
                            "raceName": "Miami Grand Prix",
                            "Circuit": {
                                "circuitId": "miami",
                                "circuitName": "Miami International Autodrome",
                                "Location": {"locality": "Miami", "country": "USA"},
                            },
                            "date": "2024-05-05",
                            "Sprint": {"date": "2024-05-04"},  # sprint weekend flag
                        }
                    ]
                }
            }
        }
        mock_resp.raise_for_status.return_value = None
        mock_client = MagicMock()
        mock_client.__enter__.return_value.get.return_value = mock_resp
        mock_client_class.return_value = mock_client

        from connectors.calendar_connector import get_calendar
        events = get_calendar(2024)
        self.assertEqual(len(events), 1)
        self.assertTrue(events[0]["is_sprint"])
        self.assertEqual(events[0]["name"], "Miami Grand Prix")


if __name__ == "__main__":
    unittest.main()
