class NormalizerError(Exception):
    pass


def normalize_driver_standings(raw: list[dict], season: int, round_num: int) -> list[dict]:
    result = []
    leader_points = None
    for entry in raw:
        driver = entry.get("Driver", {})
        constructor = entry.get("Constructors", [{}])[0]
        pts = float(entry.get("points", 0))
        if leader_points is None:
            leader_points = pts
        result.append({
            "type": "driver",
            "season": season,
            "round": round_num,
            "position": int(entry.get("position", 0)),
            "points": pts,
            "wins": int(entry.get("wins", 0)),
            "gap_to_leader": round(pts - leader_points, 1),  # negative or zero
            "driver_id": driver.get("driverId", ""),
            "driver_code": driver.get("code", ""),
            "car_number": driver.get("permanentNumber", ""),
            "driver_name": f"{driver.get('givenName','').strip()} {driver.get('familyName','').strip()}".strip(),
            "driver_nationality": driver.get("nationality", ""),
            "driver_dob": driver.get("dateOfBirth", ""),
            "constructor_id": constructor.get("constructorId", ""),
            "constructor_name": constructor.get("name", ""),
        })
    return result


def normalize_constructor_standings(raw: list[dict], season: int, round_num: int) -> list[dict]:
    result = []
    leader_points = None
    for entry in raw:
        constructor = entry.get("Constructor", {})
        pts = float(entry.get("points", 0))
        if leader_points is None:
            leader_points = pts
        result.append({
            "type": "constructor",
            "season": season,
            "round": round_num,
            "position": int(entry.get("position", 0)),
            "points": pts,
            "wins": int(entry.get("wins", 0)),
            "gap_to_leader": round(pts - leader_points, 1),
            "constructor_id": constructor.get("constructorId", ""),
            "constructor_name": constructor.get("name", ""),
            "constructor_nationality": constructor.get("nationality", ""),
        })
    return result
