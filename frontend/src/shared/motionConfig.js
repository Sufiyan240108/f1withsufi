// Shared motion config for Framer Motion
export const motionConfig = {
    micro: { duration: 0.15, ease: [0.4, 0, 0.2, 1] },
    panel: { duration: 0.25, ease: [0.4, 0, 0.2, 1] },
    graph: { duration: 0.40, ease: [0.4, 0, 0.2, 1] },
}

export const pageVariants = {
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0, transition: motionConfig.panel },
    exit: { opacity: 0, y: -8, transition: { duration: 0.15 } },
}

export const staggerContainer = {
    animate: { transition: { staggerChildren: 0.05 } },
}

export const staggerItem = {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0, transition: motionConfig.panel },
}
