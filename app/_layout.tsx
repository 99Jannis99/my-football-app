import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function RootLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: "#1a1a1a",
          borderTopColor: "#333333",
        },
        tabBarActiveTintColor: "#ffffff",
        tabBarInactiveTintColor: "#666666",
        headerStyle: {
          backgroundColor: "#1a1a1a",
        },
        headerTintColor: "#ffffff",
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="standings"
        options={{
          title: "Bundesliga Tabelle",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="trophy" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: "Favoriten",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="star" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="team"
        options={{
          href: null, // Versteckt den Tab
          headerShown: false, // Versteckt den Header
        }}
      />
    </Tabs>
  );
}
