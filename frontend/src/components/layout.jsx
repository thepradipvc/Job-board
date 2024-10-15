import { Link, useLocation, useNavigate } from "react-router-dom";
import { IconBriefCase } from "@/assets/icons";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  User,
} from "@nextui-org/react";
import {
  IconBarChart,
  IconBuildings,
  IconFile,
  IconFileLike,
  IconUsers,
} from "../assets/icons";
import { useAuth } from "../hooks/useAuth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logout } from "../api/auth";
import { toast } from "sonner";
import logo from "@/assets/logo.png";

const Layout = ({ children }) => {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-end border-b shadow-sm h-20 min-h-20 pr-8">
          <UserDropDown />
        </header>

        <main className="p-10 min-h-[calc(100vh-80px)] overflow-y-scroll">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;

const UserDropDown = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.clear();
      toast.success("Logged out successfully");
      navigate("/sign-in");
    },
    onError: () => {
      toast.error("Failed to log out");
    },
  });

  return (
    <div className="flex items-center gap-4">
      <Dropdown placement="bottom-end">
        <DropdownTrigger>
          <User
            as="button"
            avatarProps={{
              isBordered: true,
              fallback: user.name
                .split(" ")
                .map((n) => n[0])
                .join(""),
            }}
            className="transition-transform"
            description={user.email}
            name={user.name}
          />
        </DropdownTrigger>
        <DropdownMenu aria-label="User Actions" variant="flat">
          <DropdownItem key="profile" className="h-14 gap-2">
            <p className="font-bold">Signed in as</p>
            <p className="font-bold">{user.email}</p>
          </DropdownItem>
          <DropdownItem key="help_and_feedback">
            <Link to="/dashboard/profile">Profile</Link>
          </DropdownItem>
          <DropdownItem
            key="logout"
            color="danger"
            onClick={() => logoutMutation.mutate()}
          >
            Log Out
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  );
};

const studentLinks = [
  {
    title: "My Applications",
    href: "/dashboard/my-applications",
    icon: IconFile,
  },
  {
    title: "Available Jobs",
    href: "/dashboard/available-jobs",
    icon: IconBriefCase,
  },
];

const companyLinks = [
  {
    title: "My Job Openings",
    href: "/dashboard/my-jobs",
    icon: IconBriefCase,
  },
  {
    title: "Manage Applications",
    href: "/dashboard/manage-applications",
    icon: IconFileLike,
  },
];

const adminLinks = [
  {
    title: "Placement Stats",
    href: "/dashboard/stats",
    icon: IconBarChart,
  },
  {
    title: "Manage Students",
    href: "/dashboard/manage-students",
    icon: IconUsers,
  },
  {
    title: "Manage Companies",
    href: "/dashboard/manage-companies",
    icon: IconBuildings,
  },
];

const Sidebar = () => {
  const location = useLocation();
  const { user } = useAuth();
  const links =
    user.role === "student"
      ? studentLinks
      : user.role === "company"
        ? companyLinks
        : adminLinks;

  return (
    <div className="w-64 shadow-md">
      <div className="p-8 px-4 border-b h-20 flex items-center">
        <img className="w-full max-w-full mr-20 rounded-md" src={logo}></img>
      </div>
      <nav className="mt-4 px-4 space-y-2">
        {links.map((link) => (
          <Link
            key={link.href}
            to={link.href}
            className={`flex items-center py-2 rounded-md px-4 text-gray-700 hover:bg-gray-200 " ${
              location.pathname === link.href &&
              "bg-primary text-white hover:bg-primary"
            }
            )`}
          >
            <link.icon className="h-5 w-5" />
            <span className="mx-2">{link.title}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
};
