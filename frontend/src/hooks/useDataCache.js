/**
 * Custom hooks that read from module-level cache first.
 * - If cached: returns data instantly with loading=false
 * - If not cached: fires fetch, subscribes to update, shows skeleton
 * - Background prefetch hits cache → components re-render instantly
 */
import { useState, useEffect } from 'react'
import { getCached, setCached, hasCached, subscribe } from '../cache/dataCache'
import { fetchStandings, fetchCalendar } from '../api/client'

// ─── Standings ────────────────────────────────────────────────────────────────
export function useStandings(season) {
    const key = `standings:${season}`
    const [data, setData] = useState(() => getCached(key) ?? null)
    const [loading, setLoading] = useState(!hasCached(key))
    const [error, setError] = useState(null)

    useEffect(() => {
        // Reset to match new season immediately
        const cached = getCached(key)
        setData(cached ?? null)
        setError(null)

        if (cached) {
            setLoading(false)
            // Still subscribe in case background refetch comes in later
        } else {
            setLoading(true)
            // Fetch and cache
            fetchStandings(season)
                .then(d => { setCached(key, d); setLoading(false) })
                .catch(e => { setError(e.message); setLoading(false) })
        }

        // Subscribe: if background prefetch loaded this key, update immediately
        const unsub = subscribe(key, (d) => {
            setData(d)
            setLoading(false)
            setError(null)
        })

        return unsub
    }, [key])

    return { data, loading, error }
}

// ─── Calendar ─────────────────────────────────────────────────────────────────
export function useCalendar(season) {
    const key = `calendar:${season}`
    const [data, setData] = useState(() => getCached(key) ?? null)
    const [loading, setLoading] = useState(!hasCached(key))
    const [error, setError] = useState(null)

    useEffect(() => {
        const cached = getCached(key)
        setData(cached ?? null)
        setError(null)

        if (cached) {
            setLoading(false)
        } else {
            setLoading(true)
            fetchCalendar(season)
                .then(d => { setCached(key, d); setLoading(false) })
                .catch(e => { setError(e.message); setLoading(false) })
        }

        const unsub = subscribe(key, (d) => {
            setData(d)
            setLoading(false)
            setError(null)
        })

        return unsub
    }, [key])

    return { data, loading, error }
}
