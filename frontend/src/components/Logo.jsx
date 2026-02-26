export function TireIcon({ size = 26 }) {
    return (
        <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
            {/* Outer tyre */}
            <circle cx="16" cy="16" r="15" fill="#111" stroke="#333" strokeWidth="1.5" />
            {/* Tread ring */}
            <circle cx="16" cy="16" r="13.5" fill="none" stroke="#222" strokeWidth="4.5" />
            {/* Sidewall ring */}
            <circle cx="16" cy="16" r="9" fill="none" stroke="#2a2a2a" strokeWidth="1" />
            {/* Rim */}
            <circle cx="16" cy="16" r="7.5" fill="#1a1a1a" stroke="#444" strokeWidth="1.2" />
            {/* 5 spokes */}
            {[0, 72, 144, 216, 288].map((deg, i) => {
                const rad = (deg - 90) * Math.PI / 180
                const x1 = 16 + 2.5 * Math.cos(rad)
                const y1 = 16 + 2.5 * Math.sin(rad)
                const x2 = 16 + 7 * Math.cos(rad)
                const y2 = 16 + 7 * Math.sin(rad)
                return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#555" strokeWidth="1.5" strokeLinecap="round" />
            })}
            {/* Center hub */}
            <circle cx="16" cy="16" r="2.2" fill="#666" />
            {/* Red accent dot */}
            <circle cx="16" cy="16" r="0.9" fill="var(--accent)" />
        </svg>
    )
}

export default function Logo({ size = 26, fontSize = 14, showText = true }) {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: size * 0.3, flexShrink: 0 }}>
            <TireIcon size={size} />
            {showText && (
                <span style={{ fontSize, fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text-primary)', lineHeight: 1 }}>
                    f1with<span style={{ color: 'var(--accent)' }}>sufi</span>
                </span>
            )}
        </div>
    )
}
