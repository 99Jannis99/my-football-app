const API_KEY = "4418d1b2e7msh345dbeb3bdee7ebp1af063jsn65b2e57068a8";
const BASE_URL = "https://api-football-v1.p.rapidapi.com/v3";

const headers = {
  "x-rapidapi-key": API_KEY,
  "x-rapidapi-host": "api-football-v1.p.rapidapi.com",
};

// Hier haben wir die Typen für die API-Aufrufe definiert
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
    goals: {
      for: number;
      against: number;
    };
  };
  goalsDiff: number;
};

// Holt die Tabelle einer Liga (hier Bundesliga: league=78, season=2023)
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