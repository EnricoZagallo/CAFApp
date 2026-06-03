import { useRouter } from "expo-router";
import {
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../../src/contexts/AuthContext";

const CORES = {
  darkBlue: "#0a1628",
  mediumBlue: "#0f2040",
  lightBlue: "#1a3050",
  accent: "#c9a84c",
  white: "#ffffff",
  gray: "#aabbcc",
  darkGray: "#556677",
  success: "#4caf50",
  danger: "#ff4444",
};

export default function HomeScreen() {
  const { profile, user, signOut, loading } = useAuth();
  const router = useRouter();

  const primeiroNome =
    profile?.nome?.split(" ")[0] ?? user?.email?.split("@")[0] ?? "Sócio";

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={CORES.darkBlue} />

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* ── HEADER ── */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerSaudacao}>Olá,</Text>
            <Text style={styles.headerNome}>{primeiroNome} 👋</Text>
          </View>
          <View style={styles.avatarContainer}>
            <Image
              source={require("../../assets/images/logo.png")}
              style={styles.avatar}
              resizeMode="contain"
            />
          </View>
        </View>

        {/* ── CARTÃO DO SÓCIO ── */}
        <View style={styles.cartaoSocio}>
          <View style={styles.cartaoSocioHeader}>
            <Image
              source={require("../../assets/images/logo.png")}
              style={styles.cartaoLogo}
              resizeMode="contain"
            />
            <View>
              <Text style={styles.cartaoClube}>Clube Antigos do Farol</Text>
              <Text style={styles.cartaoTipo}>Cartão de Associado</Text>
            </View>
          </View>

          <View style={styles.cartaoInfos}>
            <View style={styles.cartaoInfoItem}>
              <Text style={styles.cartaoInfoLabel}>Sócio</Text>
              <Text style={styles.cartaoInfoValor}>
                {profile?.nome ?? "---"}
              </Text>
            </View>
            <View style={styles.cartaoDivisor} />
            <View style={styles.cartaoInfoItem}>
              <Text style={styles.cartaoInfoLabel}>Nº</Text>
              <Text style={styles.cartaoNumero}>
                {profile?.numero_socio ?? "---"}
              </Text>
            </View>
          </View>

          <View style={styles.cartaoRodape}>
            <View style={styles.cartaoSituacao}>
              <View
                style={[
                  styles.cartaoSituacaoDot,
                  {
                    backgroundColor:
                      profile?.situacao === "Ativo"
                        ? CORES.success
                        : CORES.danger,
                  },
                ]}
              />
              <Text style={styles.cartaoSituacaoTexto}>
                {profile?.situacao ?? "---"}
              </Text>
            </View>
            <Text style={styles.cartaoCategoria}>
              {profile?.categoria ?? "---"}
            </Text>
          </View>
        </View>

        {/* ── BOTÕES PRINCIPAIS ── */}
        <View style={styles.botoesRow}>
          <TouchableOpacity
            style={styles.botaoPrincipal}
            onPress={() => router.push("/(tabs)/carteira")}
          >
            <Text style={styles.botaoPrincipalIcone}>💳</Text>
            <Text style={styles.botaoPrincipalTexto}>
              Carteira{"\n"}de Sócio
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.botaoPrincipal} onPress={() => {}}>
            <Text style={styles.botaoPrincipalIcone}>🤝</Text>
            <Text style={styles.botaoPrincipalTexto}>Convênios</Text>
          </TouchableOpacity>
        </View>

        {/* ── PRÓXIMOS EVENTOS ── */}
        <TouchableOpacity
          style={styles.botaoEventos}
          onPress={() => router.push("/(tabs)/eventos")}
        >
          <View>
            <Text style={styles.botaoEventosTitulo}>📅 Próximos Eventos</Text>
            <Text style={styles.botaoEventosSub}>
              Ver todos os eventos do clube
            </Text>
          </View>
          <Text style={styles.botaoEventosSeta}>›</Text>
        </TouchableOpacity>

        {/* ── ATALHOS RÁPIDOS ── */}
        <Text style={styles.secaoTitulo}>Atalhos Rápidos</Text>
        <View style={styles.atalhos}>
          <TouchableOpacity style={styles.atalho} onPress={() => {}}>
            <View style={styles.atalhoIconeContainer}>
              <Text style={styles.atalhoIcone}>🔺</Text>
            </View>
            <Text style={styles.atalhoTexto}>Reboque</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.atalho} onPress={() => {}}>
            <View style={styles.atalhoIconeContainer}>
              <Text style={styles.atalhoIcone}>🔧</Text>
            </View>
            <Text style={styles.atalhoTexto}>Serviços</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.atalho} onPress={() => {}}>
            <View style={styles.atalhoIconeContainer}>
              <Text style={styles.atalhoIcone}>🏥</Text>
            </View>
            <Text style={styles.atalhoTexto}>Serviços{"\n"}Médicos</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.atalho}
            onPress={signOut}
            disabled={loading}
          >
            <View
              style={[
                styles.atalhoIconeContainer,
                { backgroundColor: "rgba(255,68,68,0.15)" },
              ]}
            >
              <Text style={styles.atalhoIcone}>🚪</Text>
            </View>
            <Text style={[styles.atalhoTexto, { color: CORES.danger }]}>
              {loading ? "Saindo..." : "Sair"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* ── RODAPÉ ── */}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: CORES.darkBlue,
  },
  scroll: {
    padding: 20,
    paddingBottom: 40,
  },

  // HEADER
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  headerSaudacao: {
    fontSize: 14,
    color: CORES.gray,
  },
  headerNome: {
    fontSize: 24,
    fontWeight: "800",
    color: CORES.white,
  },
  avatarContainer: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: CORES.lightBlue,
    borderWidth: 2,
    borderColor: CORES.accent,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  avatar: {
    width: 44,
    height: 44,
  },

  // CARTÃO DO SÓCIO
  cartaoSocio: {
    backgroundColor: CORES.mediumBlue,
    borderRadius: 18,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: CORES.accent,
  },
  cartaoSocioHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
  },
  cartaoLogo: {
    width: 40,
    height: 40,
  },
  cartaoClube: {
    fontSize: 13,
    fontWeight: "700",
    color: CORES.accent,
  },
  cartaoTipo: {
    fontSize: 11,
    color: CORES.gray,
    marginTop: 2,
  },
  cartaoInfos: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  cartaoInfoItem: {
    flex: 1,
  },
  cartaoInfoLabel: {
    fontSize: 11,
    color: CORES.darkGray,
    marginBottom: 2,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  cartaoInfoValor: {
    fontSize: 15,
    fontWeight: "700",
    color: CORES.white,
  },
  cartaoNumero: {
    fontSize: 22,
    fontWeight: "900",
    color: CORES.accent,
    letterSpacing: 2,
  },
  cartaoDivisor: {
    width: 1,
    height: 40,
    backgroundColor: CORES.lightBlue,
    marginHorizontal: 16,
  },
  cartaoRodape: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: CORES.lightBlue,
  },
  cartaoSituacao: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  cartaoSituacaoDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  cartaoSituacaoTexto: {
    fontSize: 13,
    color: CORES.white,
    fontWeight: "600",
  },
  cartaoCategoria: {
    fontSize: 12,
    color: CORES.gray,
    backgroundColor: CORES.lightBlue,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },

  // BOTÕES PRINCIPAIS
  botoesRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },
  botaoPrincipal: {
    flex: 1,
    backgroundColor: CORES.mediumBlue,
    borderRadius: 14,
    padding: 18,
    alignItems: "center",
    borderWidth: 1,
    borderColor: CORES.lightBlue,
    gap: 8,
  },
  botaoPrincipalIcone: {
    fontSize: 28,
  },
  botaoPrincipalTexto: {
    fontSize: 13,
    fontWeight: "600",
    color: CORES.white,
    textAlign: "center",
  },

  // EVENTOS
  botaoEventos: {
    backgroundColor: CORES.accent,
    borderRadius: 14,
    padding: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  botaoEventosTitulo: {
    fontSize: 15,
    fontWeight: "700",
    color: CORES.darkBlue,
  },
  botaoEventosSub: {
    fontSize: 12,
    color: CORES.darkBlue,
    opacity: 0.7,
    marginTop: 2,
  },
  botaoEventosSeta: {
    fontSize: 28,
    color: CORES.darkBlue,
    fontWeight: "700",
  },

  // ATALHOS
  secaoTitulo: {
    fontSize: 16,
    fontWeight: "700",
    color: CORES.white,
    marginBottom: 12,
  },
  atalhos: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 32,
  },
  atalho: {
    flex: 1,
    backgroundColor: CORES.mediumBlue,
    borderRadius: 14,
    padding: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: CORES.lightBlue,
    gap: 8,
  },
  atalhoIconeContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(201,168,76,0.15)",
    justifyContent: "center",
    alignItems: "center",
  },
  atalhoIcone: {
    fontSize: 22,
  },
  atalhoTexto: {
    fontSize: 11,
    color: CORES.gray,
    textAlign: "center",
    fontWeight: "600",
  },

  // RODAPÉ
  rodape: {
    textAlign: "center",
    fontSize: 12,
    color: CORES.darkGray,
  },
});
