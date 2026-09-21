export type Role = "gerente" | "estagiario";

export type Status = "pendente" | "em_andamento" | "concluida";

export interface User {
  id: string;
  nome: string;
  email: string;
  senha: string;
  role: Role;
}

export interface Comentario {
  id: string;
  userId: string;
  userNome: string;
  texto: string;
  criadoEm: string;
}

export interface Atividade {
  id: string;
  titulo: string;
  descricao: string;
  estagiarioId: string;
  estagiarioNome: string;
  status: Status;
  criadaPor: string;
  criadaEm: string;
  atualizadaEm: string;
  comentarios: Comentario[];
}

export interface AppData {
  users: User[];
  atividades: Atividade[];
}
