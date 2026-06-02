import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../../src/contexts/AuthContext";

export default function HomeScreen() {
  const { profile, user, signOut, loading } = useAuth();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0a1628" />
      <View style={styles.content}>
        <View style={styles.card}>
          <View style={styles.logoBadge}>
            <Text style={styles.logoCAF}>CAF</Text>
            <Text style={styles.logoClub}>CLUB</Text>
          </View>

          <Text style={styles.title}>✅ Login funcionando!</Text>

          <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>Nome</Text>
            <Text style={styles.infoValue}>{profile?.nome ?? "---"}</Text>
          </View>

          <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>Email</Text>
            <Text style={styles.infoValue}>{user?.email ?? "---"}</Text>
          </View>

          <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>Nº do Sócio</Text>
            <Text style={styles.infoValue}>
              {profile?.numero_socio ?? "---"}
            </Text>
          </View>

          <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>Situação</Text>
            <Text style={[styles.infoValue, { color: "#4caf50" }]}>
              {profile?.situacao ?? "---"}
            </Text>
          </View>

          <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>Categoria</Text>
            <Text style={styles.infoValue}>{profile?.categoria ?? "---"}</Text>
          </View>

          <TouchableOpacity
            style={[styles.btn, loading && styles.btnDisabled]}
            onPress={signOut}
            disabled={loading}
          >
            <Text style={styles.btnText}>
              {loading ? "Saindo..." : "Sair da conta"}
            </Text>
          </TouchableOpacity>

          <Text style={styles.note}>
            Esta tela será substituída pela Home completa em breve 🚀
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a1628",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  card: {
    backgroundColor: "#0f2040",
    borderRadius: 20,
    padding: 28,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#1a3050",
    width: "100%",
    gap: 12,
  },
  logoBadge: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#1a3050",
    borderWidth: 2,
    borderColor: "#c9a84c",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  logoCAF: {
    fontSize: 22,
    fontWeight: "900",
    color: "#c9a84c",
    letterSpacing: 2,
  },
  logoClub: {
    fontSize: 8,
    color: "#ffffff",
    letterSpacing: 3,
    marginTop: -2,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#ffffff",
    textAlign: "center",
    marginBottom: 4,
  },
  infoBox: {
    width: "100%",
    backgroundColor: "#1a3050",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  infoLabel: {
    fontSize: 12,
    color: "#556677",
    fontWeight: "500",
  },
  infoValue: {
    fontSize: 13,
    color: "#ffffff",
    fontWeight: "600",
  },
  btn: {
    backgroundColor: "#c9a84c",
    borderRadius: 10,
    paddingVertical: 13,
    paddingHorizontal: 32,
    marginTop: 8,
    width: "100%",
    alignItems: "center",
  },
  btnDisabled: {
    opacity: 0.6,
  },
  btnText: {
    color: "#0a1628",
    fontWeight: "700",
    fontSize: 15,
  },
  note: {
    fontSize: 11,
    color: "#556677",
    textAlign: "center",
    marginTop: 4,
  },
});
