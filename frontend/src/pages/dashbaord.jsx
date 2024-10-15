import React from "react";
import { useAuth } from "../hooks/useAuth";
import { Outlet, Navigate, Link, useLocation } from "react-router-dom";
import Layout from "@/components/layout";
import { CircularProgress } from "@nextui-org/react";

const Dashboard = () => {
  const { user, isLoading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen grid place-items-center">
        <CircularProgress aria-label="Loading..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/sign-in" replace />;
  }

  if (location.pathname === "/dashboard") {
    if (user.role === "admin") {
      return <Navigate to="/dashboard/stats" replace />;
    }
    if (user.role === "student") {
      return <Navigate to="/dashboard/my-applications" replace />;
    }
    if (user.role === "company") {
      return <Navigate to="/dashboard/my-jobs" replace />;
    }
  }

  return (
    <Layout>
      <Outlet />
    </Layout>
  );
};

export default Dashboard;
