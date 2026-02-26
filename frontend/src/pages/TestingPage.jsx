import { motion } from 'framer-motion'
import { pageVariants } from '../shared/motionConfig'

export default function TestingPage() {
    return (
        <motion.div className="page" variants={pageVariants} initial="initial" animate="animate" exit="exit">
            <div className="container">
                <div className="page-header">
                    <div className="page-subtitle">Pre-Season Testing</div>
                    <h1>Testing Analytics</h1>
                </div>

                <div className="grid-2" style={{ marginBottom: 32 }}>
                    <div className="card">
                        <div className="card-header"><span className="card-title">Long-Run Clustering</span></div>
                        <div className="empty-state" style={{ padding: '32px 0' }}>
                            <div className="empty-state-icon">⬡</div>
                            <p>Load a testing session via the API to view long-run clusters.</p>
                        </div>
                    </div>
                    <div className="card">
                        <div className="card-header"><span className="card-title">Performance Bands</span></div>
                        <div className="empty-state" style={{ padding: '32px 0' }}>
                            <div className="empty-state-icon">⬡</div>
                            <p>Performance band grouping will appear after testing data is fetched.</p>
                        </div>
                    </div>
                </div>

                <div className="card">
                    <div className="card-header"><span className="card-title">Team Heatmap</span></div>
                    <div className="empty-state">
                        <div className="empty-state-icon">⬡</div>
                        <p>D3 heatmap — team × session pace — will render with live API data.</p>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}
