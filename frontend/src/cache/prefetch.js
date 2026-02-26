/**
 * prefetch.js — Background data loader
 *
 * Called once on app mount. Staggered requests so we don't
 * hammer the API. Already-cached keys are skipped entirely.
 */
import { fetchStandings, fetchCalendar } from '../api/client'
import { hasCached, setCached } from './dataCache'

const SEASONS = [2025, 2024, 2023, 2022, 2021]
const DELAY_MS = 600  // gap between background requests

function delay(ms) {
    return new Promise(r => setTimeout(r, ms))
}

async function prefetchStandings(season) {
    const key = `standings:${season}`
    if (hasCached(key)) return
    try {
        const data = await fetchStandings(season)
        setCached(key, data)
    } catch {
        // silent — will retry on user navigation
    }
}

async function prefetchCalendar(season) {
    const key = `calendar:${season}`
    if (hasCached(key)) return
    try {
        const data = await fetchCalendar(season)
        setCached(key, data)
    } catch {
        // silent
    }
}

/**
 * Start background prefetching for all seasons.
 * Staggered so the active-season request always wins first.
 * Call once from App.jsx with the currentSeason that's already loading.
 */
export async function prefetchAll(activeSeason = 2025) {
    // Wait so the active page's own request fires first
    await delay(1000)

    // Always fetch active season first, then the rest
    const ordered = [activeSeason, ...SEASONS.filter(s => s !== activeSeason)]

    for (const season of ordered) {
        await prefetchStandings(season)
        await delay(DELAY_MS)
        await prefetchCalendar(season)
        await delay(DELAY_MS / 2)
    }
}
