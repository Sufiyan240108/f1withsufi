const BASE_URL = import.meta.env.VITE_API_BASE || 'http://localhost:8000'

async function apiFetch(path) {
    const res = await fetch(`${BASE_URL}${path}`)
    if (!res.ok) {
        const text = await res.text()
        throw new Error(`API ${res.status}: ${text}`)
    }
    return res.json()
}

export async function fetchStandings(season = 2025) {
    return apiFetch(`/standings?season=${season}`)
}

export async function fetchCalendar(season = 2025) {
    return apiFetch(`/calendar?season=${season}`)
}

export async function fetchEvent(round, season = 2025) {
    return apiFetch(`/event/${round}?season=${season}`)
}

export async function fetchAnalytics(season, round, sessionType) {
    return apiFetch(`/analytics/${season}/${round}/${sessionType}`)
}

export async function fetchTelemetry(season, round, sessionType, driverCode, lapNumber = null) {
    const lap = lapNumber ? `?lap_number=${lapNumber}` : ''
    return apiFetch(`/telemetry/${season}/${round}/${sessionType}/${driverCode}${lap}`)
}
