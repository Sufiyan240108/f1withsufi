import { motion } from 'framer-motion'
import { pageVariants } from '../shared/motionConfig'

export default function AnalyticsPage() {
    return (
        <motion.div className="page" variants={pageVariants} initial="initial" animate="animate" exit="exit">
            <div className="container">
                <div className="page-header">
                    <div className="page-subtitle">Season Overview</div>
                    <h1>Championship Analytics</h1>
                </div>

                {/* Stat summary row */}
                <div style={{ display: 'flex', gap: 16, marginBottom: 32, flexWrap: 'wrap' }}>
                    {[
                        { label: 'Rounds Complete', value: '4' },
                        { label: 'Avg Pit Stop', value: '23.8s' },
                        { label: 'Total Overtakes', value: '—' },
                        { label: 'Fastest Lap', value: '—' },
                    ].map(s => (
                        <div key={s.label} className="stat-card" style={{ flex: '1 1 180px' }}>
                            <div className="stat-label">{s.label}</div>
                            <div className="stat-value" style={{ fontSize: 22 }}>{s.value}</div>
                        </div>
                    ))}
                </div>

                <div className="card" style={{ marginBottom: 24 }}>
                    <div className="card-header">
                        <span className="card-title">Championship Progression</span>
                        <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Points over rounds</span>
                    </div>
                    <div className="empty-state">
                        <div className="empty-state-icon">⬡</div>
                        <p>Chart.js line chart will render here with per-round standings data from the API.</p>
                    </div>
                </div>

                <div className="card">
                    <div className="card-header"><span className="card-title">Constructor Performance Trend</span></div>
                    <div className="empty-state">
                        <div className="empty-state-icon">⬡</div>
                        <p>Constructor points trend over season will appear here.</p>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}
