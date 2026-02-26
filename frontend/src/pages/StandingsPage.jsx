import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { pageVariants } from '../shared/motionConfig'
import { getTeamColor } from '../shared/teamColors'
import { useStandings } from '../hooks/useDataCache'
import StandingsTable from '../components/StandingsTable'

const SEASONS = [2026, 2025, 2024, 2023, 2022, 2021]

// ─── Championship Hero Banner ─────────────────────────────────────────────────
function ChampionshipHero({ data, season }) {
    if (!data?.drivers?.length) return null
    const leader = data.drivers[0]
    const p2 = data.drivers[1]
    const gap = leader && p2 ? leader.points - p2.points : null
    const teamColor = getTeamColor(leader.constructor_id)
    const round = data.round || '—'

    return (
        <div style={{
            position: 'relative',
            overflow: 'hidden',
            borderRadius: 'var(--radius-lg)',
            border: `1px solid ${teamColor}30`,
            background: `linear-gradient(135deg, ${teamColor}10 0%, var(--panel) 60%)`,
            padding: '28px 32px',
            marginBottom: 32,
        }}>
            {/* Accent stripe */}
            <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, background: teamColor, borderRadius: '8px 0 0 8px' }} />

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20 }}>
                <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>
                        Championship Leader · {season} Season · After Round {round}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
                        <span style={{ fontSize: 11, fontFamily: 'monospace', color: teamColor, background: `${teamColor}18`, border: `1px solid ${teamColor}40`, borderRadius: 3, padding: '2px 6px', fontWeight: 700 }}>
                            {leader.driver_code}
                        </span>
                        <h2 style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.03em', color: 'var(--text-primary)' }}>
                            {leader.driver_name}
                        </h2>
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
                        {leader.constructor_name}
                    </div>
                </div>

                <div style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
                    {/* Points */}
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: 36, fontWeight: 700, color: teamColor, letterSpacing: '-0.04em', lineHeight: 1 }}>
                            {leader.points}
                        </div>
                        <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 2 }}>Points</div>
                    </div>

                    {/* Wins */}
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: 36, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.04em', lineHeight: 1 }}>
                            {leader.wins}
                        </div>
                        <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 2 }}>Wins</div>
                    </div>

                    {/* Gap to P2 */}
                    {gap !== null && (
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: 36, fontWeight: 700, color: 'var(--green)', letterSpacing: '-0.04em', lineHeight: 1 }}>
                                +{gap}
                            </div>
                            <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 2 }}>Pts ahead of P2</div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

// ─── Constructor Hero ─────────────────────────────────────────────────────────
function ConstructorHero({ data, season }) {
    if (!data?.constructors?.length) return null
    const leader = data.constructors[0]
    const p2 = data.constructors[1]
    const gap = leader && p2 ? leader.points - p2.points : null
    const color = getTeamColor(leader.constructor_id)

    return (
        <div style={{
            position: 'relative',
            overflow: 'hidden',
            borderRadius: 'var(--radius-lg)',
            border: `1px solid ${color}30`,
            background: `linear-gradient(135deg, ${color}10 0%, var(--panel) 60%)`,
            padding: '20px 24px',
            marginBottom: 20,
        }}>
            <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, background: color, borderRadius: '8px 0 0 8px' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                <div>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4 }}>Constructors Leader</div>
                    <h3 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)' }}>{leader.constructor_name}</h3>
                </div>
                <div style={{ display: 'flex', gap: 24 }}>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: 24, fontWeight: 700, color }}>{leader.points}</div>
                        <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Points</div>
                    </div>
                    {gap !== null && (
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--green)' }}>+{gap}</div>
                            <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Ahead of P2</div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

// ─── Team Filter Pills ─────────────────────────────────────────────────────────
function TeamFilter({ data, activeTeam, onSelect }) {
    const teams = [...new Set((data?.drivers || []).map(d => d.constructor_name))].sort()
    return (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
            <button
                onClick={() => onSelect(null)}
                className="btn"
                style={{ fontSize: 11, padding: '4px 10px', background: !activeTeam ? 'var(--accent-dim)' : undefined, borderColor: !activeTeam ? 'rgba(225,6,0,0.3)' : undefined, color: !activeTeam ? 'var(--accent)' : undefined }}
            >
                All Teams
            </button>
            {teams.map(team => {
                const driver = (data?.drivers || []).find(d => d.constructor_name === team)
                const color = getTeamColor(driver?.constructor_id || '')
                const active = activeTeam === team
                return (
                    <button key={team} onClick={() => onSelect(active ? null : team)} className="btn" style={{
                        fontSize: 11, padding: '4px 10px',
                        borderColor: active ? color : `${color}50`,
                        color: active ? color : 'var(--text-secondary)',
                        background: active ? `${color}15` : undefined,
                    }}>
                        {team}
                    </button>
                )
            })}
        </div>
    )
}

// ─── Season Summary Stats ─────────────────────────────────────────────────────
function SeasonStats({ data }) {
    if (!data?.drivers?.length) return null
    const drivers = data.drivers
    const totalWins = drivers.reduce((s, d) => s + d.wins, 0)
    const winnersCount = drivers.filter(d => d.wins > 0).length
    const totalPts = drivers.reduce((s, d) => s + d.points, 0)

    return (
        <div style={{ display: 'flex', gap: 12, marginBottom: 28, flexWrap: 'wrap' }}>
            {[
                { label: 'Total Races', value: data.round || '—' },
                { label: 'Races Scored', value: totalWins },
                { label: 'Different Winners', value: winnersCount },
                { label: 'Total Points Distributed', value: totalPts.toLocaleString() },
            ].map(s => (
                <div key={s.label} className="stat-card" style={{ flex: '1 1 140px', padding: '12px 16px' }}>
                    <div className="stat-label">{s.label}</div>
                    <div className="stat-value" style={{ fontSize: 20 }}>{s.value}</div>
                </div>
            ))}
        </div>
    )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function StandingsPage() {
    const [season, setSeason] = useState(2025)
    const [activeTeam, setActiveTeam] = useState(null)
    const { data, loading, error } = useStandings(season)

    const filteredDrivers = activeTeam
        ? (data?.drivers || []).filter(d => d.constructor_name === activeTeam)
        : (data?.drivers || [])

    const seasonStarted = data && data.drivers?.length > 0

    return (
        <motion.div className="page" variants={pageVariants} initial="initial" animate="animate" exit="exit">
            <div className="container">

                {/* Header row */}
                <div className="page-header" style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                    <div>
                        <div className="page-subtitle">Formula 1 · Championship Standings</div>
                        <h1>Standings</h1>
                    </div>
                    <select className="select" value={season} onChange={e => setSeason(Number(e.target.value))}>
                        {SEASONS.map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                </div>

                {/* Error */}
                {error && (
                    <div style={{ padding: '12px 16px', background: 'var(--red-dim)', border: '1px solid rgba(244,67,54,0.3)', borderRadius: 'var(--radius-md)', color: 'var(--red)', marginBottom: 24, fontSize: 13 }}>
                        ⚠ {error} — check that the backend is running at localhost:8000
                    </div>
                )}

                {/* Season not started */}
                {!loading && !error && !seasonStarted && (
                    <div style={{ textAlign: 'center', padding: '64px 24px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)', background: 'var(--panel)' }}>
                        <div style={{ fontSize: 40, marginBottom: 16 }}>🏁</div>
                        <h2 style={{ marginBottom: 8 }}>{season} Season Not Started</h2>
                        <p style={{ maxWidth: 420, margin: '0 auto' }}>
                            No race results yet for the {season} season. Standings will appear here after the opening race weekend.
                        </p>
                    </div>
                )}

                <AnimatePresence mode="wait">
                    {loading && (
                        <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                            { /* Skeleton hero */}
                            <div className="skeleton" style={{ height: 110, borderRadius: 'var(--radius-lg)', marginBottom: 32 }} />
                            <div className="grid-2">
                                {[0, 1].map(i => (
                                    <div key={i} className="card">
                                        <div className="card-header"><span className="skeleton skeleton-text" style={{ width: 80 }} /></div>
                                        <StandingsTable data={[]} loading={true} />
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {!loading && seasonStarted && (
                        <motion.div key="standings" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>

                            {/* Hero banners */}
                            <ChampionshipHero data={data} season={season} />

                            {/* Season stats */}
                            <SeasonStats data={data} />

                            {/* ─── DRIVERS ─── */}
                            <div className="section">
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
                                    <h2 style={{ fontSize: 18 }}>Drivers Championship</h2>
                                    <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{filteredDrivers.length} drivers</span>
                                </div>
                                <TeamFilter data={data} activeTeam={activeTeam} onSelect={setActiveTeam} />
                                <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                                    <StandingsTable data={filteredDrivers} type="driver" loading={false} />
                                </div>
                            </div>

                            {/* ─── CONSTRUCTORS ─── */}
                            <div className="section">
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                                    <h2 style={{ fontSize: 18 }}>Constructors Championship</h2>
                                    <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{data.constructors?.length || 0} teams</span>
                                </div>
                                <ConstructorHero data={data} season={season} />
                                <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                                    <StandingsTable data={data.constructors || []} type="constructor" loading={false} />
                                </div>
                            </div>

                        </motion.div>
                    )}
                </AnimatePresence>

            </div>
        </motion.div>
    )
}
