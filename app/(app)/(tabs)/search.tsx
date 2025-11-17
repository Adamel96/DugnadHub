import {
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import { useState } from "react";

export default function Search() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"dugnader" | "personer">("dugnader");

  const dugnader = [
    {
      id: 1,
      title: "Strandrydding",
      date: "25. Nov 2025",
      participants: 12,
      image: "https://via.placeholder.com/80",
    },
    {
      id: 2,
      title: "Skogplanting",
      date: "28. Nov 2025",
      participants: 8,
      image: "https://via.placeholder.com/80",
    },
    {
      id: 3,
      title: "Måking for eldre",
      date: "30. Nov 2025",
      participants: 5,
      image: "https://via.placeholder.com/80",
    },
  ];

  const personer = [
    {
      id: 1,
      name: "Emma Hansen",
      username: "@emmah",
      avatar: "https://via.placeholder.com/60",
      dugnader: 24,
    },
    {
      id: 2,
      name: "Ola Nordmann",
      username: "@olanord",
      avatar: "https://via.placeholder.com/60",
      dugnader: 18,
    },
    {
      id: 3,
      name: "Kari Olsen",
      username: "@kariol",
      avatar: "https://via.placeholder.com/60",
      dugnader: 31,
    },
  ];

  const filteredDugnader = dugnader.filter((dugnad) =>
    dugnad.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredPersoner = personer.filter(
    (person) =>
      person.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      person.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Søk</Text>
      </View>

      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Søk etter dugnader eller personer..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#95A5A6"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery("")}>
            <Text style={styles.clearIcon}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "dugnader" && styles.activeTab]}
          onPress={() => setActiveTab("dugnader")}
        >
          <Text style={[styles.tabText, activeTab === "dugnader" && styles.activeTabText]}>
            Dugnader
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "personer" && styles.activeTab]}
          onPress={() => setActiveTab("personer")}
        >
          <Text style={[styles.tabText, activeTab === "personer" && styles.activeTabText]}>
            Personer
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.resultsContainer}>
        {activeTab === "dugnader" ? (
          <>
            {filteredDugnader.length > 0 ? (
              filteredDugnader.map((dugnad) => (
                <TouchableOpacity key={dugnad.id} style={styles.dugnadCard}>
                  <Image source={{ uri: dugnad.image }} style={styles.dugnadImage} />
                  <View style={styles.dugnadInfo}>
                    <Text style={styles.dugnadTitle}>{dugnad.title}</Text>
                    <View style={styles.dugnadMeta}>
                      <Text style={styles.dugnadDate}>📅 {dugnad.date}</Text>
                      <Text style={styles.dugnadParticipants}>
                        👥 {dugnad.participants} påmeldte
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyIcon}>🔍</Text>
                <Text style={styles.emptyText}>
                  {searchQuery ? "Ingen dugnader funnet" : "Søk etter dugnader"}
                </Text>
              </View>
            )}
          </>
        ) : (
          <>
            {filteredPersoner.length > 0 ? (
              filteredPersoner.map((person) => (
                <TouchableOpacity key={person.id} style={styles.personCard}>
                  <Image source={{ uri: person.avatar }} style={styles.personAvatar} />
                  <View style={styles.personInfo}>
                    <Text style={styles.personName}>{person.name}</Text>
                    <Text style={styles.personUsername}>{person.username}</Text>
                    <Text style={styles.personDugnader}>{person.dugnader} dugnader</Text>
                  </View>
                  <TouchableOpacity style={styles.followButton}>
                    <Text style={styles.followButtonText}>Følg</Text>
                  </TouchableOpacity>
                </TouchableOpacity>
              ))
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyIcon}>👥</Text>
                <Text style={styles.emptyText}>
                  {searchQuery ? "Ingen personer funnet" : "Søk etter personer"}
                </Text>
              </View>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  header: {
    backgroundColor: "#fff",
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#2C3E50",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginTop: -15,
    marginBottom: 20,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  searchIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#2C3E50",
  },
  clearIcon: {
    fontSize: 20,
    color: "#95A5A6",
    paddingLeft: 10,
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 15,
    padding: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 12,
  },
  activeTab: {
    backgroundColor: "#4A90E2",
  },
  tabText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#7F8C8D",
  },
  activeTabText: {
    color: "#fff",
  },
  resultsContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  dugnadCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  dugnadImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    marginRight: 15,
  },
  dugnadInfo: {
    flex: 1,
    justifyContent: "space-between",
  },
  dugnadTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2C3E50",
    marginBottom: 5,
  },
  dugnadMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dugnadDate: {
    fontSize: 13,
    color: "#95A5A6",
  },
  dugnadParticipants: {
    fontSize: 13,
    color: "#4A90E2",
    fontWeight: "600",
  },
  personCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  personAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
    borderWidth: 2,
    borderColor: "#4A90E2",
  },
  personInfo: {
    flex: 1,
  },
  personName: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#2C3E50",
    marginBottom: 3,
  },
  personUsername: {
    fontSize: 14,
    color: "#7F8C8D",
    marginBottom: 3,
  },
  personDugnader: {
    fontSize: 13,
    color: "#4A90E2",
  },
  followButton: {
    backgroundColor: "#4A90E2",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  followButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 60,
    marginBottom: 15,
  },
  emptyText: {
    fontSize: 16,
    color: "#95A5A6",
  },
});