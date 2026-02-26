// Official F1 team colors (2025 season)
export const TEAM_COLORS = {
    mclaren: '#FF8000',
    mercedes: '#27F4D2',
    red_bull: '#3671C6',
    ferrari: '#E8002D',
    williams: '#64C4FF',
    rb: '#6692FF',
    aston_martin: '#229971',
    haas: '#B6BABD',
    sauber: '#52E252',
    alpine: '#FF87BC',
    // fallback
    default: '#5A6478',
}

export function getTeamColor(constructorId = '') {
    const key = constructorId.toLowerCase().replace(/[^a-z_]/g, '_')
    return TEAM_COLORS[key] || TEAM_COLORS.default
}

// Nationality → flag emoji
export const NATIONALITY_FLAGS = {
    'British': '🇬🇧',
    'Dutch': '🇳🇱',
    'Australian': '🇦🇺',
    'German': '🇩🇪',
    'Monegasque': '🇲🇨',
    'Spanish': '🇪🇸',
    'Italian': '🇮🇹',
    'French': '🇫🇷',
    'Mexican': '🇲🇽',
    'Canadian': '🇨🇦',
    'Finnish': '🇫🇮',
    'Danish': '🇩🇰',
    'Thai': '🇹🇭',
    'Japanese': '🇯🇵',
    'Chinese': '🇨🇳',
    'American': '🇺🇸',
    'Austrian': '🇦🇹',
    'Brazilian': '🇧🇷',
    'Argentine': '🇦🇷',
    'Swiss': '🇨🇭',
    'New Zealander': '🇳🇿',
    'Swedish': '🇸🇪',
    'Russian': '🇷🇺',
    'Polish': '🇵🇱',
    'Belgian': '🇧🇪',
    'Portuguese': '🇵🇹',
}

export function getFlag(nationality = '') {
    return NATIONALITY_FLAGS[nationality] || '🏁'
}
