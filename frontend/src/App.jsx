import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { prefetchAll } from './cache/prefetch'
import StartScreen from './components/StartScreen'
import Navbar from './layout/Navbar'
import StandingsPage from './pages/StandingsPage'
import CalendarPage from './pages/CalendarPage'
import EventPage from './pages/EventPage'
import TestingPage from './pages/TestingPage'
import AnalyticsPage from './pages/AnalyticsPage'

function NotFound() {
    return (
        <div className="page">
            <div className="container">
                <div className="empty-state">
                    <div className="empty-state-icon">⬡</div>
                    <h2 style={{ marginBottom: 8 }}>404 — Page Not Found</h2>
                    <p>The requested page does not exist.</p>
                </div>
            </div>
        </div>
    )
}

export default function App() {
    const [theme, setTheme] = useState(() => localStorage.getItem('f1theme') || 'dark')
    // Show start screen only once per browser session
    const [showStart, setShowStart] = useState(() => !sessionStorage.getItem('f1_started'))

    // Apply theme to <html> data-theme
    useEffect(() => {
        const html = document.documentElement
        if (theme === 'dark') {
            html.removeAttribute('data-theme')
        } else {
            html.setAttribute('data-theme', theme)
        }
        localStorage.setItem('f1theme', theme)
    }, [theme])

    // Kick off background prefetch
    useEffect(() => {
        prefetchAll(2025)
    }, [])

    function handleStartComplete() {
        sessionStorage.setItem('f1_started', '1')
        setShowStart(false)
    }

    return (
        <BrowserRouter>
            {/* Start screen renders on top; main app is already mounted beneath */}
            <AnimatePresence>
                {showStart && <StartScreen key="start" onComplete={handleStartComplete} />}
            </AnimatePresence>

            {/* Main app — fades in as start screen exits */}
            <motion.div
                initial={{ opacity: showStart ? 0 : 1 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: showStart ? 4.8 : 0 }}
            >
                <Navbar theme={theme} onSetTheme={setTheme} />
                <AnimatePresence mode="wait">
                    <Routes>
                        <Route path="/" element={<Navigate to="/standings" replace />} />
                        <Route path="/standings" element={<StandingsPage />} />
                        <Route path="/calendar" element={<CalendarPage />} />
                        <Route path="/events/:round" element={<EventPage />} />
                        <Route path="/testing" element={<TestingPage />} />
                        <Route path="/analytics" element={<AnalyticsPage />} />
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </AnimatePresence>
            </motion.div>
        </BrowserRouter>
    )
}
