import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from 'sonner'
import Home from "./pages/Home";
import ErrorPage from "./error-page";
import SignIn from "./pages/sign-in";
import Signup from "./pages/sign-up";
import Dashbaord from "./pages/dashbaord";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/dashboard",
    element: <Dashbaord />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/sign-in",
    element: <SignIn />,
    errorElement: <ErrorPage />
  },
  {
    path: "/sign-up",
    element: <Signup />,
    errorElement: <ErrorPage />
  },
]);

const queryClient = new QueryClient();

const Router = () => {
  return (
    <QueryClientProvider client={queryClient}>
      {/* // <AuthProvider> */}
        <RouterProvider router={router} />
      {/* // </AuthProvider> */}
      <Toaster position="bottom-center" richColors />
    </QueryClientProvider>
  );
};

export default Router;
