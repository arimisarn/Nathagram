// src/components/layout/Sidebar.tsx
import React from "react";
import { NavLink } from "react-router-dom";
import {
  ViewGridIcon,
  UserGroupIcon,
  BookmarkIcon,
  VideoCameraIcon,
} from "@heroicons/react/outline";

const Sidebar: React.FC = () => {
  const menuItems = [
    { name: "Accueil", to: "/", icon: ViewGridIcon },
    { name: "Abonnés", to: "/followers", icon: UserGroupIcon },
    { name: "Enregistrés", to: "/saved", icon: BookmarkIcon },
    { name: "Vidéos", to: "/videos", icon: VideoCameraIcon },
  ];

  return (
    <aside className="fixed top-0 left-0 h-full w-72 bg-blue-600 text-white p-6 flex flex-col">
      <div className="text-2xl font-bold mb-10">Mon App</div>
      <nav className="flex-1">
        <ul className="space-y-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.name}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-2 rounded hover:bg-blue-500 transition ${
                      isActive ? "bg-blue-700 font-semibold" : ""
                    }`
                  }
                >
                  <Icon className="w-6 h-6" />
                  <span>{item.name}</span>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="mt-auto text-sm opacity-70">&copy; 2025 Mon App</div>
    </aside>
  );
};

export default Sidebar;
