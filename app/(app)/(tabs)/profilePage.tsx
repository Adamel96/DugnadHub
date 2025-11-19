import { auth, db } from "@/firebase";
import { useRouter } from "expo-router";
import { signOut } from "firebase/auth";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// profilside 
export default function ProfilePage() {
  const router = useRouter();
  const [username, setUsername] = useState("Laster...");
  const [email, setEmail] = useState("Laster...");
  const [myDugnadCount, setMyDugnadCount] = useState(0);
  const [favoriteCount, setFavoriteCount] = useState(0);
  const [participatedCount, setParticipatedCount] = useState(0);

  // hent brukerdata ved lasting av siden
  useEffect(() => {
    const loadUserData = async () => {
      const user = auth.currentUser;
      if (!user) return;

      setEmail(user.email ?? "Ukjent e-post");

      // hent brukernavn fra Firestore
      const ref = doc(db, "users", user.uid);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        setUsername(snap.data().username);
      } else {
        setUsername("Ukjent bruker");
      }
    };

    loadUserData();
  }, []);

  useEffect(() => {
    if (!auth.currentUser) return;

    // Tell hvor mange dugnader brukeren har opprettet
    const q = query(
      collection(db, "dugnader"),
      where("createdByUID", "==", auth.currentUser.uid)
    );


    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMyDugnadCount(snapshot.size);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!auth.currentUser) return;

    // 
    const favRef = doc(db, "favorites", auth.currentUser.uid);
    const unsubscribe = onSnapshot(favRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        setFavoriteCount(data.dugnadIds?.length || 0);
      } else {
        setFavoriteCount(0);
      }
    });

    return unsubscribe;
  }, []);

  // Tell hvor mange dugnader brukeren deltar i
  useEffect(() => {
    if (!auth.currentUser) return;

    const q = query(
      collection(db, "dugnader"),
      where("participants", "array-contains", auth.currentUser.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setParticipatedCount(snapshot.size);
    });

    return unsubscribe;
  }, []);

  // håndterer utlogging
  const handleLogout = async () => {
    await signOut(auth);
    router.replace("/auth/login");
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Image
            source={{ uri: "https://via.placeholder.com/120" }}
            style={styles.avatar}
          />
        </View>
        <Text style={styles.name}>{username}</Text>
        <Text style={styles.email}>{email}</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{myDugnadCount}</Text>
          <Text style={styles.statLabel}>Opprettet</Text>
        </View>

        <View style={styles.statDivider} />

        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{participatedCount}</Text>
          <Text style={styles.statLabel}>Deltatt</Text>
        </View>

        <View style={styles.statDivider} />

        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{favoriteCount}</Text>
          <Text style={styles.statLabel}>Favoritter</Text>
        </View>
      </View>

      <View style={styles.menuContainer}>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuIcon}>👤</Text>
          <Text style={styles.menuText}>Rediger Profil</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => router.push("/(app)/mine_dugnader")}
        >
          <Text style={styles.menuIcon}>📋</Text>
          <Text style={styles.menuText}>Mine Dugnader</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => router.push("/(app)/deltatte_dugnader")}
        >
          <Text style={styles.menuIcon}>✅</Text>
          <Text style={styles.menuText}>Deltatte Dugnader</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => router.push("../../favoritter")}
        >
          <Text style={styles.menuIcon}>⭐</Text>
          <Text style={styles.menuText}>Favoritter</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuIcon}>⚙️</Text>
          <Text style={styles.menuText}>Innstillinger</Text>
          <Text style={styles.menuArrow}>›</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logg ut</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  header: {
    backgroundColor: "#fff",
    alignItems: "center",
    paddingTop: 60,
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  avatarContainer: {
    marginBottom: 15,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: "#4A90E2",
  },
  name: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#2C3E50",
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    color: "#7F8C8D",
  },
  statsContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginTop: -20,
    borderRadius: 15,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statBox: {
    flex: 1,
    alignItems: "center",
  },
  statNumber: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#4A90E2",
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    color: "#7F8C8D",
  },
  statDivider: {
    width: 1,
    backgroundColor: "#E0E0E0",
    marginHorizontal: 10,
  },
  menuContainer: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginTop: 25,
    borderRadius: 15,
    padding: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 18,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  menuIcon: {
    fontSize: 24,
    marginRight: 15,
  },
  menuText: {
    flex: 1,
    fontSize: 17,
    color: "#2C3E50",
    fontWeight: "500",
  },
  menuArrow: {
    fontSize: 28,
    color: "#BDC3C7",
  },
  logoutButton: {
    backgroundColor: "#E74C3C",
    marginHorizontal: 20,
    marginTop: 25,
    marginBottom: 40,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#E74C3C",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  logoutText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "600",
  },
});