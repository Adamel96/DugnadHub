import { Tabs } from "expo-router";
import React from "react";
import { Text } from "react-native";
import { useColorScheme } from "@/hooks/use-color-scheme";
import AntDesign from "@expo/vector-icons/AntDesign";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function TabLayout() {
  const colorScheme = useColorScheme(); // sjekker om bruker har lys/mørk modus

  // nederste navigasjonsmeny aka "tab bar"
  return (
    <Tabs>
      {/* Hjem-skjermen */}
      <Tabs.Screen
        name="index"
        options={{
          title: "Hjem",
          tabBarIcon: ({ color, focused }) => (
            <AntDesign name="home" size={24} color={color} />
          ),
          // Overskrift øverst i skjermen
          headerTitle(props) {
            return (
              <Text
                accessible={true}
                accessibilityRole="tab"
                accessibilityLabel="Home page"
                style={{
                  fontSize: 20,
                  fontWeight: "bold",
                  color: "black",
                }}
              >
                DugnadHub
              </Text>
            );
          },
        }}
      />

      {/* Søk-skjermen */}
      <Tabs.Screen
        name="search"
        options={{
          title: "Søk",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name="search" size={24} color={color} />
          ),
          // Overskrift øverst
          headerTitle(props) {
            return (
              <Text
                accessible={true}
                accessibilityRole="tab"
                accessibilityLabel="Search page"
                style={{
                  fontSize: 20,
                  fontWeight: "bold",
                  color: "black",
                }}
              >
                Søk
              </Text>
            );
          },
        }}
      />

      {/* Profil-skjermen */}
      <Tabs.Screen
        name="profilePage"
        options={{
          title: "Profil",
          tabBarIcon: ({ color, focused }) => (
            <AntDesign name="user" size={24} color={color} />
          ),
          // Overskrift øverst
          headerTitle(props) {
            return (
              <Text
                accessible={true}
                accessibilityRole="tab"
                accessibilityLabel="Profile page"
                style={{
                  fontSize: 20,
                  fontWeight: "bold",
                  color: "black",
                }}
              >
                Din profil
              </Text>
            );
          },
        }}
      />
    </Tabs>
  );
}
