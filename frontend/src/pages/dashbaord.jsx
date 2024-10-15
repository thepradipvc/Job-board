import React from "react";
import { useAuth } from "../hooks/useAuth";
import { Outlet, Navigate, Link } from "react-router-dom";
import Layout from "@/components/layout";

const Dashboard = () => {
  // const { user } = useAuth();

  // if (!user) {
  //   return <Navigate to="/sign-in" replace />;
  // }

  // const renderDashboard = () => {
  //   switch (user.role) {
  //     case "student":
  //       return <StudentDashboard />;
  //     case "company":
  //       return <StudentDashboard />;
  //     case "admin":
  //       return <StudentDashboard />;
  //     default:
  //       return <div>Invalid user role</div>;
  //   }
  // };

  return (
    <Layout>
      <h1>Welcome to your dashboard, Bro</h1>
      {/* {renderDashboard()} */}
      <Outlet />
    </Layout>
  );
};

export default Dashboard;

const StudentDashboard = () => {
  return (
    <div>
      <h2>Student Dashboard</h2>
      <nav>
        <ul>
          <li>
            <Link to="/dashboard/profile">My Profile</Link>
          </li>
          <li>
            <Link to="/dashboard/jobs">Job Listings</Link>
          </li>
          <li>
            <Link to="/dashboard/applications">My Applications</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};
