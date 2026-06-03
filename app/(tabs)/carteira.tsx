import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../../src/contexts/AuthContext";
import { supabase } from "../../src/lib/supabase";

const CORES = {
  darkBlue: "#0a1628",
  mediumBlue: "#0f2040",
  lightBlue: "#1a3050",
  accent: "#c9a84c",
  white: "#ffffff",
  gray: "#aabbcc",
  darkGray: "#556677",
  inputBorder: "#2a4060",
  success: "#4caf50",
  danger: "#ff4444",
};

export default function CarteiraScreen() {
  const { profile, user, signOut, loading, refreshProfile } = useAuth();

  const [modalNome, setModalNome] = useState(false);
  const [modalSenha, setModalSenha] = useState(false);
  const [novoNome, setNovoNome] = useState("");
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");

  async function salvarNome() {
    if (!novoNome.trim()) {
      setErro("Informe o novo nome.");
      return;
    }
    setSalvando(true);
    setErro("");
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ nome: novoNome.trim() })
        .eq("id", user?.id);
      if (error) throw error;
      await refreshProfile();
      setModalNome(false);
      Alert.alert("✅ Sucesso", "Nome atualizado!");
    } catch {
      setErro("Erro ao atualizar nome.");
    } finally {
      setSalvando(false);
    }
  }

  async function salvarSenha() {
    if (!novaSenha) {
      setErro("Informe a nova senha.");
      return;
    }
    if (novaSenha.length < 6) {
      setErro("A senha deve ter pelo menos 6 caracteres.");
      return;
    }
    if (novaSenha !== confirmarSenha) {
      setErro("As senhas não coincidem.");
      return;
    }
    setSalvando(true);
    setErro("");
    try {
      const { error } = await supabase.auth.updateUser({ password: novaSenha });
      if (error) throw error;
      setModalSenha(false);
      setSenhaAtual("");
      setNovaSenha("");
      setConfirmarSenha("");
      Alert.alert("✅ Sucesso", "Senha atualizada!");
    } catch {
      setErro("Erro ao atualizar senha.");
    } finally {
      setSalvando(false);
    }
  }

  function abrirModalNome() {
    setNovoNome(profile?.nome ?? "");
    setErro("");
    setModalNome(true);
  }

  function abrirModalSenha() {
    setSenhaAtual("");
    setNovaSenha("");
    setConfirmarSenha("");
    setErro("");
    setModalSenha(true);
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={CORES.darkBlue} />

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* ── HEADER ── */}
        <View style={styles.header}>
          <Text style={styles.headerTitulo}>Meu Perfil</Text>
          {profile?.is_admin ? (
            <View style={styles.adminBadge}>
              <Text style={styles.adminBadgeTexto}>⚙️ Admin</Text>
            </View>
          ) : null}
        </View>

        {/* ── CARTEIRA DIGITAL ── */}
        <View style={styles.carteira}>
          <View style={styles.carteiraHeader}>
            <Image
              source={require("../../assets/images/logo.png")}
              style={styles.carteiraLogo}
              resizeMode="contain"
            />
            <View style={styles.carteiraHeaderTextos}>
              <Text style={styles.carteiraClube}>Clube Antigos do Farol</Text>
              <Text style={styles.carteiraTipo}>
                Carteira Digital do Associado
              </Text>
            </View>
          </View>

          <View style={styles.carteiraCorpo}>
            <View style={styles.carteiraAvatarArea}>
              <View style={styles.carteiraAvatar}>
                <Text style={styles.carteiraAvatarLetra}>
                  {profile?.nome?.charAt(0).toUpperCase() ?? "?"}
                </Text>
              </View>
              <View
                style={[
                  styles.carteiraSituacaoBadge,
                  {
                    backgroundColor:
                      profile?.situacao === "Ativo"
                        ? CORES.success
                        : CORES.danger,
                  },
                ]}
              >
                <Text style={styles.carteiraSituacaoTexto}>
                  {profile?.situacao ?? "---"}
                </Text>
              </View>
            </View>

            <View style={styles.carteiraInfos}>
              <Text style={styles.carteiraNome}>{profile?.nome ?? "---"}</Text>
              <Text style={styles.carteiraEmail}>{user?.email ?? "---"}</Text>

              <View style={styles.carteiraNumeroContainer}>
                <Text style={styles.carteiraNumeroLabel}>Nº do Sócio</Text>
                <Text style={styles.carteiraNumero}>
                  {profile?.numero_socio ?? "---"}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.carteiraRodape}>
            <View style={styles.carteiraRodapeItem}>
              <Text style={styles.carteiraRodapeLabel}>Categoria</Text>
              <Text style={styles.carteiraRodapeValor}>
                {profile?.categoria ?? "---"}
              </Text>
            </View>
            <View style={styles.carteiraRodapeDivisor} />
            <View style={styles.carteiraRodapeItem}></View>
            <View style={styles.carteiraRodapeDivisor} />
            <View style={styles.carteiraRodapeItem}>
              <Text style={styles.carteiraRodapeLabel}>Validade</Text>
              <Text style={styles.carteiraRodapeValor}>
                {profile?.validade ?? "---"}
              </Text>
            </View>
          </View>
        </View>

        {/* ── INFORMAÇÕES DA CONTA ── */}
        <Text style={styles.secaoTitulo}>Informações da Conta</Text>
        <View style={styles.secaoCard}>
          <View style={styles.infoLinha}>
            <View style={styles.infoIconeArea}>
              <Text style={styles.infoIcone}>👤</Text>
            </View>
            <View style={styles.infoTextos}>
              <Text style={styles.infoLabel}>Nome completo</Text>
              <Text style={styles.infoValor}>{profile?.nome ?? "---"}</Text>
            </View>
            <TouchableOpacity
              style={styles.infoEditar}
              onPress={abrirModalNome}
            >
              <Text style={styles.infoEditarTexto}>Editar</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.infoDivisor} />

          <View style={styles.infoLinha}>
            <View style={styles.infoIconeArea}>
              <Text style={styles.infoIcone}>✉️</Text>
            </View>
            <View style={styles.infoTextos}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValor}>{user?.email ?? "---"}</Text>
            </View>
          </View>

          <View style={styles.infoDivisor} />

          <View style={styles.infoLinha}>
            <View style={styles.infoIconeArea}>
              <Text style={styles.infoIcone}>🪪</Text>
            </View>
            <View style={styles.infoTextos}>
              <Text style={styles.infoLabel}>Nº do Sócio</Text>
              <Text style={styles.infoValor}>
                {profile?.numero_socio ?? "---"}
              </Text>
            </View>
          </View>

          <View style={styles.infoDivisor} />

          <View style={styles.infoLinha}>
            <View style={styles.infoIconeArea}>
              <Text style={styles.infoIcone}>🏅</Text>
            </View>
            <View style={styles.infoTextos}>
              <Text style={styles.infoLabel}>Categoria</Text>
              <Text style={styles.infoValor}>
                {profile?.categoria ?? "---"}
              </Text>
            </View>
          </View>

          <View style={styles.infoDivisor} />

          <View style={styles.infoDivisor} />

          <View style={styles.infoLinha}>
            <View style={styles.infoIconeArea}>
              <Text style={styles.infoIcone}>⏳</Text>
            </View>
            <View style={styles.infoTextos}>
              <Text style={styles.infoLabel}>Validade</Text>
              <Text style={styles.infoValor}>{profile?.validade ?? "---"}</Text>
            </View>
          </View>
        </View>

        {/* ── SEGURANÇA ── */}
        <Text style={styles.secaoTitulo}>Segurança</Text>
        <View style={styles.secaoCard}>
          <TouchableOpacity style={styles.infoLinha} onPress={abrirModalSenha}>
            <View style={styles.infoIconeArea}>
              <Text style={styles.infoIcone}>🔒</Text>
            </View>
            <View style={styles.infoTextos}>
              <Text style={styles.infoLabel}>Senha</Text>
              <Text style={styles.infoValor}>••••••••</Text>
            </View>
            <Text style={styles.infoSeta}>›</Text>
          </TouchableOpacity>
        </View>

        {/* ── SAIR ── */}
        <TouchableOpacity
          style={[styles.btnSair, loading && { opacity: 0.6 }]}
          onPress={signOut}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={CORES.white} />
          ) : (
            <>
              <Text style={styles.btnSairIcone}>🚪</Text>
              <Text style={styles.btnSairTexto}>Sair da conta</Text>
            </>
          )}
        </TouchableOpacity>

        <Text style={styles.versao}>Clube Antigos do Farol • v1.0.0</Text>
      </ScrollView>

      {/* ── MODAL EDITAR NOME ── */}
      <Modal
        visible={modalNome}
        animationType="slide"
        transparent
        onRequestClose={() => setModalNome(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitulo}>Editar Nome</Text>
              <TouchableOpacity onPress={() => setModalNome(false)}>
                <Text style={styles.modalFechar}>✕</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.label}>Nome completo</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Seu nome completo"
                placeholderTextColor={CORES.darkGray}
                value={novoNome}
                onChangeText={setNovoNome}
                autoCapitalize="words"
              />
            </View>

            {erro ? (
              <View style={styles.erroContainer}>
                <Text style={styles.erroTexto}>⚠️ {erro}</Text>
              </View>
            ) : null}

            <TouchableOpacity
              style={[styles.btnSalvar, salvando && { opacity: 0.6 }]}
              onPress={salvarNome}
              disabled={salvando}
            >
              {salvando ? (
                <ActivityIndicator color={CORES.darkBlue} />
              ) : (
                <Text style={styles.btnSalvarTexto}>Salvar</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.btnCancelar}
              onPress={() => setModalNome(false)}
            >
              <Text style={styles.btnCancelarTexto}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ── MODAL ALTERAR SENHA ── */}
      <Modal
        visible={modalSenha}
        animationType="slide"
        transparent
        onRequestClose={() => setModalSenha(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitulo}>Alterar Senha</Text>
              <TouchableOpacity onPress={() => setModalSenha(false)}>
                <Text style={styles.modalFechar}>✕</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.label}>Nova senha</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Mínimo 6 caracteres"
                placeholderTextColor={CORES.darkGray}
                secureTextEntry
                value={novaSenha}
                onChangeText={setNovaSenha}
              />
            </View>

            <Text style={styles.label}>Confirmar nova senha</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Repita a nova senha"
                placeholderTextColor={CORES.darkGray}
                secureTextEntry
                value={confirmarSenha}
                onChangeText={setConfirmarSenha}
              />
            </View>

            {erro ? (
              <View style={styles.erroContainer}>
                <Text style={styles.erroTexto}>⚠️ {erro}</Text>
              </View>
            ) : null}

            <TouchableOpacity
              style={[styles.btnSalvar, salvando && { opacity: 0.6 }]}
              onPress={salvarSenha}
              disabled={salvando}
            >
              {salvando ? (
                <ActivityIndicator color={CORES.darkBlue} />
              ) : (
                <Text style={styles.btnSalvarTexto}>Alterar senha</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.btnCancelar}
              onPress={() => setModalSenha(false)}
            >
              <Text style={styles.btnCancelarTexto}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    marginBottom: 20,
  },
  headerTitulo: {
    fontSize: 26,
    fontWeight: "800",
    color: CORES.white,
  },
  adminBadge: {
    backgroundColor: "rgba(201,168,76,0.2)",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: CORES.accent,
  },
  adminBadgeTexto: {
    color: CORES.accent,
    fontSize: 12,
    fontWeight: "700",
  },

  // CARTEIRA
  carteira: {
    backgroundColor: CORES.mediumBlue,
    borderRadius: 18,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: CORES.accent,
    marginBottom: 24,
  },
  carteiraHeader: {
    backgroundColor: CORES.lightBlue,
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: CORES.accent,
  },
  carteiraLogo: {
    width: 36,
    height: 36,
  },
  carteiraHeaderTextos: {
    flex: 1,
  },
  carteiraClube: {
    fontSize: 13,
    fontWeight: "700",
    color: CORES.accent,
  },
  carteiraTipo: {
    fontSize: 10,
    color: CORES.gray,
    marginTop: 1,
    letterSpacing: 0.5,
  },
  carteiraCorpo: {
    flexDirection: "row",
    padding: 16,
    gap: 16,
    alignItems: "center",
  },
  carteiraAvatarArea: {
    alignItems: "center",
    gap: 8,
  },
  carteiraAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: CORES.lightBlue,
    borderWidth: 2,
    borderColor: CORES.accent,
    justifyContent: "center",
    alignItems: "center",
  },
  carteiraAvatarLetra: {
    fontSize: 28,
    fontWeight: "900",
    color: CORES.accent,
  },
  carteiraSituacaoBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
  },
  carteiraSituacaoTexto: {
    fontSize: 10,
    fontWeight: "700",
    color: CORES.white,
  },
  carteiraInfos: {
    flex: 1,
    gap: 4,
  },
  carteiraNome: {
    fontSize: 16,
    fontWeight: "800",
    color: CORES.white,
  },
  carteiraEmail: {
    fontSize: 11,
    color: CORES.gray,
    marginBottom: 6,
  },
  carteiraNumeroContainer: {
    backgroundColor: CORES.lightBlue,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  carteiraNumeroLabel: {
    fontSize: 9,
    color: CORES.darkGray,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  carteiraNumero: {
    fontSize: 20,
    fontWeight: "900",
    color: CORES.accent,
    letterSpacing: 2,
  },
  carteiraRodape: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: CORES.lightBlue,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  carteiraRodapeItem: {
    flex: 1,
    alignItems: "center",
  },
  carteiraRodapeLabel: {
    fontSize: 9,
    color: CORES.darkGray,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  carteiraRodapeValor: {
    fontSize: 12,
    fontWeight: "700",
    color: CORES.white,
  },
  carteiraRodapeDivisor: {
    width: 1,
    backgroundColor: CORES.lightBlue,
  },

  // SEÇÕES
  secaoTitulo: {
    fontSize: 15,
    fontWeight: "700",
    color: CORES.white,
    marginBottom: 10,
  },
  secaoCard: {
    backgroundColor: CORES.mediumBlue,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: CORES.lightBlue,
    marginBottom: 20,
    overflow: "hidden",
  },
  infoLinha: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  infoIconeArea: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: CORES.lightBlue,
    justifyContent: "center",
    alignItems: "center",
  },
  infoIcone: {
    fontSize: 16,
  },
  infoTextos: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 11,
    color: CORES.darkGray,
    marginBottom: 2,
  },
  infoValor: {
    fontSize: 14,
    fontWeight: "600",
    color: CORES.white,
  },
  infoEditar: {
    backgroundColor: "rgba(201,168,76,0.15)",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: CORES.accent,
  },
  infoEditarTexto: {
    color: CORES.accent,
    fontSize: 12,
    fontWeight: "600",
  },
  infoSeta: {
    fontSize: 22,
    color: CORES.darkGray,
  },
  infoDivisor: {
    height: 1,
    backgroundColor: CORES.lightBlue,
    marginLeft: 64,
  },

  // SAIR
  btnSair: {
    backgroundColor: "rgba(255,68,68,0.15)",
    borderRadius: 14,
    paddingVertical: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    borderWidth: 1,
    borderColor: CORES.danger,
    marginBottom: 16,
  },
  btnSairIcone: {
    fontSize: 18,
  },
  btnSairTexto: {
    color: CORES.danger,
    fontSize: 15,
    fontWeight: "700",
  },

  versao: {
    textAlign: "center",
    fontSize: 11,
    color: CORES.darkGray,
    marginBottom: 8,
  },

  // MODAL
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.75)",
    justifyContent: "flex-end",
  },
  modalCard: {
    backgroundColor: CORES.mediumBlue,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
    borderTopWidth: 1,
    borderColor: CORES.lightBlue,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitulo: {
    fontSize: 20,
    fontWeight: "700",
    color: CORES.white,
  },
  modalFechar: {
    fontSize: 18,
    color: CORES.gray,
    padding: 4,
  },
  label: {
    fontSize: 13,
    color: CORES.gray,
    marginBottom: 6,
    marginTop: 10,
    fontWeight: "500",
  },
  inputWrapper: {
    backgroundColor: CORES.lightBlue,
    borderRadius: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: CORES.inputBorder,
  },
  input: {
    color: CORES.white,
    paddingVertical: 12,
    fontSize: 15,
  },
  erroContainer: {
    backgroundColor: "rgba(255,68,68,0.1)",
    borderRadius: 8,
    padding: 10,
    marginTop: 10,
    borderWidth: 1,
    borderColor: "rgba(255,68,68,0.3)",
  },
  erroTexto: {
    color: CORES.danger,
    fontSize: 13,
    textAlign: "center",
  },
  btnSalvar: {
    backgroundColor: CORES.accent,
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 16,
  },
  btnSalvarTexto: {
    color: CORES.darkBlue,
    fontSize: 16,
    fontWeight: "700",
  },
  btnCancelar: {
    alignItems: "center",
    paddingVertical: 12,
    marginTop: 4,
  },
  btnCancelarTexto: {
    color: CORES.gray,
    fontSize: 14,
  },
});
