"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { FaUsers, FaCog, FaChartBar, FaSignOutAlt, FaEnvelope, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import axios from "axios";

const AdminSidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Redirect to overview if on root admin path
  React.useEffect(() => {
    if (pathname === "/admin" || pathname === "/admin/") {
      router.replace("/admin/overview");
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

  const settingsItems = [
    { path: "/admin/settings/profile", label: "Profile Settings" },
    { path: "/admin/settings/security", label: "Security" },
  ];

  const bottomMenuItems = [
    { 
      path: "#", 
      icon: isLoggingOut ? <AiOutlineLoading3Quarters className="animate-spin" /> : <FaSignOutAlt />, 
      label: "Logout",
      onClick: handleLogout 
    },
  ];

  return (
    <motion.div
      initial={{ x: -250, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className="min-h-screen bg-white shadow-lg flex flex-col justify-between relative"
    >
      <motion.div 
        className="p-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <motion.div 
          className="flex items-center justify-between mb-4"
          whileHover={{ scale: 1.02 }}
        >
          <h1 className="text-2xl font-bold text-gray-800 tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Admin Panel
          </h1>
        </motion.div>
        <motion.div className="mt-8 space-y-2">
          {menuItems.map((item, index) => (
            <motion.div
              key={item.path}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                href={item.path}
                className={`flex items-center p-3 rounded-lg transition-all duration-300 ${
                  pathname === item.path
                    ? "bg-blue-50 text-blue-600 font-bold shadow-md"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <motion.span 
                  className="text-xl"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  {item.icon}
                </motion.span>
                <span className="ml-3 font-medium">{item.label}</span>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      <motion.div 
        className="p-4 border-t border-gray-200 bg-gray-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <div className="relative mb-4">
          <motion.button
            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`w-full flex items-center justify-between p-3 rounded-lg transition-all duration-200 
              ${pathname.startsWith("/admin/settings") ? "bg-blue-50 text-blue-600 font-bold" : "text-gray-600 hover:bg-gray-50"}`}
          >
            <div className="flex items-center">
              <motion.span 
                className="text-xl"
                animate={{ rotate: isSettingsOpen ? 180 : 0 }}
              >
                <FaCog />
              </motion.span>
              <span className="ml-3 font-medium">Settings</span>
            </div>
            <motion.span 
              className="text-sm"
              animate={{ rotate: isSettingsOpen ? 180 : 0 }}
            >
              {isSettingsOpen ? <FaChevronUp /> : <FaChevronDown />}
            </motion.span>
          </motion.button>
          
          <AnimatePresence>
            {isSettingsOpen && (
              <motion.div 
                className="ml-8 mt-1 space-y-1"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
              >
                {settingsItems.map((item, index) => (
                  <motion.div
                    key={item.path}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      href={item.path}
                      className={`block p-2 rounded-md transition-all duration-200 ${
                        pathname === item.path
                          ? "bg-blue-50 text-blue-600"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {bottomMenuItems.map((item) => (
          item.onClick ? (
            <motion.button
              key={item.path}
              onClick={item.onClick}
              disabled={isLoggingOut}
              whileHover={{ scale: 1.02, x: 10 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full flex items-center p-3 mb-2 rounded-lg transition-all duration-200 
                ${item.label === "Logout" ? "text-red-600 hover:bg-red-50" : "text-gray-600 hover:bg-gray-100"}
                ${isLoggingOut && "opacity-50 cursor-not-allowed"}`}
            >
              <motion.span 
                className="text-xl"
                animate={isLoggingOut ? { rotate: 360 } : {}}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              >
                {item.icon}
              </motion.span>
              <span className="ml-3 font-medium">
                {isLoggingOut ? "Logging out..." : item.label}
              </span>
            </motion.button>
          ) : (
            <motion.div
              key={item.path}
              whileHover={{ scale: 1.02, x: 10 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link
                href={item.path}
                className={`flex items-center p-3 mb-2 rounded-lg transition-all duration-200 
                  ${pathname === item.path ? "bg-blue-50 text-blue-600 font-bold" : "text-gray-600 hover:bg-gray-100"}`}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="ml-3 font-medium">{item.label}</span>
              </Link>
            </motion.div>
          )
        ))}
      </motion.div>
    </motion.div>
  );
};

export default AdminSidebar;
