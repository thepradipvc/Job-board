import { getMe } from "@/api/auth";
import { AuthContext } from "@/hooks/useAuth";
import { NextUIProvider } from "@nextui-org/react";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "sonner";
import ErrorPage from "./error-page";
import Dashboard from "./pages/dashbaord";
import Home from "./pages/Home";
import SignIn from "./pages/sign-in";
import Signup from "./pages/sign-up";

const MyApplications = () => {
  return <div>My Applications</div>;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
    errorElement: <ErrorPage />,
    children: [
      // Student routes
      // { path: "profile", element: <StudentProfile /> },
      { path: "/dashbaord/my-applications", element: <MyApplications /> },
      //   { path: "jobs", element: <JobListings /> },
      //   // Company routes
      //   { path: "company-profile", element: <CompanyProfile /> },
      //   { path: "post-job", element: <PostJob /> },
      //   { path: "manage-applications", element: <ManageApplications /> },
      //   // Admin routes
      //   { path: "manage-users", element: <ManageUsers /> },
      //   { path: "manage-jobs", element: <ManageJobs /> },
      //   { path: "statistics", element: <Statistics /> },
    ],
  },
  {
    path: "/sign-in",
    element: <SignIn />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/sign-up",
    element: <Signup />,
    errorElement: <ErrorPage />,
  },
]);

const queryClient = new QueryClient();

const Router = () => {
  return (
    <NextUIProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
        <Toaster position="bottom-center" richColors />
      </QueryClientProvider>
    </NextUIProvider>
  );
};

export default Router;

const AuthProvider = ({ children }) => {
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
