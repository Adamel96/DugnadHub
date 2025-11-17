import { useLocalSearchParams, useRouter } from "expo-router";
import { Image, Pressable, ScrollView, StyleSheet, Text } from "react-native";

export default function DugnadsDetaljer() {
  const { data } = useLocalSearchParams();
  const router = useRouter();

  const dugnad = JSON.parse(data as string);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* TILBAKEKNAPP */}
      <Pressable style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backText}>{"< Tilbake"}</Text>
      </Pressable>

      {/* BILDE */}
      {dugnad.image ? (
        <Image source={{ uri: dugnad.image }} style={styles.image} />
      ) : null}

      {/* TEKSTINFO */}
      <Text style={styles.title}>{dugnad.title}</Text>

      <Text style={styles.sectionLabel}>Beskrivelse</Text>
      <Text style={styles.text}>{dugnad.description}</Text>

      <Text style={styles.sectionLabel}>Oppgave</Text>
      <Text style={styles.text}>{dugnad.task}</Text>

      <Text style={styles.sectionLabel}>Antall frivillige</Text>
      <Text style={styles.text}>{dugnad.volunteerLimit}</Text>

      <Text style={styles.sectionLabel}>Dato og tid</Text>
      <Text style={styles.text}>{new Date(dugnad.date).toLocaleString()}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
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
