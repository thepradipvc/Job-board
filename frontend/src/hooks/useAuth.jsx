import { getMe } from "@/actions/auth";
import { useQuery } from "@tanstack/react-query";
import {
  createContext,
  useContext
} from "react";

const AuthContext = createContext(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({
  children,
}) => {
  const { data, isPending: isLoading } = useQuery({
    queryKey: ["authStatus"],
    queryFn: getMe,
    staleTime: 1000 * 30,
    retry: false,
  });

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!data?.isLoggedIn,
        isLoading,
        user: data?.user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
