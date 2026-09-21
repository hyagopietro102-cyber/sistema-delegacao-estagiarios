import { AppData, User, Atividade, Comentario, Status } from "@/types";

const STORAGE_KEY = "sistema_delegacao_data";

const defaultData: AppData = {
  users: [
    {
      id: "gerente-1",
      nome: "Gerente Principal",
      email: "gerente@empresa.com",
      senha: "gerente123",
      role: "gerente",
    },
  ],
  atividades: [],
};

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function getData(): AppData {
  if (typeof window === "undefined") return defaultData;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultData));
      return defaultData;
    }
    return JSON.parse(raw) as AppData;
  } catch {
    return defaultData;
  }
}

export function saveData(data: AppData): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function login(email: string, senha: string): User | null {
  const data = getData();
  const user = data.users.find((u) => u.email === email && u.senha === senha);
  return user || null;
}

export function cadastrarEstagiario(nome: string, email: string, senha: string): User | null {
  const data = getData();
  if (data.users.some((u) => u.email === email)) return null;
  const novo: User = {
    id: generateId(),
    nome,
    email,
    senha,
    role: "estagiario",
  };
  data.users.push(novo);
  saveData(data);
  return novo;
}

export function listarEstagiarios(): User[] {
  return getData().users.filter((u) => u.role === "estagiario");
}

export function criarAtividade(
  titulo: string,
  descricao: string,
  estagiarioId: string,
  criadaPor: string
): Atividade | null {
  const data = getData();
  const estagiario = data.users.find((u) => u.id === estagiarioId);
  if (!estagiario) return null;
  const agora = new Date().toISOString();
  const atividade: Atividade = {
    id: generateId(),
    titulo,
    descricao,
    estagiarioId,
    estagiarioNome: estagiario.nome,
    status: "pendente",
    criadaPor,
    criadaEm: agora,
    atualizadaEm: agora,
    comentarios: [],
  };
  data.atividades.push(atividade);
  saveData(data);
  return atividade;
}

export function listarAtividades(user: User): Atividade[] {
  const data = getData();
  if (user.role === "gerente") return data.atividades;
  return data.atividades.filter((a) => a.estagiarioId === user.id);
}

export function atualizarStatus(atividadeId: string, status: Status): boolean {
  const data = getData();
  const atv = data.atividades.find((a) => a.id === atividadeId);
  if (!atv) return false;
  atv.status = status;
  atv.atualizadaEm = new Date().toISOString();
  saveData(data);
  return true;
}

export function adicionarComentario(
  atividadeId: string,
  userId: string,
  userNome: string,
  texto: string
): Comentario | null {
  const data = getData();
  const atv = data.atividades.find((a) => a.id === atividadeId);
  if (!atv) return null;
  const comentario: Comentario = {
    id: generateId(),
    userId,
    userNome,
    texto,
    criadoEm: new Date().toISOString(),
  };
  atv.comentarios.push(comentario);
  atv.atualizadaEm = new Date().toISOString();
  saveData(data);
  return comentario;
}

export function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}
