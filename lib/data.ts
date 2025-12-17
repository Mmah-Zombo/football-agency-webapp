// Sample data for the Football Agents Management System

export interface Player {
  id: number
  name: string
  age: number
  position: string
  nationality: string
  currentClub: string
  marketValue: string
  status: "Available" | "Under Contract" | "Injured"
  image: string
}

export interface Club {
  id: number
  name: string
  location: string
  league: string
  playersManaged: number
  activeContracts: number
  logo: string
  email?: string
  phone?: string
  website?: string
  founded?: string
}

export interface Contract {
  id: number
  playerId: number
  playerName: string
  clubId: number
  clubName: string
  startDate: string
  endDate: string
  fee: string
  status: "Active" | "Expiring Soon" | "Expired"
}

export interface Match {
  id: number
  date: string
  homeTeam: string
  awayTeam: string
  venue: string
  managedPlayers: string[]
  result: string | null
  status: "Upcoming" | "Completed" | "In Progress"
}

// export const players: Player[] = [
//   {
//     id: 1,
//     name: "Marcus Johnson",
//     age: 24,
//     position: "Forward",
//     nationality: "England",
//     currentClub: "Manchester FC",
//     marketValue: "€45M",
//     status: "Under Contract",
//     image: "/football-player-portrait-young-forward.jpg",
//   },
//   {
//     id: 2,
//     name: "Carlos Rodriguez",
//     age: 28,
//     position: "Midfielder",
//     nationality: "Spain",
//     currentClub: "Real Madrid B",
//     marketValue: "€32M",
//     status: "Under Contract",
//     image: "/football-player-portrait-midfielder-spanish.jpg",
//   },
//   {
//     id: 3,
//     name: "Liam O'Brien",
//     age: 22,
//     position: "Defender",
//     nationality: "Ireland",
//     currentClub: "Celtic United",
//     marketValue: "€18M",
//     status: "Available",
//     image: "/football-player-portrait-defender-irish.jpg",
//   },
//   {
//     id: 4,
//     name: "Jean-Pierre Mbeki",
//     age: 26,
//     position: "Goalkeeper",
//     nationality: "France",
//     currentClub: "Paris Saint FC",
//     marketValue: "€28M",
//     status: "Under Contract",
//     image: "/football-player-portrait-goalkeeper.jpg",
//   },
//   {
//     id: 5,
//     name: "Hans Mueller",
//     age: 30,
//     position: "Midfielder",
//     nationality: "Germany",
//     currentClub: "Bayern Munich B",
//     marketValue: "€25M",
//     status: "Injured",
//     image: "/football-player-portrait-german-midfielder.jpg",
//   },
//   {
//     id: 6,
//     name: "Alessandro Costa",
//     age: 23,
//     position: "Forward",
//     nationality: "Italy",
//     currentClub: "AC Milano",
//     marketValue: "€38M",
//     status: "Under Contract",
//     image: "/football-player-portrait-italian-forward.jpg",
//   },
// ]

export const clubs: Club[] = [
  {
    id: 1,
    name: "Manchester FC",
    location: "Manchester, England",
    league: "Premier League",
    playersManaged: 3,
    activeContracts: 2,
    logo: "/manchester-football-club-logo-crest.jpg",
    email: "contact@manchesterfc.com",
    phone: "+44 161 868 8000",
    website: "www.manchesterfc.com",
    founded: "1878",
  },
  {
    id: 2,
    name: "Real Madrid B",
    location: "Madrid, Spain",
    league: "La Liga",
    playersManaged: 2,
    activeContracts: 2,
    logo: "/real-madrid-style-football-club-logo.jpg",
    email: "contact@realmadridb.com",
    phone: "+34 91 398 4300",
    website: "www.realmadrid.com",
    founded: "1902",
  },
  {
    id: 3,
    name: "Celtic United",
    location: "Glasgow, Scotland",
    league: "Scottish Premiership",
    playersManaged: 1,
    activeContracts: 1,
    logo: "/celtic-style-football-club-logo-green.jpg",
    email: "info@celticunited.com",
    phone: "+44 871 226 1888",
    website: "www.celticunited.com",
    founded: "1887",
  },
  {
    id: 4,
    name: "Paris Saint FC",
    location: "Paris, France",
    league: "Ligue 1",
    playersManaged: 2,
    activeContracts: 1,
    logo: "/paris-football-club-logo-blue-red.jpg",
    email: "contact@parissaintfc.com",
    phone: "+33 1 41 41 41 41",
    website: "www.parissaintfc.com",
    founded: "1970",
  },
  {
    id: 5,
    name: "Bayern Munich B",
    location: "Munich, Germany",
    league: "Bundesliga",
    playersManaged: 1,
    activeContracts: 1,
    logo: "/bayern-munich-style-football-club-logo.jpg",
    email: "info@bayernmunichb.com",
    phone: "+49 89 69931 0",
    website: "www.fcbayern.com",
    founded: "1900",
  },
  {
    id: 6,
    name: "AC Milano",
    location: "Milan, Italy",
    league: "Serie A",
    playersManaged: 2,
    activeContracts: 2,
    logo: "/ac-milan-style-football-club-logo-red-black.jpg",
    email: "contact@acmilano.com",
    phone: "+39 02 62281",
    website: "www.acmilan.com",
    founded: "1899",
  },
]

export const contracts: Contract[] = [
  {
    id: 1,
    playerId: 1,
    playerName: "Marcus Johnson",
    clubId: 1,
    clubName: "Manchester FC",
    startDate: "2023-07-01",
    endDate: "2026-06-30",
    fee: "€12M",
    status: "Active",
  },
  {
    id: 2,
    playerId: 2,
    playerName: "Carlos Rodriguez",
    clubId: 2,
    clubName: "Real Madrid B",
    startDate: "2022-08-15",
    endDate: "2025-08-14",
    fee: "€8M",
    status: "Expiring Soon",
  },
  {
    id: 3,
    playerId: 4,
    playerName: "Jean-Pierre Mbeki",
    clubId: 4,
    clubName: "Paris Saint FC",
    startDate: "2024-01-01",
    endDate: "2028-12-31",
    fee: "€15M",
    status: "Active",
  },
  {
    id: 4,
    playerId: 5,
    playerName: "Hans Mueller",
    clubId: 5,
    clubName: "Bayern Munich B",
    startDate: "2021-06-01",
    endDate: "2025-05-31",
    fee: "€6M",
    status: "Expiring Soon",
  },
  {
    id: 5,
    playerId: 6,
    playerName: "Alessandro Costa",
    clubId: 6,
    clubName: "AC Milano",
    startDate: "2023-09-01",
    endDate: "2027-08-31",
    fee: "€18M",
    status: "Active",
  },
]

export const matches: Match[] = [
  {
    id: 1,
    date: "2025-01-15",
    homeTeam: "Manchester FC",
    awayTeam: "Liverpool FC",
    venue: "Old Trafford",
    managedPlayers: ["Marcus Johnson"],
    result: null,
    status: "Upcoming",
  },
  {
    id: 2,
    date: "2025-01-12",
    homeTeam: "Real Madrid B",
    awayTeam: "Barcelona B",
    venue: "Bernabeu Mini",
    managedPlayers: ["Carlos Rodriguez"],
    result: "2-1",
    status: "Completed",
  },
  {
    id: 3,
    date: "2025-01-18",
    homeTeam: "Paris Saint FC",
    awayTeam: "Lyon FC",
    venue: "Parc des Princes",
    managedPlayers: ["Jean-Pierre Mbeki"],
    result: null,
    status: "Upcoming",
  },
  {
    id: 4,
    date: "2025-01-10",
    homeTeam: "AC Milano",
    awayTeam: "Inter Milan",
    venue: "San Siro",
    managedPlayers: ["Alessandro Costa"],
    result: "1-1",
    status: "Completed",
  },
  {
    id: 5,
    date: "2025-01-20",
    homeTeam: "Celtic United",
    awayTeam: "Rangers FC",
    venue: "Celtic Park",
    managedPlayers: ["Liam O'Brien"],
    result: null,
    status: "Upcoming",
  },
]

export const dashboardStats = {
  totalPlayers: 6,
  activeContracts: 5,
  upcomingMatches: 3,
  totalClubs: 6,
  contractValue: "€59M",
  expiringContracts: 2,
}
