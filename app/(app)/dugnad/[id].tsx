import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  ActivityIndicator,
  View,
} from "react-native";

export default function DugnadsDetaljer() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [dugnad, setDugnad] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // 🔥 Hent dugnad fra Firestore basert på ID
  useEffect(() => {
    const fetchDugnad = async () => {
      try {
        const ref = doc(db, "dugnader", id as string);
        const snapshot = await getDoc(ref);

        if (snapshot.exists()) {
          setDugnad(snapshot.data());
        }
      } catch (err) {
        console.log("Feil ved henting av dugnad:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDugnad();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#4A90E2" />
      </View>
    );
  }

  if (!dugnad) {
    return (
      <View style={styles.loaderContainer}>
        <Text>Kunne ikke finne dugnaden.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* TILBAKEKNAPP */}
      <Pressable style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backText}>{"< Tilbake"}</Text>
      </Pressable>

      {/* BILDE */}
      {dugnad.image && (
        <Image source={{ uri: dugnad.image }} style={styles.image} />
      )}

      {/* TEKSTINFO */}
      <Text style={styles.title}>{dugnad.title}</Text>

      <Text style={styles.sectionLabel}>Beskrivelse</Text>
      <Text style={styles.text}>{dugnad.description}</Text>

      <Text style={styles.sectionLabel}>Oppgave</Text>
      <Text style={styles.text}>{dugnad.task}</Text>

      <Text style={styles.sectionLabel}>Antall frivillige</Text>
      <Text style={styles.text}>{dugnad.volunteerLimit}</Text>

      <Text style={styles.sectionLabel}>Dato og tid</Text>
      <Text style={styles.text}>
        {new Date(dugnad.date).toLocaleString()}
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 100,
  },
  container: {
    padding: 20,
    paddingTop: 10,
  },
  backButton: {
    marginBottom: 20,
  },
  backText: {
    fontSize: 18,
    color: "#007AFF",
    fontWeight: "500",
  },
  image: {
    width: "100%",
    height: 250,
    borderRadius: 12,
    marginBottom: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 2,
  },
  sectionLabel: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 14,
    marginBottom: 4,
  },
  text: {
    fontSize: 16,
    lineHeight: 22,
    color: "#333",
  },
});
