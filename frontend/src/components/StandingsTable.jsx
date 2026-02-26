import { motion } from 'framer-motion'
import { staggerContainer, staggerItem } from '../shared/motionConfig'
import { getTeamColor, getFlag } from '../shared/teamColors'

function PointsBar({ points, maxPoints }) {
    const pct = maxPoints > 0 ? (points / maxPoints) * 100 : 0
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 120 }}>
            <div style={{ flex: 1, height: 3, background: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden' }}>
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1], delay: 0.1 }}
                    style={{ height: '100%', background: 'var(--accent)', borderRadius: 2 }}
                />
            </div>
            <span style={{ fontSize: 11, color: 'var(--text-muted)', width: 32, textAlign: 'right' }}>
                {Math.round(pct)}%
            </span>
        </div>
    )
}

function SkeletonRows() {
    return Array.from({ length: 10 }).map((_, i) => (
        <tr key={i} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
            {Array.from({ length: 7 }).map((_, j) => (
                <td key={j} style={{ padding: '10px 12px' }}>
                    <div className="skeleton" style={{ height: 12, width: j === 1 ? 140 : j === 2 ? 90 : 50, borderRadius: 4 }} />
                </td>
            ))}
        </tr>
    ))
}

export default function StandingsTable({ data = [], type = 'driver', loading = false }) {
    const maxPoints = data.length > 0 ? data[0].points : 1

    if (loading) {
        return (
            <div style={{ overflowX: 'auto' }}>
                <table className="data-table" style={{ minWidth: 640 }}>
                    <tbody><SkeletonRows /></tbody>
                </table>
            </div>
        )
    }

    if (!data.length) {
        return (
            <div className="empty-state" style={{ padding: '32px 0' }}>
                <p>No standings data available</p>
            </div>
        )
    }

    return (
        <div style={{ overflowX: 'auto' }}>
            <motion.table
                className="data-table"
                style={{ minWidth: type === 'driver' ? 780 : 560 }}
                variants={staggerContainer}
                initial="initial"
                animate="animate"
            >
                <thead>
                    <tr>
                        <th style={{ width: 48 }}>POS</th>
                        {type === 'driver' && <th style={{ width: 40 }}>NUM</th>}
                        <th>{type === 'driver' ? 'Driver' : 'Constructor'}</th>
                        {type === 'driver' && <th>Team</th>}
                        <th>NAT</th>
                        <th style={{ textAlign: 'right' }}>PTS</th>
                        <th style={{ textAlign: 'right', width: 70 }}>GAP</th>
                        <th style={{ textAlign: 'right', width: 48 }}>W</th>
                        <th style={{ width: 160 }}>PACE BAR</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, i) => {
                        const teamColor = getTeamColor(row.constructor_id || row.constructor_id || '')
                        const flag = getFlag(row.driver_nationality || row.constructor_nationality || '')
                        const gap = row.gap_to_leader ?? 0

                        return (
                            <motion.tr key={row.driver_id || row.constructor_id || i} variants={staggerItem}>
                                {/* Position */}
                                <td>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                        {/* Team color strip */}
                                        <div style={{
                                            width: 3, height: 28, borderRadius: 2,
                                            background: teamColor,
                                            flexShrink: 0,
                                        }} />
                                        <span style={{
                                            fontSize: 13, fontWeight: 700,
                                            color: i < 3 ? 'var(--text-primary)' : 'var(--text-secondary)',
                                        }}>
                                            {row.position}
                                        </span>
                                    </div>
                                </td>

                                {/* Car number (driver only) */}
                                {type === 'driver' && (
                                    <td>
                                        <span style={{
                                            display: 'inline-block',
                                            fontFamily: 'monospace',
                                            fontSize: 11,
                                            fontWeight: 700,
                                            color: teamColor,
                                            background: `${teamColor}18`,
                                            border: `1px solid ${teamColor}40`,
                                            borderRadius: 3,
                                            padding: '1px 5px',
                                        }}>
                                            {row.car_number || '—'}
                                        </span>
                                    </td>
                                )}

                                {/* Name */}
                                <td>
                                    {type === 'driver' ? (
                                        <div>
                                            <span style={{ fontFamily: 'monospace', fontSize: 10, color: 'var(--text-muted)', marginRight: 6, letterSpacing: '0.04em' }}>
                                                {row.driver_code}
                                            </span>
                                            <span style={{ fontWeight: 500, color: 'var(--text-primary)', fontSize: 13 }}>
                                                {row.driver_name}
                                            </span>
                                        </div>
                                    ) : (
                                        <span style={{ fontWeight: 500, color: 'var(--text-primary)', fontSize: 13 }}>
                                            {row.constructor_name}
                                        </span>
                                    )}
                                </td>

                                {/* Team (driver only) */}
                                {type === 'driver' && (
                                    <td>
                                        <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                                            {row.constructor_name}
                                        </span>
                                    </td>
                                )}

                                {/* Flag */}
                                <td style={{ fontSize: 15, textAlign: 'center' }}>
                                    <span title={row.driver_nationality || row.constructor_nationality}>{flag}</span>
                                </td>

                                {/* Points */}
                                <td style={{ textAlign: 'right', fontWeight: 700, color: 'var(--text-primary)', fontSize: 14 }}>
                                    {row.points}
                                </td>

                                {/* Gap to leader */}
                                <td style={{ textAlign: 'right' }}>
                                    {gap === 0 ? (
                                        <span style={{ fontSize: 11, color: 'var(--accent)', fontWeight: 700 }}>LEAD</span>
                                    ) : (
                                        <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                                            {gap.toLocaleString()} pts
                                        </span>
                                    )}
                                </td>

                                {/* Wins */}
                                <td style={{ textAlign: 'right', fontSize: 13, color: row.wins > 0 ? 'var(--text-primary)' : 'var(--text-muted)', fontWeight: row.wins > 0 ? 600 : 400 }}>
                                    {row.wins}
                                </td>

                                {/* Points bar */}
                                <td>
                                    <PointsBar points={row.points} maxPoints={maxPoints} />
                                </td>
                            </motion.tr>
                        )
                    })}
                </tbody>
            </motion.table>
        </div>
    )
}
