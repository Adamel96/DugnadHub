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

export default function PostForm() {
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
      {/* modal for å velge eller ta bilde */}
      <Modal visible={isCameraOpen} animationType="slide">
        <SelectImageModal
          closeModal={() => {
            setIsCameraOpen(false);
          }}
          setImage={setImage}
        />
      </Modal>
      <Pressable
        accessible={true}
        accessibilityLabel="Add image to post"
        accessibilityHint="Pick an image from the library or take a new picture"
        onPress={() => setIsCameraOpen(true)} // åpner kamera eller galleri
        style={styles.addImageBox}
      >
        {image ? (
          // viser valgt bilde
          <Image
            source={{ uri: image }}
            style={{ resizeMode: "cover", width: "100%", height: 300 }}
            alt=""
          />
        ) : (
          // ikon for å indikere at et bilde kan legges til
          <EvilIcons name="image" size={80} color="gray" />
        )}
      </Pressable>

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
        numberOfLines={3}
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
});
