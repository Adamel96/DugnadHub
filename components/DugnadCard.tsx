import { TouchableOpacity, View, Text, Image, StyleSheet } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useRouter } from "expo-router";

export default function DugnadCard({ dugnad }: any) {
  const router = useRouter();

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.7}
      onPress={() =>
        router.push({
          pathname: "/dugnad/[id]",
          params: { id: dugnad.id },
        })
      }
    >
      {dugnad.image && (
        <Image
          source={{ uri: dugnad.image }}
          style={styles.cardImage}
          resizeMode="cover"
        />
      )}

      <View style={styles.cardHeader}>
        <View style={styles.cardHeaderText}>
          <Text style={styles.title}>{dugnad.title}</Text>

          <View style={styles.metaInfo}>
            <Text style={styles.metaText}>
              📅{" "}
              {new Date(dugnad.date).toLocaleDateString("nb-NO", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </Text>
            <Text style={styles.metaDot}>•</Text>
            <Text style={styles.metaText}>
              ⏰{" "}
              {new Date(dugnad.date).toLocaleTimeString("nb-NO", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
          </View>
        </View>

        <AntDesign name="right" size={20} color="#BDC3C7" />
      </View>

      <View style={styles.cardContent}>
        <Text style={styles.description} numberOfLines={2}>
          {dugnad.description}
        </Text>

        <View style={styles.detailsContainer}>
          <View style={styles.detailItem}>
            <Text style={styles.detailIcon}>📋</Text>
            <Text style={styles.detailText} numberOfLines={1}>
              {dugnad.task}
            </Text>
          </View>

          <View style={styles.detailItem}>
            <Text style={styles.detailIcon}>👥</Text>
            <Text style={styles.detailText}>
              {dugnad.volunteerLimit} frivillige
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.statusBadge}>
        <Text style={styles.statusText}>Åpen for påmelding</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    overflow: "hidden",
  },
  cardImage: {
    width: "100%",
    height: 200,
    backgroundColor: "#E3F2FD",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  cardHeaderText: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2C3E50",
    marginBottom: 4,
  },
  metaInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  metaText: {
    fontSize: 13,
    color: "#7F8C8D",
  },
  metaDot: {
    marginHorizontal: 8,
    color: "#BDC3C7",
  },
  cardContent: {
    padding: 16,
  },
  description: {
    fontSize: 15,
    color: "#34495E",
    lineHeight: 22,
    marginBottom: 12,
  },
  detailsContainer: {
    flexDirection: "row",
    gap: 16,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    backgroundColor: "#F8F9FA",
    padding: 10,
    borderRadius: 10,
  },
  detailIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  detailText: {
    fontSize: 14,
    color: "#2C3E50",
    fontWeight: "500",
    flex: 1,
  },
  statusBadge: {
    backgroundColor: "#2ECC71",
    paddingVertical: 10,
    alignItems: "center",
  },
  statusText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
  },
});
