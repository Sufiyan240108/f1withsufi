import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { pageVariants } from '../shared/motionConfig'
import { getTeamColor, getFlag } from '../shared/teamColors'
import { fetchEvent } from '../api/client'

const TABS = ['Race', 'Qualifying', 'Sprint', 'Pit Stops', 'Practice', 'Strategy']

// ── Shared helpers ────────────────────────────────────────────────────────────
function DriverCell({ driver, constructor: ctor, carNumber }) {
    const color = getTeamColor(ctor?.id || '')
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 3, height: 22, borderRadius: 2, background: color, flexShrink: 0 }} />
            <span style={{ fontFamily: 'monospace', fontSize: 10, color, background: `${color}18`, border: `1px solid ${color}30`, borderRadius: 3, padding: '1px 5px', fontWeight: 700 }}>
                {carNumber || driver?.code}
            </span>
            <div>
                <span style={{ fontWeight: 500, color: 'var(--text-primary)', fontSize: 13 }}>{driver?.full_name}</span>
                <span style={{ marginLeft: 8, fontSize: 11, color: 'var(--text-muted)' }}>{ctor?.name}</span>
            </div>
        </div>
    )
}

function PosCell({ pos, isTop3 }) {
    return (
        <span style={{ fontWeight: 700, fontSize: 14, color: isTop3 ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
            {pos}
        </span>
    )
}

function EmptyTab({ label }) {
    return (
        <div className="empty-state" style={{ padding: '64px 24px' }}>
            <div className="empty-state-icon">⏱</div>
            <h3 style={{ marginBottom: 8 }}>{label} Data</h3>
            <p>This session uses FastF1 telemetry data — requires the backend analytics engine with FastF1 cache enabled.</p>
        </div>
    )
}

// ── Race Tab ──────────────────────────────────────────────────────────────────
function RaceTab({ results }) {
    if (!results?.length) return <EmptyTab label="Race Results" />

    // Fastest lap driver
    const flDriver = results.find(r => r.fastest_lap_rank === 1)

    return (
        <div>
            {flDriver && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 16px', background: 'var(--panel)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', marginBottom: 20, fontSize: 12 }}>
                    <span style={{ color: 'var(--accent)', fontWeight: 700 }}>⚡ FASTEST LAP</span>
                    <span style={{ color: 'var(--text-secondary)' }}>{flDriver.driver?.full_name}</span>
                    <span style={{ fontFamily: 'monospace', color: 'var(--text-primary)', fontWeight: 600 }}>{flDriver.fastest_lap}</span>
                </div>
            )}
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <table className="data-table" style={{ minWidth: 680 }}>
                    <thead>
                        <tr>
                            <th style={{ width: 40 }}>POS</th>
                            <th style={{ width: 40 }}>GRD</th>
                            <th>Driver</th>
                            <th style={{ textAlign: 'right' }}>Time / Gap</th>
                            <th style={{ textAlign: 'right' }}>Laps</th>
                            <th style={{ textAlign: 'right' }}>Fastest Lap</th>
                            <th style={{ textAlign: 'right', width: 50 }}>PTS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {results.map((r, i) => {
                            const isFinished = r.status === 'Finished' || r.status?.startsWith('+')
                            const isFl = r.fastest_lap_rank === 1
                            return (
                                <tr key={i}>
                                    <td><PosCell pos={r.position} isTop3={i < 3} /></td>
                                    <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>P{r.grid}</td>
                                    <td><DriverCell driver={r.driver} constructor={r.constructor} carNumber={r.car_number} /></td>
                                    <td style={{ textAlign: 'right', fontFamily: 'monospace', fontSize: 12, color: isFinished ? 'var(--text-secondary)' : 'var(--red)' }}>
                                        {r.time || r.status}
                                    </td>
                                    <td style={{ textAlign: 'right', fontSize: 12, color: 'var(--text-muted)' }}>{r.laps}</td>
                                    <td style={{ textAlign: 'right', fontFamily: 'monospace', fontSize: 11, color: isFl ? 'var(--accent)' : 'var(--text-muted)' }}>
                                        {r.fastest_lap || '—'} {isFl && '⚡'}
                                    </td>
                                    <td style={{ textAlign: 'right', fontWeight: r.points > 0 ? 700 : 400, color: r.points > 0 ? 'var(--text-primary)' : 'var(--text-muted)', fontSize: 13 }}>
                                        {r.points > 0 ? r.points : '—'}
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

// ── Qualifying Tab ────────────────────────────────────────────────────────────
function QualifyingTab({ results }) {
    if (!results?.length) return <EmptyTab label="Qualifying Results" />

    const q3 = results.filter(r => r.q3)
    const q2only = results.filter(r => r.q2 && !r.q3)
    const q1only = results.filter(r => !r.q2)

    const QSection = ({ title, rows, accent }) => (
        <div style={{ marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <div style={{ height: 2, width: 24, background: accent, borderRadius: 1 }} />
                <span style={{ fontSize: 11, fontWeight: 700, color: accent, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{title}</span>
            </div>
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <table className="data-table">
                    <thead>
                        <tr>
                            <th style={{ width: 40 }}>POS</th>
                            <th>Driver</th>
                            <th style={{ textAlign: 'right' }}>Q1</th>
                            {rows.some(r => r.q2) && <th style={{ textAlign: 'right' }}>Q2</th>}
                            {rows.some(r => r.q3) && <th style={{ textAlign: 'right' }}>Q3</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((r, i) => (
                            <tr key={i}>
                                <td><PosCell pos={r.position} isTop3={r.position <= 3} /></td>
                                <td><DriverCell driver={r.driver} constructor={r.constructor} carNumber={r.car_number} /></td>
                                <td style={{ textAlign: 'right', fontFamily: 'monospace', fontSize: 12, color: 'var(--text-secondary)' }}>{r.q1 || '—'}</td>
                                {rows.some(x => x.q2) && <td style={{ textAlign: 'right', fontFamily: 'monospace', fontSize: 12, color: 'var(--text-secondary)' }}>{r.q2 || '—'}</td>}
                                {rows.some(x => x.q3) && <td style={{ textAlign: 'right', fontFamily: 'monospace', fontSize: 12, fontWeight: r.q3 ? 600 : 400, color: r.q3 ? 'var(--text-primary)' : 'var(--text-muted)' }}>{r.q3 || '—'}</td>}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )

    return (
        <div>
            {q3.length > 0 && <QSection title="Q3 — Top 10 Shootout" rows={q3} accent="var(--accent)" />}
            {q2only.length > 0 && <QSection title="Q2 — Eliminated" rows={q2only} accent="var(--yellow)" />}
            {q1only.length > 0 && <QSection title="Q1 — Eliminated" rows={q1only} accent="var(--text-muted)" />}
        </div>
    )
}

// ── Sprint Tab ────────────────────────────────────────────────────────────────
function SprintTab({ results }) {
    if (!results?.length) return (
        <div className="empty-state" style={{ padding: '64px 24px' }}>
            <div className="empty-state-icon">🏎</div>
            <h3 style={{ marginBottom: 8 }}>No Sprint Race</h3>
            <p>This was not a sprint weekend.</p>
        </div>
    )

    return (
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <table className="data-table" style={{ minWidth: 560 }}>
                <thead>
                    <tr>
                        <th style={{ width: 40 }}>POS</th>
                        <th>Driver</th>
                        <th style={{ textAlign: 'right' }}>Time / Gap</th>
                        <th style={{ textAlign: 'right' }}>Laps</th>
                        <th style={{ textAlign: 'right', width: 50 }}>PTS</th>
                    </tr>
                </thead>
                <tbody>
                    {results.map((r, i) => (
                        <tr key={i}>
                            <td><PosCell pos={r.position} isTop3={i < 3} /></td>
                            <td><DriverCell driver={r.driver} constructor={r.constructor} carNumber={r.car_number} /></td>
                            <td style={{ textAlign: 'right', fontFamily: 'monospace', fontSize: 12, color: 'var(--text-secondary)' }}>{r.time || r.status}</td>
                            <td style={{ textAlign: 'right', fontSize: 12, color: 'var(--text-muted)' }}>{r.laps}</td>
                            <td style={{ textAlign: 'right', fontWeight: r.points > 0 ? 700 : 400, color: r.points > 0 ? 'var(--text-primary)' : 'var(--text-muted)', fontSize: 13 }}>
                                {r.points > 0 ? r.points : '—'}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

// ── Pit Stops Tab ─────────────────────────────────────────────────────────────
function PitStopsTab({ pitStops, raceResults }) {
    if (!pitStops?.length) return <EmptyTab label="Pit Stop" />

    // Build driver lookup from race results
    const driverMap = {}
        ; (raceResults || []).forEach(r => {
            if (r.driver?.id) driverMap[r.driver.id] = { driver: r.driver, constructor: r.constructor, carNumber: r.car_number }
        })

    // Sort by stop time (lap asc, then stop number asc)
    const sorted = [...pitStops].sort((a, b) => a.lap - b.lap || a.stop - b.stop)

    // Fastest stop
    const fastest = [...pitStops].sort((a, b) => parseFloat(a.duration) - parseFloat(b.duration))[0]

    return (
        <div>
            {fastest && (
                <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
                    <div className="stat-card" style={{ flex: '1 1 160px', padding: '10px 16px' }}>
                        <div className="stat-label">Fastest Stop</div>
                        <div className="stat-value" style={{ fontSize: 20 }}>{fastest.duration}s</div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{driverMap[fastest.driver_id]?.driver?.full_name || fastest.driver_id} · Lap {fastest.lap}</div>
                    </div>
                    <div className="stat-card" style={{ flex: '1 1 160px', padding: '10px 16px' }}>
                        <div className="stat-label">Total Pit Stops</div>
                        <div className="stat-value" style={{ fontSize: 20 }}>{pitStops.length}</div>
                    </div>
                    <div className="stat-card" style={{ flex: '1 1 160px', padding: '10px 16px' }}>
                        <div className="stat-label">Avg Stop Duration</div>
                        <div className="stat-value" style={{ fontSize: 20 }}>
                            {(pitStops.reduce((s, p) => s + parseFloat(p.duration || 0), 0) / pitStops.length).toFixed(3)}s
                        </div>
                    </div>
                </div>
            )}

            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Driver</th>
                            <th style={{ textAlign: 'right' }}>Stop #</th>
                            <th style={{ textAlign: 'right' }}>Lap</th>
                            <th style={{ textAlign: 'right' }}>Duration</th>
                            <th style={{ textAlign: 'right' }}>Time of Day</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sorted.map((s, i) => {
                            const info = driverMap[s.driver_id]
                            const isFastest = s.driver_id === fastest?.driver_id && s.stop === fastest?.stop
                            return (
                                <tr key={i}>
                                    <td>
                                        {info
                                            ? <DriverCell driver={info.driver} constructor={info.constructor} carNumber={info.carNumber} />
                                            : <span style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'monospace' }}>{s.driver_id}</span>
                                        }
                                    </td>
                                    <td style={{ textAlign: 'right', fontSize: 13, color: 'var(--text-secondary)' }}>#{s.stop}</td>
                                    <td style={{ textAlign: 'right', fontSize: 13, color: 'var(--text-secondary)' }}>{s.lap}</td>
                                    <td style={{ textAlign: 'right', fontFamily: 'monospace', fontSize: 13, fontWeight: isFastest ? 700 : 400, color: isFastest ? 'var(--green)' : 'var(--text-primary)' }}>
                                        {s.duration}s {isFastest && '⚡'}
                                    </td>
                                    <td style={{ textAlign: 'right', fontFamily: 'monospace', fontSize: 12, color: 'var(--text-muted)' }}>{s.time}</td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function EventPage() {
    const { round } = useParams()
    const [season] = useState(2025)
    const [event, setEvent] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [tab, setTab] = useState('Race')

    useEffect(() => {
        setLoading(true)
        setError(null)
        fetchEvent(Number(round), season)
            .then(d => { setEvent(d); setLoading(false) })
            .catch(e => { setError(e.message); setLoading(false) })
    }, [round, season])

    const info = event?.race_info || {}
    const hasSprint = event?.sprint_results?.length > 0
    const visibleTabs = TABS.filter(t => t !== 'Sprint' || hasSprint)

    function renderTabContent() {
        if (loading) return Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="skeleton skeleton-row" style={{ marginBottom: 6 }} />
        ))
        if (error) return <div style={{ padding: '16px', background: 'var(--red-dim)', border: '1px solid rgba(244,67,54,0.3)', borderRadius: 'var(--radius-md)', color: 'var(--red)', fontSize: 13 }}>⚠ {error}</div>
        switch (tab) {
            case 'Race': return <RaceTab results={event?.race_results} />
            case 'Qualifying': return <QualifyingTab results={event?.qualifying} />
            case 'Sprint': return <SprintTab results={event?.sprint_results} />
            case 'Pit Stops': return <PitStopsTab pitStops={event?.pit_stops} raceResults={event?.race_results} />
            case 'Practice': return <EmptyTab label="Practice (FP1/FP2/FP3)" />
            case 'Strategy': return <EmptyTab label="Strategy Analysis" />
            default: return null
        }
    }

    return (
        <motion.div className="page" variants={pageVariants} initial="initial" animate="animate" exit="exit">
            <div className="container">

                {/* Page header */}
                <div className="page-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                        <Link to="/calendar" style={{ fontSize: 12, color: 'var(--text-muted)', textDecoration: 'none' }}>← Calendar</Link>
                        <span style={{ color: 'var(--border)' }}>·</span>
                        <span className="page-subtitle" style={{ margin: 0 }}>
                            {season} Season · Round {round}
                            {info.country && ` · ${info.country}`}
                        </span>
                    </div>
                    <h1 style={{ fontSize: 26 }}>
                        {loading ? <span className="skeleton skeleton-text" style={{ width: 280, display: 'inline-block' }} /> : (info.race_name || `Round ${round}`)}
                    </h1>
                    {info.circuit_name && (
                        <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>
                            {info.circuit_name}{info.locality ? ` · ${info.locality}` : ''}
                            {info.date && ` · ${new Date(info.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}`}
                        </div>
                    )}
                </div>

                {/* Tab bar */}
                <div className="tab-bar">
                    {TABS.map(t => {
                        const disabled = t === 'Sprint' && !hasSprint && !loading
                        if (disabled) return null
                        return (
                            <button key={t} className={`tab-btn${tab === t ? ' active' : ''}`} onClick={() => setTab(t)}>
                                {t}
                                {tab === t && (
                                    <motion.div layoutId="event-tab-underline" className="tab-underline" transition={{ type: 'spring', stiffness: 500, damping: 40 }} />
                                )}
                            </button>
                        )
                    })}
                </div>

                {/* Tab content */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={tab + round}
                        initial={{ opacity: 0, x: 8 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -8 }}
                        transition={{ duration: 0.18 }}
                    >
                        {renderTabContent()}
                    </motion.div>
                </AnimatePresence>

            </div>
        </motion.div>
    )
}
