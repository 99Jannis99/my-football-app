import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  BackHandler,
  Image,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { Button, Text } from "react-native-paper";
import {
  TeamDetailsInfo,
  TeamStatistics,
  fetchStandings,
  fetchTeamDetails,
} from "../../lib/api";

export default function TeamDetails() {
  const { id } = useLocalSearchParams();
  const [teamDetails, setTeamDetails] = useState<TeamDetailsInfo | null>(null);
  const [teamStats, setTeamStats] = useState<TeamStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        router.push("/home");
        return true;
      }
    );

    loadTeamDetails();
    checkIfFavorite();

    return () => backHandler.remove();
  }, [id]);

  const loadTeamDetails = async () => {
    try {
      const [details, allStandings] = await Promise.all([
        fetchTeamDetails(Number(id)),
        fetchStandings(78, 2023),
      ]);

      // Finde das Team in der Tabelle
      const stats = allStandings.find(
        (team: TeamStatistics) => team.team.id === Number(id)
      );

      setTeamDetails(details);
      setTeamStats(stats);
      setLoading(false);
    } catch (error) {
      console.error("Fehler beim Laden der Team-Details:", error);
      setLoading(false);
    }
  };

  const checkIfFavorite = async () => {
    try {
      const favorites = await AsyncStorage.getItem("favorites");
      const favoriteTeams = favorites ? JSON.parse(favorites) : [];
      setIsFavorite(favoriteTeams.includes(Number(id)));
    } catch (error) {
      console.error("Fehler beim Prüfen der Favoriten:", error);
    }
  };

  const toggleFavorite = async () => {
    try {
      const favorites = await AsyncStorage.getItem("favorites");
      let favoriteTeams = favorites ? JSON.parse(favorites) : [];

      if (isFavorite) {
        favoriteTeams = favoriteTeams.filter(
          (teamId: number) => teamId !== Number(id)
        );
      } else {
        favoriteTeams.push(Number(id));
      }

      await AsyncStorage.setItem("favorites", JSON.stringify(favoriteTeams));
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error("Fehler beim Speichern der Favoriten:", error);
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    );
  }

  if (!teamDetails) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Team nicht gefunden</Text>
        <Button
          mode="contained"
          onPress={() => router.push("/home")}
          style={styles.button}
        >
          Zurück
        </Button>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image source={{ uri: teamDetails.team.logo }} style={styles.logo} />
        <Text style={styles.teamName}>{teamDetails.team.name}</Text>
        <Button
          mode="contained"
          onPress={toggleFavorite}
          style={[
            styles.favoriteButton,
            isFavorite && styles.favoriteButtonActive,
          ]}
        >
          {isFavorite ? "Aus Favoriten entfernen" : "Zu Favoriten hinzufügen"}
        </Button>
      </View>

      {teamStats && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Aktuelle Saison</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{teamStats.rank}</Text>
              <Text style={styles.statLabel}>Rang</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{teamStats.points}</Text>
              <Text style={styles.statLabel}>Punkte</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{teamStats.all.played}</Text>
              <Text style={styles.statLabel}>Spiele</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{teamStats.all.win}</Text>
              <Text style={styles.statLabel}>Siege</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{teamStats.all.draw}</Text>
              <Text style={styles.statLabel}>Unentschieden</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{teamStats.all.lose}</Text>
              <Text style={styles.statLabel}>Niederlagen</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{teamStats.goalsDiff}</Text>
              <Text style={styles.statLabel}>Tordifferenz</Text>
            </View>
            {teamStats.all.goals && (
              <>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>
                    {teamStats.all.goals.for}
                  </Text>
                  <Text style={styles.statLabel}>Tore</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>
                    {teamStats.all.goals.against}
                  </Text>
                  <Text style={styles.statLabel}>Gegentore</Text>
                </View>
              </>
            )}
          </View>
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Team Informationen</Text>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Land:</Text>
          <Text style={styles.value}>{teamDetails.team.country}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Gegründet:</Text>
          <Text style={styles.value}>{teamDetails.team.founded}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Code:</Text>
          <Text style={styles.value}>{teamDetails.team.code}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Stadion</Text>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Name:</Text>
          <Text style={styles.value}>{teamDetails.venue.name}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Stadt:</Text>
          <Text style={styles.value}>{teamDetails.venue.city}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Adresse:</Text>
          <Text style={styles.value}>{teamDetails.venue.address}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Kapazität:</Text>
          <Text style={styles.value}>
            {teamDetails.venue.capacity.toLocaleString()}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Spieloberfläche:</Text>
          <Text style={styles.value}>{teamDetails.venue.surface}</Text>
        </View>
      </View>

      {teamDetails.venue.image && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Stadion Bild</Text>
          <Image
            source={{ uri: teamDetails.venue.image }}
            style={styles.stadiumImage}
          />
        </View>
      )}
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
    alignItems: "center",
    padding: 20,
    backgroundColor: "#2a2a2a",
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 16,
  },
  teamName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 16,
  },
  favoriteButton: {
    backgroundColor: "#666666",
  },
  favoriteButtonActive: {
    backgroundColor: "#ffd700",
  },
  section: {
    padding: 16,
    marginTop: 8,
    backgroundColor: "#2a2a2a",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: "row",
    marginBottom: 8,
  },
  label: {
    width: 100,
    color: "#cccccc",
  },
  value: {
    flex: 1,
    color: "#ffffff",
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  statItem: {
    width: "30%",
    alignItems: "center",
    marginBottom: 16,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
  },
  statLabel: {
    color: "#cccccc",
    marginTop: 4,
  },
  errorText: {
    color: "#ff4444",
    marginBottom: 16,
  },
  button: {
    backgroundColor: "#666666",
  },
  stadiumImage: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginTop: 8,
  },
});
