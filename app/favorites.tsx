import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { Card, Text } from "react-native-paper";
import { TeamStatistics, fetchTeamStatistics } from "../lib/api";

export default function Favorites() {
  const [favorites, setFavorites] = useState<number[]>([]);
  const [teamStats, setTeamStats] = useState<TeamStatistics[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const storedFavorites = await AsyncStorage.getItem("favorites");
      const favoriteTeams = storedFavorites ? JSON.parse(storedFavorites) : [];
      setFavorites(favoriteTeams);

      // Lade Statistiken für alle Favoriten
      const stats = await Promise.all(
        favoriteTeams.map((teamId: number) => fetchTeamStatistics(teamId))
      );
      setTeamStats(stats);
      setLoading(false);
    } catch (error) {
      console.error("Fehler beim Laden der Favoriten:", error);
      setLoading(false);
    }
  };

  const handleTeamPress = (teamId: number) => {
    router.push({
      pathname: "/team/[id]",
      params: { id: teamId },
    });
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    );
  }

  if (favorites.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>
          Keine Favoriten vorhanden. Fügen Sie Teams aus der Tabelle zu Ihren Favoriten hinzu.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {teamStats.map((team) => (
        <Pressable
          key={team.team.id}
          style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
          onPress={() => handleTeamPress(team.team.id)}
        >
          <View style={styles.header}>
            <Text style={styles.rank}>{team.rank}</Text>
            <Text style={styles.teamName}>{team.team.name}</Text>
          </View>
          <Card.Content style={styles.cardContent}>
            <View style={styles.stats}>
              <Text style={styles.statText}>{team.all.played}</Text>
              <Text style={styles.statText}>{team.all.win}</Text>
              <Text style={styles.statText}>{team.all.draw}</Text>
              <Text style={styles.statText}>{team.all.lose}</Text>
              <Text style={styles.statText}>{team.goalsDiff}</Text>
              <Text style={styles.points}>{team.points}</Text>
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
    textAlign: "center",
    fontSize: 16,
    lineHeight: 24,
  },
});
