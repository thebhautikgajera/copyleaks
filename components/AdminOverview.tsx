"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { FaUsers, FaEnvelope, FaUser, FaStar, FaCheckCircle } from "react-icons/fa";
import AdminSidebar from "./AdminSidebar";

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  gradient: string;
  delay?: number;
}

const StatCard = ({ title, value, icon, color, gradient, delay = 0 }: StatCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 50, rotateX: -90 }}
    animate={{ opacity: 1, y: 0, rotateX: 0 }}
    transition={{ 
      duration: 0.8,
      delay,
      type: "spring",
      stiffness: 100,
      damping: 15
    }}
    whileHover={{ 
      scale: 1.05,
      rotate: [0, 2, -2, 0],
      transition: { duration: 0.5 }
    }}
    whileTap={{ scale: 0.95 }}
    className={`bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 ${color} transition-all duration-500 relative overflow-hidden group transform-gpu`}
  >
    <motion.div 
      className={`absolute inset-0 ${gradient}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.2 }}
      transition={{ duration: 0.5 }}
      whileHover={{ opacity: 0.3 }}
    />
    <div className="flex items-center justify-between relative">
      <motion.div 
        className="space-y-3"
        initial={{ x: -20 }}
        animate={{ x: 0 }}
        transition={{ delay: delay + 0.2 }}
      >
        <motion.p 
          className="text-gray-600 text-sm font-semibold tracking-wider uppercase"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: delay + 0.3 }}
        >
          {title}
        </motion.p>
        <motion.h3 
          className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-gray-700 to-gray-800 bg-clip-text text-transparent"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: delay + 0.4, type: "spring" }}
        >
          {value.toLocaleString()}
        </motion.h3>
      </motion.div>
      <motion.div
        className={`text-4xl ${color.replace('shadow', 'text')}`}
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: delay + 0.5, type: "spring" }}
        whileHover={{ 
          scale: 1.2,
          rotate: 360,
          transition: { duration: 0.8, type: "spring" }
        }}
      >
        {icon}
      </motion.div>
    </div>
  </motion.div>
);

const AdminOverview = () => {
  const [adminCount, setAdminCount] = useState(0);
  const [contactCount, setContactCount] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const [starredCount, setStarredCount] = useState(0);
  const [readCount, setReadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [adminResponse, contactResponse, userResponse, starredResponse, readResponse] = await Promise.all([
          axios.get("/api/admin/count"),
          axios.get("/api/users/contact/count"),
          axios.get("/api/users/count"),
          axios.get("/api/users/contact/starred/count"),
          axios.get("/api/users/contact/read/count")
        ]);

        setAdminCount(adminResponse.data.count);
        setContactCount(contactResponse.data.count);
        setUserCount(userResponse.data.count);
        setStarredCount(starredResponse.data.count || 0);
        setReadCount(readResponse.data.count || 0);
      } catch (err) {
        setError("Failed to fetch dashboard data");
        console.error("Error fetching data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <AdminSidebar />
        <div className="flex-grow p-6">
          <div className="flex justify-center items-center h-full">
            <motion.div 
              className="rounded-full h-16 w-16 border-4 border-gray-900/20 border-t-gray-900"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex bg-gradient-to-br from-gray-50 to-gray-100">
        <AdminSidebar />
        <div className="flex-1 p-8 flex items-center justify-center">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 100 }}
            className="text-red-500 bg-red-50 px-8 py-6 rounded-xl shadow-lg border-2 border-red-100"
          >
            <motion.p 
              className="font-semibold text-lg"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              {error}
            </motion.p>
          </motion.div>
        </div>
      </div>
    );
  }

  const stats = [
    {
      title: "Total Users",
      value: userCount,
      icon: <FaUser />,
      color: "hover:shadow-purple-300",
      gradient: "bg-gradient-to-br from-purple-600 to-purple-700"
    },
    {
      title: "Total Admins",
      value: adminCount,
      icon: <FaUsers />,
      color: "hover:shadow-blue-300",
      gradient: "bg-gradient-to-br from-blue-600 to-blue-700"
    },
    {
      title: "Contact Forms",
      value: contactCount,
      icon: <FaEnvelope />,
      color: "hover:shadow-emerald-300",
      gradient: "bg-gradient-to-br from-emerald-600 to-emerald-700"
    },
    {
      title: "Starred Messages",
      value: starredCount,
      icon: <FaStar />,
      color: "hover:shadow-amber-300",
      gradient: "bg-gradient-to-br from-amber-600 to-amber-700"
    },
    {
      title: "Read Messages",
      value: readCount,
      icon: <FaCheckCircle />,
      color: "hover:shadow-green-300",
      gradient: "bg-gradient-to-br from-green-600 to-green-700"
    }
  ];

  return (
    <div className="flex bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <AdminSidebar />
      <motion.div 
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, type: "spring" }}
        className="flex-1 p-10"
      >
        <motion.h2 
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, type: "spring" }}
          className="text-4xl font-bold mb-12 bg-gradient-to-r from-gray-900 via-gray-700 to-gray-800 bg-clip-text text-transparent"
        >
          Dashboard Overview
        </motion.h2>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <AnimatePresence>
            {stats.map((stat, index) => (
              <StatCard
                key={stat.title}
                {...stat}
                delay={0.4 + index * 0.1}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AdminOverview;