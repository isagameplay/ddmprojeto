import * as SQLite from "expo-sqlite";
 
const db = SQLite.openDatabaseSync("meubanco.db");
 
export interface Usuario {
  id: number;
  nome: string;
  email: string;
}
 
export function createTable(): void {
  db.execSync(
    `CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      email TEXT NOT NULL
    );`
  );
}
 
export function addUsuario(nome: string, email: string): void {
  db.runSync("INSERT INTO usuarios (nome, email) VALUES (?, ?)", [nome, email]);
}
 
export function listarUsuarios(): Usuario[] {
  const result = db.getAllSync<Usuario>("SELECT * FROM usuarios");
  return result;
}
 
export function atualizarUsuario(
  id: number,
  nome: string,
  email: string
): void {
  db.runSync("UPDATE usuarios SET nome = ?, email = ? WHERE id = ?", [
    nome,
    email,
    id,
  ]);
}
 
export function deletarUsuario(id: number): void {
  db.runSync("DELETE FROM usuarios WHERE id = ?", [id]);
}
 