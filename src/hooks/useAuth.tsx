import { useState, useEffect, useContext, createContext } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface Profile {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  foto_url: string;
  is_prestador: boolean;
  is_admin: boolean;
  cidade: string;
  estado: string;
  bio: string;
  // Adicione outros campos conforme necessário
}

interface AuthContextType {
  user: any | null;
  profile: Profile | null;
  session: any | null;
  isAuthenticated: boolean;
  loading: boolean;
  isPrestador: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, nome: string, telefone: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<any | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [isPrestador, setIsPrestador] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const loadSession = async () => {
      try {
        setLoading(true);
        const { data: { session } } = await supabase.auth.getSession();

        setSession(session);
        setUser(session?.user ?? null);
        setIsAuthenticated(!!session?.user);

        if (session?.user) {
          await fetchProfile(session.user.id);
        }
      } catch (error) {
        console.error("Erro ao carregar a sessão:", error);
      } finally {
        setLoading(false);
      }
    };

    loadSession();

    supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsAuthenticated(!!session?.user);

      if (session?.user) {
        await fetchProfile(session.user.id);
      } else {
        setProfile(null);
        setIsPrestador(false);
        setIsAdmin(false);
      }
    });
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError) {
        console.error("Erro ao buscar o perfil:", profileError);
        // toast({
        //   title: 'Erro ao carregar perfil',
        //   description: 'Por favor, tente novamente.',
        //   variant: 'destructive',
        // });
        return;
      }

      if (profileData) {
        const typedProfile: Profile = {
          id: profileData.id,
          nome: profileData.nome,
          email: profileData.email,
          telefone: profileData.telefone,
          foto_url: profileData.foto_url,
          is_prestador: profileData.is_prestador,
          is_admin: profileData.is_admin,
          cidade: profileData.cidade,
          estado: profileData.estado,
          bio: profileData.bio,
        };
        setProfile(typedProfile);
        setIsPrestador(profileData.is_prestador);
        setIsAdmin(profileData.is_admin);
      }
    } catch (error) {
      console.error("Erro ao processar dados do perfil:", error);
      // toast({
      //   title: 'Erro ao processar perfil',
      //   description: 'Tente novamente mais tarde.',
      //   variant: 'destructive',
      // });
    }
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) {
        console.error("Erro ao fazer login:", error.message);
        toast.error(error.message || 'Credenciais inválidas.');
      } else {
        setUser(data.user);
        setSession(data.session);
        setIsAuthenticated(true);
        await fetchProfile(data.user?.id);

        // Redireciona com base no tipo de usuário
        if (isPrestador) {
          navigate('/dashboard');
        } else {
          navigate('/');
        }
      }
    } catch (error) {
      console.error("Erro durante o login:", error);
      toast.error('Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, nome: string, telefone: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            nome: nome,
            telefone: telefone,
          },
        },
      });

      if (error) {
        console.error("Erro ao registrar:", error.message);
        toast.error(error.message || 'Por favor, tente novamente.');
      } else {
        setUser(data.user);
        setSession(data.session);
        setIsAuthenticated(true);

        // Cria um perfil padrão para o usuário
        await supabase.from('profiles').insert([
          {
            id: data.user?.id,
            nome: nome,
            email: email,
            telefone: telefone,
            foto_url: '',
            is_prestador: false,
            is_admin: false,
            cidade: '',
            estado: '',
            bio: '',
          },
        ]);

        toast.success('Sua conta foi criada com sucesso!');
        navigate('/');
      }
    } catch (error) {
      console.error("Erro durante o registro:", error);
      toast.error('Por favor, tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Erro ao fazer logout:", error.message);
        toast.error('Não foi possível encerrar a sessão.');
      } else {
        setUser(null);
        setProfile(null);
        setSession(null);
        setIsAuthenticated(false);
        setIsPrestador(false);
        setIsAdmin(false);
        navigate('/auth');
      }
    } catch (error) {
      console.error("Erro durante o logout:", error);
      toast.error('Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user?.id)
        .select()
        .single();

      if (error) {
        console.error("Erro ao atualizar o perfil:", error);
        toast.error(error.message || 'Por favor, tente novamente.');
      } else if (data) {
        const typedProfile: Profile = {
          id: data.id,
          nome: data.nome,
          email: data.email,
          telefone: data.telefone,
          foto_url: data.foto_url,
          is_prestador: data.is_prestador,
          is_admin: data.is_admin,
          cidade: data.cidade,
          estado: data.estado,
          bio: data.bio,
        };
        setProfile(typedProfile);
        toast.success('Seu perfil foi atualizado com sucesso!');
      }
    } catch (error) {
      console.error("Erro ao atualizar o perfil:", error);
      toast.error('Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  const refreshProfile = async () => {
    if (user?.id) {
      await fetchProfile(user.id);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      session,
      isAuthenticated,
      loading,
      isPrestador,
      isAdmin,
      login,
      register,
      logout,
      updateProfile,
      refreshProfile
    }}>
      {children}
      {/* No Toaster here - moved to App.tsx */}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};
