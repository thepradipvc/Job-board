import { Link, useLocation } from "react-router-dom";
import { IconBriefcaseFilled, IconFileFilled } from "@tabler/icons-react";

const Layout = ({ children }) => {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="py-4 px-8 border-b shadow-sm">
          <div className="ml-auto w-max">
            <UserDropDown />
          </div>
        </header>

        <main className="p-10">{children}</main>
      </div>
    </div>
  );
};

export default Layout;

import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  User,
} from "@nextui-org/react";

const UserDropDown = () => {
  return (
    <div className="flex items-center gap-4">
      <Dropdown placement="bottom-end">
        <DropdownTrigger>
          <User
            as="button"
            avatarProps={{
              isBordered: true,
              fallback: "TR",
            }}
            className="transition-transform"
            description="@tonyreichert"
            name="Tony Reichert"
          />
        </DropdownTrigger>
        <DropdownMenu aria-label="User Actions" variant="flat">
          <DropdownItem key="profile" className="h-14 gap-2">
            <p className="font-bold">Signed in as</p>
            <p className="font-bold">@tonyreichert</p>
          </DropdownItem>
          <DropdownItem key="help_and_feedback">
            <Link to="/profile">Profile</Link>
          </DropdownItem>
          <DropdownItem key="logout" color="danger">
            Log Out
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  );
};

const links = [
  {
    title: "My Applications",
    href: "/dashbaord/my-applications",
    icon: IconFileFilled,
  },
  {
    title: "Available Jobs",
    href: "/dashboard/available-jobs",
    icon: IconBriefcaseFilled,
  },
];

const Sidebar = () => {
  const location = useLocation();

  return (
    <div className="w-60 shadow-md">
      <div className="p-4 px-8">
        <h3 className="text-3xl font-semibold">CPS</h3>
      </div>
      <nav className="mt-4 px-4 space-y-2">
        {links.map((link) => (
          <Link
            key={link.href}
            to={link.href}
            className={`flex items-center py-2 rounded-md px-4 text-gray-700 hover:bg-gray-200" ${
              location === link.href && "bg-gray-200"
            }
            )`}
          >
            <link.icon size={24} />
            <span className="mx-4">{link.title}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
};
