"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FaUsers, FaCog, FaChartBar, FaSignOutAlt, FaEnvelope } from "react-icons/fa";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import axios from "axios";

const AdminSidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Redirect to overview if on root admin path
  React.useEffect(() => {
    if (pathname === "/admin") {
      router.push("/admin/overview");
    }
  }, [pathname, router]);

  const menuItems = [
    { path: "/admin/overview", icon: <FaChartBar />, label: "Overview" },
    { path: "/admin/users", icon: <FaUsers />, label: "Users" },
    { path: "/admin/message", icon: <FaEnvelope />, label: "Messages" },
  ];

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      // Delete all cookies by setting expired date
      document.cookie.split(";").forEach((cookie) => {
        document.cookie = cookie
          .replace(/^ +/, "")
          .replace(/=.*/, `=;expires=${new Date(0).toUTCString()};path=/`);
      });

      // Call logout API endpoint using axios
      const response = await axios.post('/api/admin/logout', {}, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.status === 200) {
        // Clear session and local storage
        sessionStorage.clear();
        localStorage.clear();
        
        // Redirect to login
        router.push('/admin-login');
        // Force a full page reload to clear any remaining state
        router.refresh();
      } else {
        throw new Error('Logout failed');
      }
    } catch (error) {
      console.error('Logout error:', error);
      // Show error message to user
      alert('Failed to logout. Please try again.');
    } finally {
      setIsLoggingOut(false);
    }
  };

  const bottomMenuItems = [
    { path: "/admin/settings", icon: <FaCog />, label: "Settings" },
    { 
      path: "#", 
      icon: isLoggingOut ? <AiOutlineLoading3Quarters className="animate-spin" /> : <FaSignOutAlt />, 
      label: "Logout",
      onClick: handleLogout 
    },
  ];

  return (
    <motion.div
      initial={{ width: 250 }}
      animate={{ width: isCollapsed ? 80 : 250 }}
      className="min-h-screen bg-white shadow-lg flex flex-col justify-between"
    >
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          {!isCollapsed && (
            <h1 className="text-2xl font-bold text-gray-800 tracking-tight"></h1>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={`text-gray-500 hover:text-gray-700 font-bold ${isCollapsed ? 'w-full text-center' : ''}`}
          >
            {isCollapsed ? "→" : "←"}
          </button>
        </div>
        <div className="mt-8 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center p-3 rounded-lg transition-all duration-200 ${
                pathname === item.path
                  ? "bg-blue-50 text-blue-600 font-bold"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              {!isCollapsed && (
                <span className="ml-3 font-medium">{item.label}</span>
              )}
            </Link>
          ))}
        </div>
      </div>
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        {bottomMenuItems.map((item) => (
          item.onClick ? (
            <button
              key={item.path}
              onClick={item.onClick}
              disabled={isLoggingOut}
              className={`w-full flex items-center p-3 mb-2 rounded-lg transition-all duration-200 
                ${item.label === "Logout" ? "text-red-600 hover:bg-red-50" : "text-gray-600 hover:bg-gray-100"}
                ${!isCollapsed && "hover:translate-x-1"}
                ${isLoggingOut && "opacity-50 cursor-not-allowed"}`}
            >
              <span className="text-xl">
                {item.icon}
              </span>
              {!isCollapsed && (
                <span className="ml-3 font-medium">
                  {isLoggingOut ? "Logging out..." : item.label}
                </span>
              )}
            </button>
          ) : (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center p-3 mb-2 rounded-lg transition-all duration-200 
                ${pathname === item.path ? "bg-blue-50 text-blue-600 font-bold" : "text-gray-600 hover:bg-gray-100"}
                ${!isCollapsed && "hover:translate-x-1"}`}
            >
              <span className="text-xl">{item.icon}</span>
              {!isCollapsed && (
                <span className="ml-3 font-medium">{item.label}</span>
              )}
            </Link>
          )
        ))}
      </div>
    </motion.div>
  );
};

export default AdminSidebar;
