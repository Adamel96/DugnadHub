import { Stack } from "expo-router";

export default function DugnadsLayout() {
  return (
   // oppretter et Stack-layout for dugnad-sidene
    <Stack
      screenOptions={{
        headerShown: true,
        title: "DugnadHub",
      }}
    />
  );
}
