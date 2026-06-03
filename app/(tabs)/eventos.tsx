import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  RefreshControl,
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
import { Evento } from "../../src/types";

const CORES = {
  darkBlue: "#0a1628",
  mediumBlue: "#0f2040",
  lightBlue: "#1a3050",
  accent: "#c9a84c",
  white: "#ffffff",
  gray: "#aabbcc",
  darkGray: "#556677",
  inputBorder: "#2a4060",
  error: "#ff4444",
  success: "#4caf50",
};

const CATEGORIAS = [
  "Geral",
  "Exposição",
  "Encontro",
  "Rally",
  "Reunião",
  "Confraternização",
];

function formatarData(data: string) {
  const [ano, mes, dia] = data.split("-");
  return `${dia}/${mes}/${ano}`;
}

function formatarHorario(horario: string) {
  return horario.substring(0, 5);
}

function CartaoEvento({
  evento,
  isAdmin,
  onEditar,
  onExcluir,
}: {
  evento: Evento;
  isAdmin: boolean;
  onEditar: (e: Evento) => void;
  onExcluir: (id: string) => void;
}) {
  const coresCategoria: Record<string, string> = {
    Geral: "#556677",
    Exposição: "#9c27b0",
    Encontro: "#2196f3",
    Rally: "#ff5722",
    Reunião: "#4caf50",
    Confraternização: "#c9a84c",
  };

  const corCategoria = coresCategoria[evento.categoria] ?? "#556677";

  return (
    <View style={styles.cartao}>
      <View style={[styles.cartaoHeader, { backgroundColor: corCategoria }]}>
        <Text style={styles.cartaoCategoria}>{evento.categoria}</Text>
        {isAdmin ? (
          <View style={styles.cartaoAcoes}>
            <TouchableOpacity
              style={styles.btnAcao}
              onPress={() => onEditar(evento)}
            >
              <Text style={styles.btnAcaoTexto}>✏️</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.btnAcao}
              onPress={() => onExcluir(evento.id)}
            >
              <Text style={styles.btnAcaoTexto}>🗑️</Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </View>

      <View style={styles.cartaoBody}>
        <Text style={styles.cartaoTitulo}>{evento.titulo}</Text>

        {evento.descricao ? (
          <Text style={styles.cartaoDescricao}>{evento.descricao}</Text>
        ) : null}

        <View style={styles.cartaoInfos}>
          <View style={styles.cartaoInfo}>
            <Text style={styles.cartaoInfoIcon}>📅</Text>
            <Text style={styles.cartaoInfoTexto}>
              {formatarData(evento.data)}
            </Text>
          </View>

          <View style={styles.cartaoInfo}>
            <Text style={styles.cartaoInfoIcon}>🕐</Text>
            <Text style={styles.cartaoInfoTexto}>
              {formatarHorario(evento.horario)}
            </Text>
          </View>

          <View style={styles.cartaoInfo}>
            <Text style={styles.cartaoInfoIcon}>📍</Text>
            <Text style={styles.cartaoInfoTexto}>{evento.local}</Text>
          </View>

          {evento.endereco ? (
            <View style={styles.cartaoInfo}>
              <Text style={styles.cartaoInfoIcon}>🗺️</Text>
              <Text style={styles.cartaoInfoTexto}>{evento.endereco}</Text>
            </View>
          ) : null}

          {evento.vagas ? (
            <View style={styles.cartaoInfo}>
              <Text style={styles.cartaoInfoIcon}>👥</Text>
              <Text style={styles.cartaoInfoTexto}>{evento.vagas} vagas</Text>
            </View>
          ) : null}
        </View>
      </View>
    </View>
  );
}

const eventoVazio = {
  titulo: "",
  descricao: "",
  data: "",
  horario: "",
  local: "",
  endereco: "",
  categoria: "Geral",
  vagas: "",
};

export default function EventosScreen() {
  const { profile } = useAuth();
  const isAdmin = profile?.is_admin === true;

  const [eventos, setEventos] = useState<Evento[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [atualizando, setAtualizando] = useState(false);

  const [modalAberto, setModalAberto] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [erro, setErro] = useState("");

  const [form, setForm] = useState(eventoVazio);
  const [categoriaAtiva, setCategoriaAtiva] = useState("Todos");

  async function carregarEventos() {
    try {
      const { data, error } = await supabase
        .from("eventos")
        .select("*")
        .order("data", { ascending: true });

      if (error) throw error;
      setEventos(data as Evento[]);
    } catch {
      Alert.alert("Erro", "Não foi possível carregar os eventos.");
    } finally {
      setCarregando(false);
      setAtualizando(false);
    }
  }

  useEffect(() => {
    carregarEventos();
  }, []);

  function abrirModalNovo() {
    setForm(eventoVazio);
    setEditandoId(null);
    setErro("");
    setModalAberto(true);
  }

  function abrirModalEditar(evento: Evento) {
    setForm({
      titulo: evento.titulo,
      descricao: evento.descricao ?? "",
      data: evento.data,
      horario: evento.horario.substring(0, 5),
      local: evento.local,
      endereco: evento.endereco ?? "",
      categoria: evento.categoria,
      vagas: evento.vagas ? String(evento.vagas) : "",
    });
    setEditandoId(evento.id);
    setErro("");
    setModalAberto(true);
  }

  function validarForm() {
    if (!form.titulo.trim()) return "Informe o título do evento.";
    if (!form.data.trim()) return "Informe a data do evento.";
    if (!/^\d{4}-\d{2}-\d{2}$/.test(form.data))
      return "Data inválida. Use o formato AAAA-MM-DD.";
    if (!form.horario.trim()) return "Informe o horário do evento.";
    if (!/^\d{2}:\d{2}$/.test(form.horario))
      return "Horário inválido. Use o formato HH:MM.";
    if (!form.local.trim()) return "Informe o local do evento.";
    return null;
  }

  async function salvarEvento() {
    const erroValidacao = validarForm();
    if (erroValidacao) {
      setErro(erroValidacao);
      return;
    }

    setSalvando(true);
    setErro("");

    const payload = {
      titulo: form.titulo.trim(),
      descricao: form.descricao.trim() || null,
      data: form.data.trim(),
      horario: form.horario.trim(),
      local: form.local.trim(),
      endereco: form.endereco.trim() || null,
      categoria: form.categoria,
      vagas: form.vagas ? parseInt(form.vagas) : null,
    };

    try {
      if (editandoId) {
        const { error } = await supabase
          .from("eventos")
          .update({ ...payload, updated_at: new Date().toISOString() })
          .eq("id", editandoId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("eventos").insert(payload);
        if (error) throw error;
      }

      setModalAberto(false);
      await carregarEventos();
      Alert.alert(
        "Sucesso",
        editandoId ? "Evento atualizado!" : "Evento criado!",
      );
    } catch {
      setErro("Erro ao salvar. Tente novamente.");
    } finally {
      setSalvando(false);
    }
  }

  async function excluirEvento(id: string) {
    Alert.alert(
      "Excluir evento",
      "Tem certeza que deseja excluir este evento?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            const { error } = await supabase
              .from("eventos")
              .delete()
              .eq("id", id);
            if (error) {
              Alert.alert("Erro", "Não foi possível excluir o evento.");
              return;
            }
            await carregarEventos();
          },
        },
      ],
    );
  }

  const eventosFiltrados =
    categoriaAtiva === "Todos"
      ? eventos
      : eventos.filter((e) => e.categoria === categoriaAtiva);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={CORES.darkBlue} />

      {/* HEADER */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitulo}>Eventos</Text>
          <Text style={styles.headerSub}>
            {eventos.length} evento{eventos.length !== 1 ? "s" : ""} programado
            {eventos.length !== 1 ? "s" : ""}
          </Text>
        </View>
        {isAdmin ? (
          <TouchableOpacity style={styles.btnNovo} onPress={abrirModalNovo}>
            <Text style={styles.btnNovoTexto}>+ Novo</Text>
          </TouchableOpacity>
        ) : null}
      </View>

      {/* FILTRO */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filtroContainer}
        contentContainerStyle={styles.filtroContent}
      >
        {["Todos", ...CATEGORIAS].map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[
              styles.filtroBotao,
              categoriaAtiva === cat && styles.filtroBotaoAtivo,
            ]}
            onPress={() => setCategoriaAtiva(cat)}
          >
            <Text
              style={[
                styles.filtroTexto,
                categoriaAtiva === cat && styles.filtroTextoAtivo,
              ]}
            >
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* LISTA */}
      {carregando ? (
        <View style={styles.centralized}>
          <ActivityIndicator size="large" color={CORES.accent} />
        </View>
      ) : eventosFiltrados.length === 0 ? (
        <View style={styles.centralized}>
          <Text style={styles.emptyIcon}>📭</Text>
          <Text style={styles.emptyTexto}>Nenhum evento encontrado</Text>
          {isAdmin ? (
            <Text style={styles.emptySub}>
              Clique em + Novo para criar o primeiro evento
            </Text>
          ) : null}
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.lista}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={atualizando}
              onRefresh={() => {
                setAtualizando(true);
                carregarEventos();
              }}
              tintColor={CORES.accent}
            />
          }
        >
          {eventosFiltrados.map((evento) => (
            <CartaoEvento
              key={evento.id}
              evento={evento}
              isAdmin={isAdmin}
              onEditar={abrirModalEditar}
              onExcluir={excluirEvento}
            />
          ))}
        </ScrollView>
      )}

      {/* MODAL */}
      <Modal
        visible={modalAberto}
        animationType="slide"
        transparent
        onRequestClose={() => setModalAberto(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitulo}>
                  {editandoId ? "Editar Evento" : "Novo Evento"}
                </Text>
                <TouchableOpacity onPress={() => setModalAberto(false)}>
                  <Text style={styles.modalFechar}>✕</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.label}>Título *</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="Ex: Encontro de Clássicos"
                  placeholderTextColor={CORES.darkGray}
                  value={form.titulo}
                  onChangeText={(t) => setForm({ ...form, titulo: t })}
                />
              </View>

              <Text style={styles.label}>Descrição</Text>
              <View style={[styles.inputWrapper, { height: 90 }]}>
                <TextInput
                  style={[
                    styles.input,
                    { textAlignVertical: "top", paddingTop: 10 },
                  ]}
                  placeholder="Detalhes do evento..."
                  placeholderTextColor={CORES.darkGray}
                  multiline
                  numberOfLines={3}
                  value={form.descricao}
                  onChangeText={(t) => setForm({ ...form, descricao: t })}
                />
              </View>

              <View style={styles.linhaDouble}>
                <View style={styles.inputHalf}>
                  <Text style={styles.label}>Data * (AAAA-MM-DD)</Text>
                  <View style={styles.inputWrapper}>
                    <TextInput
                      style={styles.input}
                      placeholder="2025-12-31"
                      placeholderTextColor={CORES.darkGray}
                      keyboardType="numbers-and-punctuation"
                      value={form.data}
                      onChangeText={(t) => setForm({ ...form, data: t })}
                    />
                  </View>
                </View>

                <View style={styles.inputHalf}>
                  <Text style={styles.label}>Horário * (HH:MM)</Text>
                  <View style={styles.inputWrapper}>
                    <TextInput
                      style={styles.input}
                      placeholder="09:00"
                      placeholderTextColor={CORES.darkGray}
                      keyboardType="numbers-and-punctuation"
                      value={form.horario}
                      onChangeText={(t) => setForm({ ...form, horario: t })}
                    />
                  </View>
                </View>
              </View>

              <Text style={styles.label}>Local *</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="Ex: Clube, Parque, Pista..."
                  placeholderTextColor={CORES.darkGray}
                  value={form.local}
                  onChangeText={(t) => setForm({ ...form, local: t })}
                />
              </View>

              <Text style={styles.label}>Endereço completo</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="Rua, número, cidade..."
                  placeholderTextColor={CORES.darkGray}
                  value={form.endereco}
                  onChangeText={(t) => setForm({ ...form, endereco: t })}
                />
              </View>

              <Text style={styles.label}>Vagas</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  placeholder="Deixe vazio para ilimitado"
                  placeholderTextColor={CORES.darkGray}
                  keyboardType="numeric"
                  value={form.vagas}
                  onChangeText={(t) => setForm({ ...form, vagas: t })}
                />
              </View>

              <Text style={styles.label}>Categoria</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={{ marginBottom: 16 }}
              >
                {CATEGORIAS.map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    style={[
                      styles.catBotao,
                      form.categoria === cat && styles.catBotaoAtivo,
                    ]}
                    onPress={() => setForm({ ...form, categoria: cat })}
                  >
                    <Text
                      style={[
                        styles.catTexto,
                        form.categoria === cat && styles.catTextoAtivo,
                      ]}
                    >
                      {cat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              {erro ? (
                <View style={styles.erroContainer}>
                  <Text style={styles.erroTexto}>⚠️ {erro}</Text>
                </View>
              ) : null}

              <TouchableOpacity
                style={[styles.btnSalvar, salvando && styles.btnDisabled]}
                onPress={salvarEvento}
                disabled={salvando}
              >
                {salvando ? (
                  <ActivityIndicator color={CORES.darkBlue} />
                ) : (
                  <Text style={styles.btnSalvarTexto}>
                    {editandoId ? "Salvar alterações" : "Criar evento"}
                  </Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.btnCancelar}
                onPress={() => setModalAberto(false)}
              >
                <Text style={styles.btnCancelarTexto}>Cancelar</Text>
              </TouchableOpacity>
            </ScrollView>
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  headerTitulo: {
    fontSize: 26,
    fontWeight: "800",
    color: CORES.white,
  },
  headerSub: {
    fontSize: 13,
    color: CORES.gray,
    marginTop: 2,
  },
  btnNovo: {
    backgroundColor: CORES.accent,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 18,
  },
  btnNovoTexto: {
    color: CORES.darkBlue,
    fontWeight: "700",
    fontSize: 14,
  },
  filtroContainer: {
    maxHeight: 48,
    marginBottom: 8,
  },
  filtroContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filtroBotao: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: CORES.lightBlue,
    borderWidth: 1,
    borderColor: CORES.inputBorder,
  },
  filtroBotaoAtivo: {
    backgroundColor: CORES.accent,
    borderColor: CORES.accent,
  },
  filtroTexto: {
    color: CORES.gray,
    fontSize: 13,
    fontWeight: "500",
  },
  filtroTextoAtivo: {
    color: CORES.darkBlue,
    fontWeight: "700",
  },
  lista: {
    padding: 16,
    gap: 16,
  },
  centralized: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
  emptyTexto: {
    color: CORES.gray,
    fontSize: 16,
    fontWeight: "600",
  },
  emptySub: {
    color: CORES.darkGray,
    fontSize: 13,
    textAlign: "center",
    paddingHorizontal: 32,
  },
  cartao: {
    backgroundColor: CORES.mediumBlue,
    borderRadius: 14,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: CORES.lightBlue,
  },
  cartaoHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  cartaoCategoria: {
    color: CORES.white,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  cartaoAcoes: {
    flexDirection: "row",
    gap: 8,
  },
  btnAcao: {
    padding: 4,
  },
  btnAcaoTexto: {
    fontSize: 16,
  },
  cartaoBody: {
    padding: 14,
  },
  cartaoTitulo: {
    fontSize: 17,
    fontWeight: "700",
    color: CORES.white,
    marginBottom: 6,
  },
  cartaoDescricao: {
    fontSize: 13,
    color: CORES.gray,
    marginBottom: 10,
    lineHeight: 18,
  },
  cartaoInfos: {
    gap: 6,
  },
  cartaoInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  cartaoInfoIcon: {
    fontSize: 14,
    width: 20,
  },
  cartaoInfoTexto: {
    color: CORES.gray,
    fontSize: 13,
  },
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
    maxHeight: "92%",
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
  linhaDouble: {
    flexDirection: "row",
    gap: 12,
  },
  inputHalf: {
    flex: 1,
  },
  catBotao: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: CORES.lightBlue,
    borderWidth: 1,
    borderColor: CORES.inputBorder,
    marginRight: 8,
  },
  catBotaoAtivo: {
    backgroundColor: CORES.accent,
    borderColor: CORES.accent,
  },
  catTexto: {
    color: CORES.gray,
    fontSize: 13,
  },
  catTextoAtivo: {
    color: CORES.darkBlue,
    fontWeight: "700",
  },
  erroContainer: {
    backgroundColor: "rgba(255,68,68,0.1)",
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "rgba(255,68,68,0.3)",
  },
  erroTexto: {
    color: CORES.error,
    fontSize: 13,
    textAlign: "center",
  },
  btnSalvar: {
    backgroundColor: CORES.accent,
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 8,
  },
  btnDisabled: {
    opacity: 0.6,
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
