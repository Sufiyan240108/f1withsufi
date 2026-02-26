import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Logo from './Logo'

/**
 * F1 Race Start Lights — 5-light sequence
 *
 * Timeline:
 *   0ms      — screen appears
 *   700ms    — light 1 on
 *   1400ms   — light 2 on
 *   2100ms   — light 3 on
 *   2800ms   — light 4 on
 *   3500ms   — light 5 on
 *   4600ms   — all lights out (RACE START!)
 *   5100ms   — screen begins exit transition
 *   5700ms   — main app fully visible
 */

const LIGHT_DELAY = 700    // ms between each light
const LIGHTS_OUT_AT = 3500 + 1100  // after L5, wait 1.1s then kill all
const EXIT_AT = LIGHTS_OUT_AT + 500

function Light({ on }) {
    return (
        <motion.div
            animate={{
                backgroundColor: on ? '#CC0000' : '#1A1A1A',
                boxShadow: on
                    ? '0 0 28px 12px rgba(204,0,0,0.7), 0 0 60px 20px rgba(204,0,0,0.3), inset 0 0 16px rgba(255,100,100,0.4)'
                    : '0 0 0px 0px rgba(204,0,0,0)',
            }}
            transition={{ duration: 0.12, ease: 'easeOut' }}
            style={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                border: '3px solid #333',
                background: '#1A1A1A',
                position: 'relative',
            }}
        >
            {/* Inner highlight */}
            <div style={{
                position: 'absolute',
                top: 8, left: 12,
                width: 18, height: 10,
                borderRadius: '50%',
                background: on ? 'rgba(255,180,180,0.35)' : 'rgba(255,255,255,0.03)',
                transition: 'background 0.12s',
            }} />
        </motion.div>
    )
}

export default function StartScreen({ onComplete }) {
    const [litCount, setLitCount] = useState(0)   // 0..5 lights lit
    const [allOut, setAllOut] = useState(false)
    const [exiting, setExiting] = useState(false)

    useEffect(() => {
        const timers = []

        // Light up one by one
        for (let i = 1; i <= 5; i++) {
            timers.push(setTimeout(() => setLitCount(i), i * LIGHT_DELAY))
        }

        // All lights out
        timers.push(setTimeout(() => {
            setLitCount(0)
            setAllOut(true)
        }, LIGHTS_OUT_AT))

        // Start exit
        timers.push(setTimeout(() => setExiting(true), EXIT_AT))

        // Signal completion to parent
        timers.push(setTimeout(() => onComplete?.(), EXIT_AT + 650))

        return () => timers.forEach(clearTimeout)
    }, [onComplete])

    return (
        <AnimatePresence>
            {!exiting && (
                <motion.div
                    key="start-screen"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 1.04 }}
                    transition={{ duration: 0.65, ease: [0.4, 0, 0.2, 1] }}
                    style={{
                        position: 'fixed',
                        inset: 0,
                        zIndex: 9999,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: '#08090D',
                        gap: 0,
                    }}
                >
                    {/* Track stripe background */}
                    <div style={{
                        position: 'absolute',
                        inset: 0,
                        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 60px, rgba(255,255,255,0.012) 60px, rgba(255,255,255,0.012) 61px)',
                        pointerEvents: 'none',
                    }} />

                    {/* Logo */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        style={{ marginBottom: 80, textAlign: 'center' }}
                    >
                        <div style={{ transform: 'scale(1.8)', transformOrigin: 'top center', marginBottom: 24, display: 'flex', justifyContent: 'center' }}>
                            <Logo size={28} fontSize={16} />
                        </div>
                        <div style={{ fontSize: 11, color: '#5A6478', letterSpacing: '0.2em', textTransform: 'uppercase', fontFamily: 'var(--font)' }}>
                            Formula 1 Analytics
                        </div>
                    </motion.div>

                    {/* Light gantry */}
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.2 }}
                    >
                        {/* Gantry bar */}
                        <div style={{
                            width: 'calc(5 * 64px + 4 * 20px + 48px)',
                            height: 20,
                            background: '#1A1D24',
                            border: '2px solid #2A2D34',
                            borderRadius: 4,
                            marginBottom: 10,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '0 24px',
                        }}>
                            {/* Gantry mount points */}
                            {[0, 1, 2, 3, 4].map(i => (
                                <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: '#3A3D44' }} />
                            ))}
                        </div>

                        {/* Light pods */}
                        <div style={{
                            display: 'flex',
                            gap: 20,
                            background: '#111318',
                            border: '2px solid #252830',
                            borderRadius: 12,
                            padding: '24px 24px',
                            boxShadow: '0 20px 60px rgba(0,0,0,0.8)',
                        }}>
                            {[1, 2, 3, 4, 5].map(n => (
                                <div key={n} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                                    <Light on={litCount >= n && !allOut} />
                                    {/* Light number */}
                                    <span style={{ fontSize: 9, color: '#3A3D44', fontFamily: 'monospace', letterSpacing: '0.1em' }}>
                                        {String(n).padStart(2, '0')}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Gantry legs */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 16px' }}>
                            {[0, 1].map(i => (
                                <div key={i} style={{ width: 8, height: 24, background: '#1A1D24', borderRadius: '0 0 4px 4px' }} />
                            ))}
                        </div>
                    </motion.div>

                    {/* Status text */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        style={{ marginTop: 56, height: 24, textAlign: 'center' }}
                    >
                        {!allOut ? (
                            <span style={{ fontSize: 12, color: '#5A6478', letterSpacing: '0.15em', textTransform: 'uppercase', fontFamily: 'var(--font)' }}>
                                {litCount === 0 ? 'Preparing for race start…' : `${litCount} light${litCount > 1 ? 's' : ''}`}
                            </span>
                        ) : (
                            <motion.span
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                style={{ fontSize: 18, fontWeight: 700, color: '#E10600', letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: 'var(--font)' }}
                            >
                                GO!
                            </motion.span>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
