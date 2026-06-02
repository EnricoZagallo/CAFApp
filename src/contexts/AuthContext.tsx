import { Session, User } from "@supabase/supabase-js";
import { useRouter } from "expo-router";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { supabase } from "../lib/supabase";
import { Profile } from "../types";

interface AuthContextData {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  initialized: boolean;
  signIn: (
    email: string,
    password: string,
  ) => Promise<{ error: string | null }>;
  signUp: (
    email: string,
    password: string,
    nome: string,
  ) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: string | null }>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);

  const router = useRouter();

  async function fetchProfile(userId: string) {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Erro ao buscar perfil:", error.message);
        return;
      }
      setProfile(data as Profile);
    } catch (err) {
      console.error("Erro inesperado:", err);
    }
  }

  async function refreshProfile() {
    if (user) {
      await fetchProfile(user.id);
    }
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      }
      setInitialized(true);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          fetchProfile(session.user.id);
        } else {
          setProfile(null);
        }
      },
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  async function signIn(
    email: string,
    password: string,
  ): Promise<{ error: string | null }> {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        if (error.message.includes("Invalid login credentials")) {
          return { error: "Email ou senha incorretos." };
        }
        if (error.message.includes("Email not confirmed")) {
          return { error: "Confirme seu email antes de entrar." };
        }
        return { error: error.message };
      }

      router.replace("/(tabs)/home");
      return { error: null };
    } catch {
      return { error: "Erro inesperado. Tente novamente." };
    } finally {
      setLoading(false);
    }
  }

  async function signUp(
    email: string,
    password: string,
    nome: string,
  ): Promise<{ error: string | null }> {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: { nome },
        },
      });

      if (error) {
        if (error.message.includes("already registered")) {
          return { error: "Este email já está cadastrado." };
        }
        if (error.message.includes("Password should be at least")) {
          return { error: "A senha deve ter pelo menos 6 caracteres." };
        }
        return { error: error.message };
      }

      return { error: null };
    } catch {
      return { error: "Erro inesperado. Tente novamente." };
    } finally {
      setLoading(false);
    }
  }

  async function signOut() {
    setLoading(true);
    try {
      await supabase.auth.signOut();
      setProfile(null);
      router.replace("/(auth)/login");
    } finally {
      setLoading(false);
    }
  }

  async function resetPassword(
    email: string,
  ): Promise<{ error: string | null }> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim());
      if (error) return { error: error.message };
      return { error: null };
    } catch {
      return { error: "Erro inesperado. Tente novamente." };
    }
  }

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        profile,
        loading,
        initialized,
        signIn,
        signUp,
        signOut,
        resetPassword,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider");
  }
  return context;
}
