export interface Profile {
  id: string;
  nome: string | null;
  numero_socio: string | null;
  situacao: string | null;
  categoria: string | null;
  membro_desde: string | null;
  validade: string | null;
  avatar_url: string | null;
  is_admin: boolean;
  created_at: string | null;
  updated_at: string | null;
}

export interface Evento {
  id: string;
  titulo: string;
  descricao: string | null;
  data: string;
  horario: string;
  local: string;
  endereco: string | null;
  categoria: string;
  vagas: number | null;
  imagem_url: string | null;
  criado_por: string | null;
  created_at: string | null;
  updated_at: string | null;
}
