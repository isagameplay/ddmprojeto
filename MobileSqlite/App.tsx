import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";
import {
  createTable,
  addUsuario,
  listarUsuarios,
  atualizarUsuario,
  deletarUsuario,
} from "./Banco/Config";

export default function App() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [usuariosFiltrados, setUsuariosFiltrados] = useState<any[]>([]);
  const [editId, setEditId] = useState<number | null>(null);
  const [filtro, setFiltro] = useState("");

  useEffect(() => {
    (async () => {
      await createTable();
      await carregar();
    })();
  }, []);

  useEffect(() => {
    filtrarUsuarios();
  }, [filtro, usuarios]);

  const carregar = async () => {
    const dados = await listarUsuarios();
    setUsuarios(dados);
  };

  const filtrarUsuarios = () => {
    if (!filtro.trim()) {
      setUsuariosFiltrados(usuarios);
      return;
    }

    const termo = filtro.toLowerCase();
    const filtrados = usuarios.filter(
      (u) =>
        u.nome.toLowerCase().includes(termo) ||
        u.email.toLowerCase().includes(termo)
    );
    setUsuariosFiltrados(filtrados);
  };

  const limparFiltro = () => setFiltro("");

  const salvar = async () => {
    if (!nome.trim() || !email.trim()) return;
    if (editId) {
      await atualizarUsuario(editId, nome, email);
    } else {
      await addUsuario(nome, email);
    }
    setNome("");
    setEmail("");
    setEditId(null);
    await carregar();
  };

  const cancelarEdicao = () => {
    setNome("");
    setEmail("");
    setEditId(null);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.titulo}>Lista de cadastro de Usuários</Text>
      </View>

      <View style={styles.formContainer}>
        <TextInput
          placeholder="Nome completo"
          value={nome}
          onChangeText={setNome}
          style={styles.input}
          placeholderTextColor="#888"
        />
        <TextInput
          placeholder="E-mail"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          placeholderTextColor="#888"
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <View style={styles.botoesContainer}>
          <TouchableOpacity
            style={[styles.botao, styles.botaoSalvar]}
            onPress={salvar}
          >
            <Text style={styles.textoBotao}>
              {editId ? "✓ Atualizar" : "+ Adicionar"}
            </Text>
          </TouchableOpacity>

          {editId && (
            <TouchableOpacity
              style={[styles.botao, styles.botaoCancelar]}
              onPress={cancelarEdicao}
            >
              <Text style={styles.textoBotao}>✕ Cancelar</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.listaContainer}>
        <View style={styles.filtroContainer}>
          <View style={styles.filtroInputContainer}>
            <Text style={styles.filtroIcone}>🔍</Text>
            <TextInput
              placeholder="Buscar por nome ou e-mail..."
              value={filtro}
              onChangeText={setFiltro}
              style={styles.filtroInput}
              placeholderTextColor="#888"
            />
            {filtro.length > 0 && (
              <TouchableOpacity onPress={limparFiltro} style={styles.limparFiltro}>
                <Text style={styles.limparFiltroTexto}>✕</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        <Text style={styles.tituloLista}>
          {filtro
            ? `Resultados: ${usuariosFiltrados.length}`
            : `Usuários Cadastrados (${usuarios.length})`}
        </Text>

        {usuariosFiltrados.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>
              {usuarios.length === 0
                ? "Nenhum usuário cadastrado"
                : "Nenhum resultado encontrado"}
            </Text>
          </View>
        ) : (
          <FlatList
            data={usuariosFiltrados}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <View style={styles.cardInfo}>
                  <Text style={styles.cardNome}>{item.nome}</Text>
                  <Text style={styles.cardEmail}>{item.email}</Text>
                </View>

                <View style={styles.cardAcoes}>
                  <TouchableOpacity
                    style={[styles.botaoAcao, styles.botaoEditar]}
                    onPress={() => {
                      setNome(item.nome);
                      setEmail(item.email);
                      setEditId(item.id);
                    }}
                  >
                    <Text style={styles.textoAcao}>✎ Editar</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.botaoAcao, styles.botaoExcluir]}
                    onPress={async () => {
                      await deletarUsuario(item.id);
                      await carregar();
                    }}
                  >
                    <Text style={styles.textoAcao}>🗑 Excluir</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        )}
      </View>
    </View>
  );
}

const rosa = "#ffd5e5";
const azulClaro = "#cce7ff";
const verdeClaro = "#d6f5d6";
const rosaForte = "#ff8bb3";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: rosa,
    paddingTop: 50,
  },
  header: {
    backgroundColor: rosaForte,
    padding: 22,
    alignItems: "center",
    borderBottomLeftRadius: 22,
    borderBottomRightRadius: 22,
  },
  titulo: {
    fontSize: 26,
    fontWeight: "700",
    color: "#fff",
  },
  formContainer: {
    backgroundColor: "#fff",
    margin: 20,
    padding: 20,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: azulClaro,
  },
  input: {
    borderWidth: 2,
    borderColor: rosaForte,
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    fontSize: 16,
    backgroundColor: "#fff0f6",
  },
  botoesContainer: {
    flexDirection: "row",
    gap: 10,
  },
  botao: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  botaoSalvar: {
    backgroundColor: verdeClaro,
  },
  botaoCancelar: {
    backgroundColor: rosaForte,
  },
  textoBotao: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
  },
  listaContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  filtroContainer: {
    marginBottom: 16,
  },
  filtroInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderWidth: 2,
    borderColor: azulClaro,
  },
  filtroIcone: {
    fontSize: 18,
    marginRight: 8,
  },
  filtroInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 10,
  },
  limparFiltro: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: rosaForte,
    borderRadius: 20,
  },
  limparFiltroTexto: {
    color: "#fff",
    fontWeight: "700",
  },
  tituloLista: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
    color: "#333",
  },
  emptyState: {
    alignItems: "center",
    padding: 40,
  },
  emptyText: {
    color: "#555",
    fontSize: 16,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: rosaForte,
  },
  cardInfo: {
    marginBottom: 12,
  },
  cardNome: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
  },
  cardEmail: {
    fontSize: 14,
    color: "#666",
  },
  cardAcoes: {
    flexDirection: "row",
    gap: 10,
  },
  botaoAcao: {
    flex: 1,
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  botaoEditar: {
    backgroundColor: azulClaro,
  },
  botaoExcluir: {
    backgroundColor: rosaForte,
  },
  textoAcao: {
    fontSize: 14,
    fontWeight: "700",
    color: "#333",
  },
});
