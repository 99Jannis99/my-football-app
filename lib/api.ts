const API_KEY = "d523bfc1e47b1deb27c12adc9d668d82";
const BASE_URL = "https://v3.football.api-sports.io";

const headers = {
  "x-apisports-key": API_KEY,
};

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
  };
  goals: {
    for: number;
    against: number;
  };
  goalsDiff: number;
};

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
