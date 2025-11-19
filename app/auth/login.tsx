import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";

import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import { auth } from "@/firebase";

import {
  GoogleSignin,
  isSuccessResponse,
} from "@react-native-google-signin/google-signin";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // google login funksjon

  const signInWithGoogle = async () => {
    try {
      // sjekk at google play services finnes
      await GoogleSignin.hasPlayServices();

      // start google login
      const response = await GoogleSignin.signIn();

      if (isSuccessResponse(response)) {
        // hent idToken fra google
        const { idToken } = await GoogleSignin.getTokens();

        const googleCredential = GoogleAuthProvider.credential(idToken);

        // logg inn i Firebase
        await signInWithCredential(auth, googleCredential);

        console.log("Google login OK");

        router.replace("/");
      }
    } catch (error) {
      console.log("Error signing in with google:", error);
      setError("Google-innlogging feilet");
    }
  };


  //  email + passord login funksjon

  const handleLogin = async () => {
    try {
      setError("");

      const cred = await signInWithEmailAndPassword(auth, email, password);
      console.log("Innlogging OK:", cred.user.uid);

      router.replace("/");
    } catch (err: any) {
      console.log("Login error:", err?.code || err);
      setError("Feil e-post eller passord");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.container}
    >
      {/* Logo / Tittel */}
      <Text style={styles.title}>DugnadHub</Text>

      {/* Input-felter */}
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="E-post"
          placeholderTextColor="#999"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
        />

        <TextInput
          placeholder="Passord"
          placeholderTextColor="#999"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          style={styles.input}
        />

        {error ? <Text style={styles.errorText}>{error}</Text> : null}
      </View>

      {/* Email/passord login */}
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginText}>Logg inn</Text>
      </TouchableOpacity>

      {/* GOOGLE LOGIN KNAPP */}
      <TouchableOpacity style={[styles.loginButton, { backgroundColor: "#DB4437" }]} onPress={signInWithGoogle}>
        <Text style={styles.loginText}>Logg inn med Google</Text>
      </TouchableOpacity>

      {/* Registrer deg */}
      <TouchableOpacity onPress={() => router.push("/auth/register")}>
        <Text style={styles.registerText}>
          Har du ikke konto? Registrer deg
        </Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 42,
    fontWeight: "bold",
    color: "#4A90E2",
    marginBottom: 50,
    letterSpacing: 1.5,
  },
  inputContainer: {
    width: "100%",
    marginBottom: 20,
  },
  input: {
    backgroundColor: "white",
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
    color: "#4A90E2",
    borderWidth: 1,
    borderColor: "#333",
  },
  loginButton: {
    backgroundColor: "#4A90E2",
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginBottom: 20,
    width: "100%",
    alignItems: "center",
  },
  loginText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  registerText: {
    color: "#4A90E2",
    fontSize: 16,
    marginTop: 5,
  },
  errorText: {
    color: "#FF5252",
    marginBottom: 10,
    fontSize: 14,
  },
});
