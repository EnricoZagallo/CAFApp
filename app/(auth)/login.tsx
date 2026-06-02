import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
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

const COLORS = {
  darkBlue: "#0a1628",
  mediumBlue: "#0f2040",
  lightBlue: "#1a3050",
  accent: "#c9a84c",
  white: "#ffffff",
  gray: "#aabbcc",
  darkGray: "#556677",
  inputBorder: "#2a4060",
  error: "#ff4444",
};

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [erroLogin, setErroLogin] = useState("");

  const [modalCadastro, setModalCadastro] = useState(false);
  const [nomeNovo, setNomeNovo] = useState("");
  const [emailNovo, setEmailNovo] = useState("");
  const [senhaNova, setSenhaNova] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [mostrarSenhaNova, setMostrarSenhaNova] = useState(false);
  const [erroCadastro, setErroCadastro] = useState("");

  const [modalSenha, setModalSenha] = useState(false);
  const [emailRecuperar, setEmailRecuperar] = useState("");

  const { signIn, signUp, resetPassword, loading } = useAuth();

  function validarEmail(e: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
  }

  async function handleLogin() {
    setErroLogin("");
    if (!email.trim()) {
      setErroLogin("Informe seu email.");
      return;
    }
    if (!validarEmail(email)) {
      setErroLogin("Email inválido.");
      return;
    }
    if (!senha) {
      setErroLogin("Informe sua senha.");
      return;
    }

    const { error } = await signIn(email, senha);
    if (error) setErroLogin(error);
  }

  async function handleCadastro() {
    setErroCadastro("");
    if (!nomeNovo.trim()) {
      setErroCadastro("Informe seu nome.");
      return;
    }
    if (!emailNovo.trim()) {
      setErroCadastro("Informe seu email.");
      return;
    }
    if (!validarEmail(emailNovo)) {
      setErroCadastro("Email inválido.");
      return;
    }
    if (senhaNova.length < 6) {
      setErroCadastro("A senha deve ter pelo menos 6 caracteres.");
      return;
    }
    if (senhaNova !== confirmarSenha) {
      setErroCadastro("As senhas não coincidem.");
      return;
    }

    const { error } = await signUp(emailNovo, senhaNova, nomeNovo);
    if (error) {
      setErroCadastro(error);
      return;
    }

    setModalCadastro(false);
    setNomeNovo("");
    setEmailNovo("");
    setSenhaNova("");
    setConfirmarSenha("");
    Alert.alert(
      "✅ Conta criada!",
      "Sua conta foi criada com sucesso. Faça login para continuar.",
    );
  }

  async function handleRecuperarSenha() {
    if (!emailRecuperar.trim()) {
      Alert.alert("Atenção", "Informe seu email.");
      return;
    }
    if (!validarEmail(emailRecuperar)) {
      Alert.alert("Atenção", "Email inválido.");
      return;
    }

    const { error } = await resetPassword(emailRecuperar);
    if (error) {
      Alert.alert("Erro", error);
      return;
    }

    setModalSenha(false);
    setEmailRecuperar("");
    Alert.alert(
      "📧 Email enviado!",
      "Verifique sua caixa de entrada para redefinir sua senha.",
    );
  }

  function abrirModalCadastro() {
    setErroCadastro("");
    setNomeNovo("");
    setEmailNovo("");
    setSenhaNova("");
    setConfirmarSenha("");
    setModalCadastro(true);
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.darkBlue} />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* BRASÃO */}
          <View style={styles.logoArea}>
            <View style={styles.logoBadge}>
              <Text style={styles.logoCAF}>CAF</Text>
              <Text style={styles.logoClub}>CLUB</Text>
            </View>
            <Text style={styles.logoTitulo}>Clube Automóveis de Ferro</Text>
            <Text style={styles.logoSubtitulo}>Bem-vindo de volta!</Text>
          </View>

          {/* FORMULÁRIO */}
          <View style={styles.card}>
            <Text style={styles.cardTitulo}>Entrar</Text>

            <Text style={styles.label}>Email</Text>
            <View
              style={[styles.inputWrapper, !!erroLogin && styles.inputError]}
            >
              <Text style={styles.inputIcon}>✉️</Text>
              <TextInput
                style={styles.input}
                placeholder="seu@email.com"
                placeholderTextColor={COLORS.darkGray}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                value={email}
                onChangeText={(t) => {
                  setEmail(t);
                  setErroLogin("");
                }}
              />
            </View>

            <Text style={styles.label}>Senha</Text>
            <View
              style={[styles.inputWrapper, !!erroLogin && styles.inputError]}
            >
              <Text style={styles.inputIcon}>🔒</Text>
              <TextInput
                style={styles.input}
                placeholder="Sua senha"
                placeholderTextColor={COLORS.darkGray}
                secureTextEntry={!mostrarSenha}
                value={senha}
                onChangeText={(t) => {
                  setSenha(t);
                  setErroLogin("");
                }}
              />
              <TouchableOpacity onPress={() => setMostrarSenha(!mostrarSenha)}>
                <Text style={styles.inputIcon}>
                  {mostrarSenha ? "🙈" : "👁️"}
                </Text>
              </TouchableOpacity>
            </View>

            {!!erroLogin && (
              <View style={styles.erroContainer}>
                <Text style={styles.erroTexto}>⚠️ {erroLogin}</Text>
              </View>
            )}

            <TouchableOpacity
              style={styles.forgotBtn}
              onPress={() => setModalSenha(true)}
            >
              <Text style={styles.forgotText}>Esqueceu a senha?</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.btnPrimary, loading && styles.btnDisabled]}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={COLORS.darkBlue} />
              ) : (
                <Text style={styles.btnPrimaryText}>Entrar</Text>
              )}
            </TouchableOpacity>

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>ou</Text>
              <View style={styles.dividerLine} />
            </View>

            <TouchableOpacity
              style={styles.btnGoogle}
              onPress={() =>
                Alert.alert(
                  "Em breve",
                  "Login com Google será adicionado em breve!",
                )
              }
            >
              <Text style={styles.btnGoogleG}>G</Text>
              <Text style={styles.btnGoogleText}>Continuar com Google</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.createAccountBtn}
              onPress={abrirModalCadastro}
            >
              <Text style={styles.createAccountText}>
                Não tem conta?{" "}
                <Text style={styles.createAccountLink}>Criar uma conta</Text>
              </Text>
            </TouchableOpacity>
          </View>

          {/* CARRO DECORATIVO */}
          <View style={styles.carArea}>
            <Text style={styles.carEmoji}>🚗</Text>
            <View style={styles.carLine} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* ── MODAL CRIAR CONTA ── */}
      <Modal
        visible={modalCadastro}
        animationType="slide"
        transparent
        onRequestClose={() => setModalCadastro(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitulo}>Criar Conta</Text>
              <TouchableOpacity onPress={() => setModalCadastro(false)}>
                <Text style={styles.modalFechar}>✕</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.label}>Nome completo</Text>
            <View style={styles.inputWrapper}>
              <Text style={styles.inputIcon}>👤</Text>
              <TextInput
                style={styles.input}
                placeholder="Seu nome"
                placeholderTextColor={COLORS.darkGray}
                value={nomeNovo}
                onChangeText={setNomeNovo}
                autoCapitalize="words"
              />
            </View>

            <Text style={styles.label}>Email</Text>
            <View style={styles.inputWrapper}>
              <Text style={styles.inputIcon}>✉️</Text>
              <TextInput
                style={styles.input}
                placeholder="seu@email.com"
                placeholderTextColor={COLORS.darkGray}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                value={emailNovo}
                onChangeText={setEmailNovo}
              />
            </View>

            <Text style={styles.label}>Senha</Text>
            <View style={styles.inputWrapper}>
              <Text style={styles.inputIcon}>🔒</Text>
              <TextInput
                style={styles.input}
                placeholder="Mínimo 6 caracteres"
                placeholderTextColor={COLORS.darkGray}
                secureTextEntry={!mostrarSenhaNova}
                value={senhaNova}
                onChangeText={setSenhaNova}
              />
              <TouchableOpacity
                onPress={() => setMostrarSenhaNova(!mostrarSenhaNova)}
              >
                <Text style={styles.inputIcon}>
                  {mostrarSenhaNova ? "🙈" : "👁️"}
                </Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.label}>Confirmar senha</Text>
            <View style={styles.inputWrapper}>
              <Text style={styles.inputIcon}>🔒</Text>
              <TextInput
                style={styles.input}
                placeholder="Repita a senha"
                placeholderTextColor={COLORS.darkGray}
                secureTextEntry={!mostrarSenhaNova}
                value={confirmarSenha}
                onChangeText={setConfirmarSenha}
              />
            </View>

            {!!erroCadastro && (
              <View style={styles.erroContainer}>
                <Text style={styles.erroTexto}>⚠️ {erroCadastro}</Text>
              </View>
            )}

            <TouchableOpacity
              style={[styles.btnPrimary, loading && styles.btnDisabled]}
              onPress={handleCadastro}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={COLORS.darkBlue} />
              ) : (
                <Text style={styles.btnPrimaryText}>Criar conta</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalCancelarBtn}
              onPress={() => setModalCadastro(false)}
            >
              <Text style={styles.modalCancelarText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ── MODAL RECUPERAR SENHA ── */}
      <Modal
        visible={modalSenha}
        animationType="slide"
        transparent
        onRequestClose={() => setModalSenha(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitulo}>Recuperar Senha</Text>
              <TouchableOpacity onPress={() => setModalSenha(false)}>
                <Text style={styles.modalFechar}>✕</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.modalDesc}>
              Informe seu email e enviaremos um link para redefinir sua senha.
            </Text>

            <Text style={styles.label}>Email</Text>
            <View style={styles.inputWrapper}>
              <Text style={styles.inputIcon}>✉️</Text>
              <TextInput
                style={styles.input}
                placeholder="seu@email.com"
                placeholderTextColor={COLORS.darkGray}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                value={emailRecuperar}
                onChangeText={setEmailRecuperar}
              />
            </View>

            <TouchableOpacity
              style={[styles.btnPrimary, loading && styles.btnDisabled]}
              onPress={handleRecuperarSenha}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={COLORS.darkBlue} />
              ) : (
                <Text style={styles.btnPrimaryText}>Enviar email</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalCancelarBtn}
              onPress={() => setModalSenha(false)}
            >
              <Text style={styles.modalCancelarText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.darkBlue,
  },
  flex: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 30,
  },
  logoArea: {
    alignItems: "center",
    marginBottom: 32,
  },
  logoBadge: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: COLORS.lightBlue,
    borderWidth: 3,
    borderColor: COLORS.accent,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
    shadowColor: COLORS.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  logoCAF: {
    fontSize: 30,
    fontWeight: "900",
    color: COLORS.accent,
    letterSpacing: 3,
  },
  logoClub: {
    fontSize: 10,
    color: COLORS.white,
    letterSpacing: 4,
    marginTop: -4,
  },
  logoTitulo: {
    fontSize: 15,
    color: COLORS.white,
    fontWeight: "600",
    textAlign: "center",
  },
  logoSubtitulo: {
    fontSize: 13,
    color: COLORS.gray,
    marginTop: 4,
  },
  card: {
    backgroundColor: COLORS.mediumBlue,
    borderRadius: 18,
    padding: 22,
    borderWidth: 1,
    borderColor: COLORS.lightBlue,
    marginBottom: 24,
  },
  cardTitulo: {
    fontSize: 22,
    fontWeight: "700",
    color: COLORS.white,
    marginBottom: 20,
    textAlign: "center",
  },
  label: {
    fontSize: 13,
    color: COLORS.gray,
    marginBottom: 6,
    marginTop: 10,
    fontWeight: "500",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.lightBlue,
    borderRadius: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
  },
  inputError: {
    borderColor: COLORS.error,
  },
  inputIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  input: {
    flex: 1,
    color: COLORS.white,
    paddingVertical: 13,
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
    color: COLORS.error,
    fontSize: 13,
    textAlign: "center",
  },
  forgotBtn: {
    alignSelf: "flex-end",
    marginTop: 10,
    marginBottom: 4,
  },
  forgotText: {
    color: COLORS.accent,
    fontSize: 13,
  },
  btnPrimary: {
    backgroundColor: COLORS.accent,
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 16,
    shadowColor: COLORS.accent,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  btnDisabled: {
    opacity: 0.6,
  },
  btnPrimaryText: {
    color: COLORS.darkBlue,
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 18,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.inputBorder,
  },
  dividerText: {
    color: COLORS.darkGray,
    paddingHorizontal: 12,
    fontSize: 13,
  },
  btnGoogle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.lightBlue,
    borderRadius: 10,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
  },
  btnGoogleG: {
    fontSize: 18,
    fontWeight: "700",
    color: "#4285F4",
    marginRight: 10,
  },
  btnGoogleText: {
    color: COLORS.white,
    fontSize: 15,
  },
  createAccountBtn: {
    marginTop: 18,
    alignItems: "center",
  },
  createAccountText: {
    color: COLORS.gray,
    fontSize: 14,
  },
  createAccountLink: {
    color: COLORS.accent,
    fontWeight: "700",
  },
  carArea: {
    alignItems: "center",
    marginTop: 8,
  },
  carEmoji: {
    fontSize: 44,
    marginBottom: 8,
  },
  carLine: {
    width: "100%",
    height: 2,
    backgroundColor: COLORS.lightBlue,
    borderRadius: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "flex-end",
  },
  modalCard: {
    backgroundColor: COLORS.mediumBlue,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
    borderTopWidth: 1,
    borderColor: COLORS.lightBlue,
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
    color: COLORS.white,
  },
  modalFechar: {
    fontSize: 18,
    color: COLORS.gray,
    padding: 4,
  },
  modalDesc: {
    color: COLORS.gray,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  modalCancelarBtn: {
    marginTop: 12,
    alignItems: "center",
    paddingVertical: 10,
  },
  modalCancelarText: {
    color: COLORS.gray,
    fontSize: 14,
  },
});
