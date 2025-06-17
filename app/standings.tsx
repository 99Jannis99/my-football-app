import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { Button, Card, Text } from "react-native-paper";
import { TeamStatistics, fetchStandings } from "../lib/api";

/**
 * Standings-Komponente
 * Zeigt die aktuelle Tabelle der Bundesliga an.
 * Ermöglicht Navigation zu den Team-Details durch Klick auf ein Team.
 */

export default function Standings() {
  // States für die Tabelle, Ladezustand und Fehlerbehandlung
  const [standings, setStandings] = useState<TeamStatistics[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // aufruf der loadStandings Funktion beim laden der Page
  useEffect(() => {
    loadStandings();
  }, []);

  // Funktion zum laden der standings, ruft die fetchStandings Funktion aus der api.ts auf, bekommt TeamStatistics zurück
  const loadStandings = async () => {
    try {
      const data = await fetchStandings(78, 2023);
      setStandings(data);
      setLoading(false);
      setError(null);
    } catch (err) {
      setError("Fehler beim Laden der Tabelle");
      setLoading(false);
    }
  };

  // Navigation zur Page [id] in team mit Mitgabe der ID als Parameter
  const handleTeamPress = (teamId: number) => {
    router.push({
      pathname: "/team/[id]",
      params: { id: teamId },
    });
  };

  // Zeigt den Ladekreis an wenn die standing noch nicht komplett geladen sind
  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    );
  }

  // zeigt die Error-Message an wenn die standings nicht geladen werden konnten, plus Button zum neuen Aufruf der loadStandings Funktion
  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
        <Button
          mode="contained"
          onPress={loadStandings}
          style={styles.retryButton}
        >
          Erneut versuchen
        </Button>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {standings.map((standing) => (
        <Pressable
          key={standing.team.id}
          style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
          onPress={() => handleTeamPress(standing.team.id)}
        >
          <View style={styles.header}>
            <Text style={styles.rank}>{standing.rank}</Text>
            <Text style={styles.teamName}>{standing.team.name}</Text>
          </View>
          <Card.Content style={styles.cardContent}>
            <View style={styles.stats}>
              <Text style={styles.statText}>{standing.all.played}</Text>
              <Text style={styles.statText}>{standing.all.win}</Text>
              <Text style={styles.statText}>{standing.all.draw}</Text>
              <Text style={styles.statText}>{standing.all.lose}</Text>
              <Text style={styles.statText}>{standing.goalsDiff}</Text>
              <Text style={styles.points}>{standing.points}</Text>
            </View>
          </Card.Content>
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a1a",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1a1a1a",
  },
  header: {
    flexDirection: "row",
    padding: 16,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
  },
  card: {
    padding: 16,
    margin: 8,
    backgroundColor: "#2a2a2a",
    borderRadius: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  cardPressed: {
    backgroundColor: "#3a3a3a",
    transform: [{ scale: 0.98 }],
    elevation: 1,
    shadowOpacity: 0.2,
  },
  cardContent: {
    flexDirection: "row",
  },
  rank: {
    width: 30,
    fontSize: 16,
    color: "#ffffff",
    fontWeight: "bold",
    textAlign: "center",
    marginLeft: 8,
  },
  teamName: {
    textAlign: "center",
    fontSize: 16,
    color: "#ffffff",
    marginLeft: 8,
  },
  stats: {
    flexDirection: "row",
  },
  statText: {
    width: 30,
    textAlign: "center",
    color: "#cccccc",
    marginLeft: 8,
  },
  points: {
    width: 40,
    textAlign: "center",
    color: "#ffffff",
    fontWeight: "bold",
    marginLeft: 8,
  },
  errorText: {
    color: "#ff4444",
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: "#666666",
  },
});
