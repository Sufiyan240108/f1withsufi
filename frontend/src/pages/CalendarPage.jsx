import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { pageVariants, staggerContainer, staggerItem } from '../shared/motionConfig'
import { useCalendar } from '../hooks/useDataCache'

function useCountdown(targetDate) {
    const [timeLeft, setTimeLeft] = useState({})
    useEffect(() => {
        const tick = () => {
            const diff = new Date(targetDate) - new Date()
            if (diff <= 0) { setTimeLeft({ past: true }); return }
            const d = Math.floor(diff / 86400000)
            const h = Math.floor((diff % 86400000) / 3600000)
            const m = Math.floor((diff % 3600000) / 60000)
            setTimeLeft({ d, h, m })
        }
        tick()
        const id = setInterval(tick, 60000)
        return () => clearInterval(id)
    }, [targetDate])
    return timeLeft
}

function ScheduleCard({ event, isNext }) {
    const timer = useCountdown(event.date)
    const isPast = new Date(event.date) < new Date() && !isNext

    return (
        <motion.div variants={staggerItem}>
            <Link to={`/events/${event.round}`} style={{ textDecoration: 'none', display: 'block' }}>
                <div className="card" style={{
                    borderColor: isNext ? 'rgba(225,6,0,0.3)' : undefined,
                    opacity: isPast ? 0.55 : 1,
                    transition: 'transform var(--transition-micro), border-color var(--transition-micro)',
                    cursor: 'pointer',
                }}>
                    {/* Round number */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                        <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                            Round {event.round}
                        </span>
                        <div style={{ display: 'flex', gap: 6 }}>
                            {event.is_sprint && <span className="badge badge-sprint">Sprint</span>}
                            {isNext && <span className="badge badge-next">Next Race</span>}
                            {isPast && <span className="badge badge-past">Completed</span>}
                        </div>
                    </div>

                    {/* GP Name */}
                    <h3 style={{ marginBottom: 4, fontSize: 15 }}>{event.name}</h3>
                    <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12 }}>
                        {event.circuit_name} · {event.country}
                    </p>

                    {/* Date */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                            {new Date(event.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                        {isNext && !timer.past && (
                            <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--accent)', letterSpacing: '0.02em' }}>
                                {timer.d}d {timer.h}h {timer.m}m
                            </span>
                        )}
                    </div>
                </div>
            </Link>
        </motion.div>
    )
}

export default function CalendarPage() {
    const [season, setSeason] = useState(2025)
    const { data, loading } = useCalendar(season)

    const events = data?.events || []
    const now = new Date()
    const nextIdx = events.findIndex(e => new Date(e.date) >= now)

    return (
        <motion.div className="page" variants={pageVariants} initial="initial" animate="animate" exit="exit">
            <div className="container">
                <div className="page-header" style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                    <div>
                        <div className="page-subtitle">Formula 1 · Season Calendar</div>
                        <h1>Race Schedule</h1>
                    </div>
                    <select className="select" value={season} onChange={e => setSeason(Number(e.target.value))}>
                        {[2026, 2025, 2024, 2023].map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                </div>

                {loading ? (
                    <div className="grid-3">
                        {Array.from({ length: 9 }).map((_, i) => (
                            <div key={i} className="skeleton" style={{ height: 140, borderRadius: 'var(--radius-lg)' }} />
                        ))}
                    </div>
                ) : (
                    <motion.div className="grid-3" variants={staggerContainer} initial="initial" animate="animate">
                        {events.map((event, i) => (
                            <ScheduleCard key={event.round} event={event} isNext={i === nextIdx} />
                        ))}
                    </motion.div>
                )}
            </div>
        </motion.div>
    )
}
