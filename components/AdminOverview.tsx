"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { FaUsers, FaEnvelope, FaUser } from "react-icons/fa";
import AdminDashboard from "./AdminSidebar";

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  gradient: string;
}

const StatCard = ({ title, value, icon, color, gradient }: StatCardProps) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    className={`bg-white rounded-xl shadow-lg p-8 ${color} transition-all duration-300 relative overflow-hidden`}
  >
    <div className={`absolute inset-0 opacity-10 ${gradient}`} />
    <div className="flex items-center justify-between relative">
      <div>
        <p className="text-gray-600 text-sm font-medium tracking-wide uppercase">{title}</p>
        <h3 className="text-3xl font-bold mt-2 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
          {value.toLocaleString()}
        </h3>
      </div>
      <div className={`text-3xl ${color.replace('shadow', 'text')}`}>{icon}</div>
    </div>
  </motion.div>
);

const AdminOverview = () => {
  const [adminCount, setAdminCount] = useState(0);
  const [contactCount, setContactCount] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [adminResponse, contactResponse, userResponse] = await Promise.all([
          axios.get("/api/admin/count"),
          axios.get("/api/users/contact/count"),
          axios.get("/api/users/count")
        ]);

        setAdminCount(adminResponse.data.count);
        setContactCount(contactResponse.data.count);
        setUserCount(userResponse.data.count);
      } catch (err) {
        setError("Failed to fetch dashboard data");
        console.error("Error fetching data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const mainContent = () => {
    if (isLoading) {
      return (
        <div className="flex-1 p-8 flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
          />
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex-1 p-8 flex items-center justify-center">
          <div className="text-red-500 bg-red-50 px-6 py-4 rounded-lg shadow-sm border border-red-100">
            <p className="font-medium">{error}</p>
          </div>
        </div>
      );
    }

    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex-1 p-8"
      >
        <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
          Dashboard Overview
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <StatCard
            title="Total Users"
            value={userCount}
            icon={<FaUser />}
            color="hover:shadow-purple-200"
            gradient="bg-gradient-to-br from-purple-500 to-purple-600"
          />
          <StatCard
            title="Total Admins"
            value={adminCount}
            icon={<FaUsers />}
            color="hover:shadow-blue-200"
            gradient="bg-gradient-to-br from-blue-500 to-blue-600"
          />
          <StatCard
            title="Contact Form Submissions"
            value={contactCount}
            icon={<FaEnvelope />}
            color="hover:shadow-emerald-200"
            gradient="bg-gradient-to-br from-emerald-500 to-emerald-600"
          />
        </div>
      </motion.div>
    );
  };

  return (
    <div className="flex">
      <AdminDashboard />
      {mainContent()}
    </div>
  );
};

export default AdminOverview;