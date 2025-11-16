import { EvilIcons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useState } from "react";
import {
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import SelectImageModal from "./SelectImageModal";

export default function PostForm({ onSave }: { onSave: (data: any) => void }) {
  const [image, setImage] = useState<string | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [task, setTask] = useState("");
  const [volunteerLimit, setVolunteerLimit] = useState("");
  const [showPicker, setShowPicker] = useState(false);
  const [date, setDate] = useState(new Date());

  const onChange = (event: any, selectedDate?: Date) => {
    setShowPicker(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  return (
    <View style={styles.container}>
      {/* Modal for å velge bilde */}
      <Modal visible={isCameraOpen} animationType="slide">
        <SelectImageModal
          closeModal={() => setIsCameraOpen(false)}
          setImage={setImage}
        />
      </Modal>

      {/* BILDE */}
      <Pressable
        accessible={true}
        accessibilityLabel="Legg til bilde"
        onPress={() => setIsCameraOpen(true)}
        style={styles.addImageBox}
      >
        {image ? (
          <Image
            source={{ uri: image }}
            style={{ resizeMode: "cover", width: "100%", height: 300 }}
          />
        ) : (
          <EvilIcons name="image" size={80} color="gray" />
        )}
      </Pressable>

      {/* INPUT FELT */}
      <TextInput
        style={styles.input}
        placeholder="Tittel"
        value={title}
        onChangeText={setTitle}
      />

      <TextInput
        style={[styles.input, { height: 84 }]}
        placeholder="Beskrivelse"
        value={description}
        onChangeText={setDescription}
        multiline
      />

      <TextInput
        style={styles.input}
        placeholder="Oppgave"
        value={task}
        onChangeText={setTask}
      />

      <TextInput
        style={styles.input}
        placeholder="Antall frivillige"
        value={volunteerLimit}
        onChangeText={setVolunteerLimit}
      />

      {/* DATO */}
      <Pressable style={styles.dateButton} onPress={() => setShowPicker(true)}>
        <EvilIcons name="calendar" size={28} color="gray" />
        <Text style={{ marginLeft: 8 }}>{date.toLocaleString()}</Text>
      </Pressable>

      {showPicker && (
        <DateTimePicker
          value={date}
          mode="datetime"
          display="default"
          onChange={onChange}
        />
      )}

      {/* LAGRE KNAPP */}
      <Pressable
        style={styles.saveButton}
        onPress={() =>
          onSave({
            title,
            description,
            task,
            volunteerLimit,
            date: date.toISOString(),
            image,
          })
        }
      >
        <Text style={styles.saveButtonText}>Lagre</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  addImageBox: {
    borderRadius: 10,
    overflow: "hidden",
    width: "100%",
    height: 300,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "gray",
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: "gray",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  dateButton: {
    borderWidth: 1,
    borderColor: "gray",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  saveButton: {
    backgroundColor: "#4A90E2",
    padding: 14,
    borderRadius: 10,
    marginTop: 10,
    alignItems: "center",
  },
  saveButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});
