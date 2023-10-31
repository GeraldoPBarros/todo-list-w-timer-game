import {
  createContext,
  ReactNode,
  useState,
  useEffect,
  useContext,
} from "react";
import Router from "next/router";
import { setCookie, destroyCookie } from "nookies";

import { signInWithEmailAndPassword } from "firebase/auth";

import { auth } from "../services/fire";
import { useToast } from "@chakra-ui/react";

type User = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  team: {
    id: string;
    name: string;
  };
  permissions: string[];
  roles: string[];
};

type SignInCredentials = {
  email: string;
  password: string;
};

type AuthContextData = {
  signIn(credentials: SignInCredentials): Promise<void>;
  signOut: () => void;
  user: User;
  isAuthenticated: boolean;
};

type AuthProviderProps = {
  children: ReactNode;
};

export function signOut() {
  destroyCookie(undefined, "todo-list.token");

  // authChannel.postMessage("signOut");
  auth.signOut();
  Router.push("/");
}

export const AuthContext = createContext({} as AuthContextData);

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<any>(null);
  const isAuthenticated = !!user;
  const toast = useToast();

  useEffect(() => {
    auth.onAuthStateChanged((user: any) => {
      if (user) {
        setUser((prev: any) => ({ ...prev, email: user?.email }));
      } else {
        setUser(null);
      }
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth?.currentUser]);

  function signOut() {
    destroyCookie(undefined, "cda.token");

    // authChannel.postMessage("signOut");
    auth.signOut();
    Router.push("/");
  }

  async function signIn({ email, password }: SignInCredentials) {
    try {
      try {
        const user = await signInWithEmailAndPassword(auth, email, password);
        const token = await user.user.getIdToken();
        setUser((prev: any) => ({ ...prev, email: user.user.email }));

        setCookie(undefined, "todo-list.token", token, {
          maxAge: 60 * 60 * 24 * 30, // 30 days
          path: "/",
        });
        Router.push("/home");
      } catch (err) {
        console.log("ERROR: ", err);
        toast({
          position: "top",
          title: "Error! Invalid credentials.",
          status: "error",
          containerStyle: {
            width: "400px",
          },
        });
      }
    } catch (err) {}
  }

  return (
    <AuthContext.Provider
      value={{
        signIn,
        signOut,
        isAuthenticated,
        user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within a AuthProvider");
  }

  return context;
};
