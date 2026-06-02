import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import "react-native-url-polyfill/auto";
import { AuthProvider, useAuth } from "./src/contexts/AuthContext";
import LoginScreen from "./src/screens/LoginScreen";

function HomePlaceholder() {
  const { signOut, profile, user } = useAuth();

  return (
    <View style={styles.placeholder}>
      <View style={styles.placeholderCard}>
        <Text style={styles.placeholderTitle}>✅ Login funcionando!</Text>
        <Text style={styles.placeholderSub}>
          Bem-vindo, {profile?.nome ?? user?.email}
        </Text>
        <Text style={styles.placeholderInfo}>
          Nº Sócio: {profile?.numero_socio ?? "---"}
        </Text>
        <Text style={styles.placeholderInfo}>
          Situação: {profile?.situacao ?? "---"}
        </Text>

        <TouchableOpacity style={styles.placeholderBtn} onPress={signOut}>
          <Text style={styles.placeholderBtnText}>Sair (teste)</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function LoadingScreen() {
  return (
    <View style={styles.loading}>
      <ActivityIndicator size="large" color="#c9a84c" />
    </View>
  );
}

function RootNavigator() {
  const { session, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!session) {
    return <LoginScreen />;
  }

  return <HomePlaceholder />;
}

export default function App() {
  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    backgroundColor: "#0a1628",
    justifyContent: "center",
    alignItems: "center",
  },
  placeholder: {
    flex: 1,
    backgroundColor: "#0a1628",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  placeholderCard: {
    backgroundColor: "#0f2040",
    borderRadius: 16,
    padding: 32,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#1a3050",
    width: "100%",
    gap: 8,
  },
  placeholderTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#ffffff",
    marginBottom: 8,
    textAlign: "center",
  },
  placeholderSub: {
    fontSize: 16,
    color: "#c9a84c",
    fontWeight: "600",
    textAlign: "center",
  },
  placeholderInfo: {
    fontSize: 14,
    color: "#aabbcc",
    textAlign: "center",
  },
  placeholderBtn: {
    backgroundColor: "#c9a84c",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginTop: 16,
  },
  placeholderBtnText: {
    color: "#0a1628",
    fontWeight: "700",
    fontSize: 14,
  },
});
