import { useState, useRef, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Logo from '../components/Logo'


const NAV_LINKS = [
    { to: '/standings', label: 'Standings' },
    { to: '/calendar', label: 'Calendar' },
    { to: '/events/1', label: 'Events' },
    { to: '/analytics', label: 'Analytics' },
]

// All available themes with display info
const THEMES = [
    { id: 'dark', label: 'Dark', color: '#5A6478', group: 'Base' },
    { id: 'light', label: 'Light', color: '#E10600', group: 'Base' },
    { id: 'ferrari', label: 'Ferrari', color: '#DC0000', group: '2025 Teams' },
    { id: 'redbull', label: 'Red Bull', color: '#3671C6', group: '2025 Teams' },
    { id: 'mercedes', label: 'Mercedes', color: '#27F4D2', group: '2025 Teams' },
    { id: 'mclaren', label: 'McLaren', color: '#FF8000', group: '2025 Teams' },
    { id: 'astonmartin', label: 'Aston Martin', color: '#229971', group: '2025 Teams' },
    { id: 'williams', label: 'Williams', color: '#64C4FF', group: '2025 Teams' },
    { id: 'alpine', label: 'Alpine', color: '#FF87BC', group: '2025 Teams' },
    { id: 'sauber', label: 'Sauber', color: '#52E252', group: '2025 Teams' },
    { id: 'cadillac', label: 'Cadillac', color: '#C0C0C0', group: '2026 New' },
    { id: 'audi', label: 'Audi', color: '#BB0A21', group: '2026 New' },
]

function ThemePicker({ theme, onSetTheme }) {
    const [open, setOpen] = useState(false)
    const ref = useRef(null)
    const current = THEMES.find(t => t.id === theme) || THEMES[0]

    // Close when clicking outside
    useEffect(() => {
        function handler(e) {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false)
        }
        document.addEventListener('mousedown', handler)
        return () => document.removeEventListener('mousedown', handler)
    }, [])

    const base = THEMES.filter(t => t.group === 'Base')
    const teams = THEMES.filter(t => t.group === '2025 Teams')
    const new26 = THEMES.filter(t => t.group === '2026 New')

    return (
        <div ref={ref} style={{ position: 'relative' }}>
            {/* Trigger button */}
            <button
                onClick={() => setOpen(o => !o)}
                className="btn"
                title="Choose theme"
                style={{ padding: '5px 10px', gap: 7, fontSize: 12 }}
            >
                {/* Color swatch */}
                <span style={{
                    width: 10, height: 10, borderRadius: '50%',
                    background: current.color,
                    display: 'inline-block', flexShrink: 0,
                    boxShadow: `0 0 6px ${current.color}80`,
                }} />
                <span>{current.label}</span>
                <span style={{ fontSize: 9, color: 'var(--text-muted)', transition: 'transform 0.15s', transform: open ? 'rotate(180deg)' : 'rotate(0deg)', display: 'inline-block' }}>▼</span>
            </button>

            {/* Dropdown */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: -6, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -6, scale: 0.97 }}
                        transition={{ duration: 0.15 }}
                        style={{
                            position: 'absolute',
                            top: 'calc(100% + 8px)',
                            right: 0,
                            minWidth: 200,
                            background: 'var(--panel)',
                            border: '1px solid var(--border)',
                            borderRadius: 'var(--radius-lg)',
                            padding: '8px 0',
                            boxShadow: '0 16px 40px rgba(0,0,0,0.5)',
                            zIndex: 200,
                        }}
                    >
                        {/* Base group */}
                        <div style={{ padding: '4px 12px 6px', fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                            Base
                        </div>
                        {base.map(t => <ThemeRow key={t.id} t={t} active={theme === t.id} onSelect={() => { onSetTheme(t.id); setOpen(false) }} />)}

                        <div style={{ height: 1, background: 'var(--border)', margin: '6px 0' }} />

                        <div style={{ padding: '4px 12px 6px', fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                            2025 Teams
                        </div>
                        {teams.map(t => <ThemeRow key={t.id} t={t} active={theme === t.id} onSelect={() => { onSetTheme(t.id); setOpen(false) }} />)}

                        <div style={{ height: 1, background: 'var(--border)', margin: '6px 0' }} />

                        <div style={{ padding: '4px 12px 6px', fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                            2026 New Teams
                        </div>
                        {new26.map(t => <ThemeRow key={t.id} t={t} active={theme === t.id} onSelect={() => { onSetTheme(t.id); setOpen(false) }} />)}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

function ThemeRow({ t, active, onSelect }) {
    return (
        <button
            onClick={onSelect}
            style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '8px 14px',
                background: active ? `${t.color}12` : 'transparent',
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'background 0.12s',
            }}
            onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'var(--panel-hover)' }}
            onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent' }}
        >
            {/* Color swatch */}
            <span style={{
                width: 12, height: 12, borderRadius: 3,
                background: t.color,
                display: 'inline-block', flexShrink: 0,
                boxShadow: active ? `0 0 8px ${t.color}80` : 'none',
            }} />
            <span style={{ fontSize: 13, color: active ? t.color : 'var(--text-secondary)', fontWeight: active ? 600 : 400, fontFamily: 'var(--font)' }}>
                {t.label}
            </span>
            {active && (
                <span style={{ marginLeft: 'auto', fontSize: 10, color: t.color }}>✓</span>
            )}
        </button>
    )
}

export default function Navbar({ theme, onSetTheme }) {
    const location = useLocation()

    return (
        <motion.nav
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            style={{
                position: 'fixed',
                top: 0, left: 0, right: 0,
                zIndex: 100,
                height: 'var(--navbar-h)',
                background: 'rgba(14,17,22,0.88)',
                backdropFilter: 'blur(14px)',
                WebkitBackdropFilter: 'blur(14px)',
                borderBottom: '1px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
            }}
        >
            <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '100%' }}>
                {/* Logo */}
                <Link to="/standings" style={{ textDecoration: 'none' }}>
                    <Logo size={26} fontSize={14} />
                </Link>

                {/* Nav links */}
                <div style={{ display: 'flex', gap: 0 }}>
                    {NAV_LINKS.map(({ to, label }) => {
                        const active = location.pathname === to || (to.startsWith('/events') && location.pathname.startsWith('/events'))
                        return (
                            <Link key={to} to={to} style={{ textDecoration: 'none' }}>
                                <div style={{ position: 'relative', padding: '0 14px', height: 'var(--navbar-h)', display: 'flex', alignItems: 'center' }}>
                                    <span style={{
                                        fontSize: 13,
                                        fontWeight: active ? 600 : 400,
                                        color: active ? 'var(--text-primary)' : 'var(--text-secondary)',
                                        transition: 'color var(--transition-micro)',
                                    }}>
                                        {label}
                                    </span>
                                    {active && (
                                        <motion.div
                                            layoutId="nav-underline"
                                            style={{
                                                position: 'absolute', bottom: 0, left: 0, right: 0,
                                                height: 2, background: 'var(--accent)', borderRadius: '1px 1px 0 0',
                                            }}
                                            transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                                        />
                                    )}
                                </div>
                            </Link>
                        )
                    })}
                </div>

                {/* Theme picker */}
                <ThemePicker theme={theme} onSetTheme={onSetTheme} />
            </div>
        </motion.nav>
    )
}
