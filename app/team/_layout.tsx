import { Stack } from "expo-router";

export default function TeamLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: "#1a1a1a",
        },
        headerTintColor: "#ffffff",
        headerBackTitle: "Zurück",
      }}
    >
      <Stack.Screen
        name="[id]"
        options={{
          headerTitle: "Team Details",
        }}
      />
    </Stack>
  );
} 