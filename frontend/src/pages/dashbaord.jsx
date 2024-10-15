import React from "react";
import { Outlet, Navigate, Link, useLocation } from "react-router-dom";
import Layout from "@/components/layout";
import { CircularProgress } from "@nextui-org/react";
import { useQuery } from "@tanstack/react-query";
import { getMe } from "../api/auth";

const Dashboard = () => {
  const { data, isPending } = useQuery({
    queryFn: getMe,
    queryKey: ["me"],
  });
  const location = useLocation();

  if (isPending) {
    return (
      <div className="min-h-screen grid place-items-center">
        <CircularProgress aria-label="Loading..." />
      </div>
    );
  }

  const { isLoggedIn: isAuthenticated, user } = data;

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
