const API_KEY = "4418d1b2e7msh345dbeb3bdee7ebp1af063jsn65b2e57068a8";
const BASE_URL = "https://api-football-v1.p.rapidapi.com/v3";

const headers = {
  "x-rapidapi-key": API_KEY,
  "x-rapidapi-host": "api-football-v1.p.rapidapi.com",
};

// Beispieltyp für Team-Infos
export type TeamDetailsInfo = {
  team: {
    id: number;
    name: string;
    logo: string;
    country: string;
    founded: number;
    code: string;
    national: boolean;
  };
  venue: {
    id: number;
    name: string;
    address: string;
    city: string;
    capacity: number;
    surface: string;
    image: string;
  };
};

// Beispieltyp für Standings (Liga-Tabelle)
export type TeamStatistics = {
  rank: number;
  team: {
    id: number;
    name: string;
    logo: string;
  };
  points: number;
  all: {
    played: number;
    win: number;
    draw: number;
    lose: number;
  };
  goals: {
    for: number;
    against: number;
  };
  goalsDiff: number;
};

// Holt die Tabelle einer Liga (z. B. Bundesliga: league=78, season=2023)
export const fetchStandings = async (leagueId: number, season: number) => {
  const res = await fetch(
    `${BASE_URL}/standings?league=${leagueId}&season=${season}`,
    {
      method: "GET",
      headers,
    }
  );

  if (!res.ok) {
    console.error("Fehler beim API-Aufruf:", res.status, res.statusText);
    throw new Error("API request failed");
  }

  const data = await res.json();
  return data.response?.[0]?.league?.standings?.[0] ?? [];
};

// Holt Detailinfos zu einem Team
export const fetchTeamDetails = async (
  teamId: number
): Promise<TeamDetailsInfo> => {
  const res = await fetch(`${BASE_URL}/teams?id=${teamId}`, {
    method: "GET",
    headers,
  });

  if (!res.ok) {
    console.error("Fehler beim API-Aufruf:", res.status, res.statusText);
    throw new Error("API request failed");
  }

  const data = await res.json();
  if (!data.response?.[0]) {
    throw new Error("Team nicht gefunden");
  }
  return data.response[0];
};

// Holt die Quoten für ein bestimmtes Spiel
export const fetchOdds = async (
  leagueId: number,
  bookmakerId: number,
  page: number = 1
) => {
  const res = await fetch(
    `${BASE_URL}/odds?league=${leagueId}&bookmaker=${bookmakerId}&page=${page}`,
    {
      method: "GET",
      headers,
    }
  );

  if (!res.ok) {
    console.error("Fehler beim API-Aufruf:", res.status, res.statusText);
    throw new Error("API request failed");
  }

  const data = await res.json();
  return data.response ?? [];
};

// Beispiel: Holt Team-Statistiken über Standings
export const fetchTeamStatistics = async (
  teamId: number,
  leagueId: number = 78,
  season: number = 2023
): Promise<TeamStatistics> => {
  const standings = await fetchStandings(leagueId, season);
  const teamStats = standings.find((team: TeamStatistics) => team.team.id === teamId);

  if (!teamStats) {
    throw new Error("Team-Statistiken nicht gefunden");
  }

  return teamStats;
};
