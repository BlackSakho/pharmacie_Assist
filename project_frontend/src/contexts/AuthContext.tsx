import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-hot-toast";
import api from "../services/api";

export type UserRole = "admin" | "pharmacien";

export interface User {
  id: string;
  email: string;
  nom: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    name: string,
    role: UserRole
  ) => Promise<void>;
  logout: () => void;
  hasRole: (roles: UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decoded = jwtDecode<User & { exp: number }>(token);

        if (decoded.exp < Date.now() / 1000) {
          localStorage.removeItem("token");
          setUser(null);
        } else {
          setUser({
            id: decoded.id,
            email: decoded.email,
            nom: decoded.nom,
            role: decoded.role,
          });
        }
      } catch (error) {
        localStorage.removeItem("token");
        setUser(null);
      }
    }

    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const { data } = await api.post("/auth/login", { email, password });
      const { token, user } = data;

      localStorage.setItem("token", token);
      setUser(user);
      console.log("Utilisateur connecté :", user);
      toast.success("Connexion réussie !");
    } catch (error) {
      toast.error("Échec de la connexion. Veuillez vérifier vos identifiants.");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (
    email: string,
    password: string,
    nom: string,
    role: UserRole
  ) => {
    try {
      setIsLoading(true);
      const { data } = await api.post("/auth/register", {
        email,
        password,
        nom,
        role,
      });
      const { token, user } = data;

      localStorage.setItem("token", token);
      setUser(user);
      toast.success("Inscription réussie !");
    } catch (error) {
      toast.error("Échec de l'inscription. Veuillez réessayer.");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    toast.success("Déconnexion réussie");
  };

  const hasRole = (roles: UserRole[]) => {
    if (!user) return false;
    return roles.includes(user.role);
  };

  return (
    <AuthContext.Provider
      value={{ user, isLoading, login, register, logout, hasRole }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
