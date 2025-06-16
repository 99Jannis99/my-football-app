import { Stack, useRouter } from "expo-router";

export default function TeamLayout() {
  const router = useRouter();
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: "#1a1a1a",
        },
        headerTintColor: "#ffffff",
      }}
    >
      <Stack.Screen
        name="[id]"
        options={{
          headerTitle: "Team Details",
          headerLeft: () => null,
          headerBackVisible: false,
        }}
      />
    </Stack>
  );
}
