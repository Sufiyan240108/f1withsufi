/**
 * dataCache.js — Module-level singleton cache with pub/sub
 *
 * Lives outside React — survives re-renders and page navigation.
 * Components subscribe to keys and get notified when data lands.
 */

const _cache = new Map()
const _listeners = new Map()

/** Read cached value. Returns undefined if not yet loaded. */
export function getCached(key) {
    return _cache.get(key)
}

/** Store a value and notify all subscribers. */
export function setCached(key, value) {
    _cache.set(key, value)
    const fns = _listeners.get(key)
    if (fns) fns.forEach(fn => fn(value))
}

/** Returns true if key is already cached. */
export function hasCached(key) {
    return _cache.has(key)
}

/**
 * Subscribe to updates for a cache key.
 * Returns an unsubscribe function.
 */
export function subscribe(key, fn) {
    if (!_listeners.has(key)) _listeners.set(key, new Set())
    _listeners.get(key).add(fn)
    return () => {
        const fns = _listeners.get(key)
        if (fns) fns.delete(fn)
    }
}

/** Clear a specific key (force refetch on next access). */
export function invalidate(key) {
    _cache.delete(key)
}
