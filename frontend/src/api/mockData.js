export const MOCK_STANDINGS = {
    season: 2024,
    drivers: [
        { position: 1, driver_name: "Max Verstappen", driver_code: "VER", constructor_name: "Red Bull", points: 331, wins: 9, driver_nationality: "Dutch" },
        { position: 2, driver_name: "Lando Norris", driver_code: "NOR", constructor_name: "McLaren", points: 279, wins: 3, driver_nationality: "British" },
        { position: 3, driver_name: "Charles Leclerc", driver_code: "LEC", constructor_name: "Ferrari", points: 245, wins: 3, driver_nationality: "Monegasque" },
        { position: 4, driver_name: "Oscar Piastri", driver_code: "PIA", constructor_name: "McLaren", points: 237, wins: 2, driver_nationality: "Australian" },
        { position: 5, driver_name: "Carlos Sainz", driver_code: "SAI", constructor_name: "Ferrari", points: 190, wins: 2, driver_nationality: "Spanish" },
        { position: 6, driver_name: "George Russell", driver_code: "RUS", constructor_name: "Mercedes", points: 177, wins: 1, driver_nationality: "British" },
        { position: 7, driver_name: "Lewis Hamilton", driver_code: "HAM", constructor_name: "Mercedes", points: 166, wins: 0, driver_nationality: "British" },
        { position: 8, driver_name: "Sergio Perez", driver_code: "PER", constructor_name: "Red Bull", points: 150, wins: 0, driver_nationality: "Mexican" },
        { position: 9, driver_name: "Fernando Alonso", driver_code: "ALO", constructor_name: "Aston Martin", points: 62, wins: 0, driver_nationality: "Spanish" },
        { position: 10, driver_name: "Lance Stroll", driver_code: "STR", constructor_name: "Aston Martin", points: 24, wins: 0, driver_nationality: "Canadian" },
    ],
    constructors: [
        { position: 1, constructor_name: "McLaren", points: 516, wins: 6, constructor_nationality: "British" },
        { position: 2, constructor_name: "Ferrari", points: 441, wins: 5, constructor_nationality: "Italian" },
        { position: 3, constructor_name: "Red Bull", points: 481, wins: 9, constructor_nationality: "Austrian" },
        { position: 4, constructor_name: "Mercedes", points: 343, wins: 1, constructor_nationality: "German" },
        { position: 5, constructor_name: "Aston Martin", points: 86, wins: 0, constructor_nationality: "British" },
    ],
}

const today = new Date()
const addDays = (d) => { const dt = new Date(today); dt.setDate(dt.getDate() + d); return dt.toISOString().split('T')[0] }

export const MOCK_CALENDAR = {
    season: 2024,
    events: [
        { round: 1, name: "Bahrain Grand Prix", circuit_name: "Bahrain International Circuit", country: "Bahrain", date: "2024-03-02", is_sprint: false },
        { round: 2, name: "Saudi Arabian Grand Prix", circuit_name: "Jeddah Corniche Circuit", country: "Saudi Arabia", date: "2024-03-09", is_sprint: false },
        { round: 3, name: "Australian Grand Prix", circuit_name: "Albert Park Circuit", country: "Australia", date: "2024-03-24", is_sprint: false },
        { round: 4, name: "Japanese Grand Prix", circuit_name: "Suzuka International Racing Course", country: "Japan", date: "2024-04-07", is_sprint: false },
        { round: 5, name: "Chinese Grand Prix", circuit_name: "Shanghai International Circuit", country: "China", date: "2024-04-21", is_sprint: true },
        { round: 6, name: "Miami Grand Prix", circuit_name: "Miami International Autodrome", country: "USA", date: addDays(14), is_sprint: true },
        { round: 7, name: "Emilia Romagna Grand Prix", circuit_name: "Autodromo Enzo e Dino Ferrari", country: "Italy", date: addDays(28), is_sprint: false },
        { round: 8, name: "Monaco Grand Prix", circuit_name: "Circuit de Monaco", country: "Monaco", date: addDays(42), is_sprint: false },
        { round: 9, name: "Canadian Grand Prix", circuit_name: "Circuit Gilles Villeneuve", country: "Canada", date: addDays(56), is_sprint: false },
        { round: 10, name: "Spanish Grand Prix", circuit_name: "Circuit de Barcelona-Catalunya", country: "Spain", date: addDays(70), is_sprint: false },
    ],
}

export const MOCK_EVENT = {
    season: 2024,
    round: 6,
    race_results: [
        { position: 1, driver: { full_name: "Lando Norris", code: "NOR" }, constructor: { name: "McLaren" }, time: "1:30:49.876", status: "Finished", points: 25, grid: 1 },
        { position: 2, driver: { full_name: "Max Verstappen", code: "VER" }, constructor: { name: "Red Bull" }, time: "+7.612s", status: "Finished", points: 18, grid: 2 },
        { position: 3, driver: { full_name: "Charles Leclerc", code: "LEC" }, constructor: { name: "Ferrari" }, time: "+9.503s", status: "Finished", points: 15, grid: 4 },
    ],
    sprint_results: [],
    pit_stops: [
        { driver_id: "norris", lap: 22, stop: 1, duration: "23.456" },
        { driver_id: "verstappen", lap: 20, stop: 1, duration: "24.100" },
        { driver_id: "leclerc", lap: 25, stop: 1, duration: "22.800" },
    ],
}
