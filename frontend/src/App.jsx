import { NextUIProvider } from "@nextui-org/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "sonner";
import ErrorPage from "./error-page";
import AvailableJobs from "./pages/available-jobs";
import Dashboard from "./pages/dashbaord";
import Home from "./pages/Home";
import ManageApplications from "./pages/manage-applications";
import ManageCompanies from "./pages/manage-companies";
import ManageStudents from "./pages/manage-students";
import MyApplications from "./pages/my-applications";
import MyJobs from "./pages/my-jobs";
import Profile from "./pages/profile";
import SignIn from "./pages/sign-in";
import Signup from "./pages/sign-up";
import Stats from "./pages/stats";

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
      { path: "/dashboard/profile", element: <Profile /> },
      // Student routes
      { path: "/dashboard/my-applications", element: <MyApplications /> },
      { path: "/dashboard/available-jobs", element: <AvailableJobs /> },
      // Company routes
      { path: "/dashboard/my-jobs", element: <MyJobs /> },
      {
        path: "/dashboard/manage-applications",
        element: <ManageApplications />,
      },
      // Admin routes
      { path: "/dashboard/stats", element: <Stats /> },
      { path: "/dashboard/manage-students", element: <ManageStudents /> },
      { path: "/dashboard/manage-companies", element: <ManageCompanies /> },
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
        <RouterProvider router={router} />
        <Toaster position="bottom-center" richColors />
      </QueryClientProvider>
    </NextUIProvider>
  );
};

export default Router;
