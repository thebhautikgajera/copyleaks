"use client"

import { useState, useEffect } from 'react';
import { FaUserShield, FaUsers, FaEnvelope, FaStar, FaCheckCircle, FaSync } from 'react-icons/fa';
import Sidebar from './AdminSidebar';
import { motion } from 'framer-motion';

const AdminOverview = () => {
  const [adminCount, setAdminCount] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const [messageCount, setMessageCount] = useState(0);
  const [starredCount, setStarredCount] = useState(0);
  const [readCount, setReadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const fetchStats = async (endpoint: string) => {
    try {
      const response = await fetch(endpoint);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data.count;
    } catch (error) {
      console.error(`Error fetching from ${endpoint}:`, error);
      return 0;
    }
  };

  const fetchAllStats = async () => {
    setIsLoading(true);
    try {
      const adminCount = await fetchStats('/api/admin/count');
      setAdminCount(adminCount);

      const userCount = await fetchStats('/api/users/count');
      setUserCount(userCount);

      const messageCount = await fetchStats('/api/users/contact/count');
      setMessageCount(messageCount);

      const starredCount = await fetchStats('/api/users/contact/starred/count');
      setStarredCount(starredCount);

      const readCount = await fetchStats('/api/users/contact/read/count');
      setReadCount(readCount);

    } catch (error) {
      console.error('Error fetching counts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllStats();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <motion.div 
        className="admin-overview flex-1 p-6"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="flex justify-between items-center mb-6">
          <motion.h1 
            className="text-2xl font-bold"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            Dashboard Overview
          </motion.h1>
          <motion.button
            onClick={fetchAllStats}
            disabled={isLoading}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaSync className={`${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </motion.button>
        </div>
        <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-4" variants={containerVariants}>
          <motion.div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow" variants={itemVariants} whileHover={{ scale: 1.02 }}>
            <div className="flex items-center">
              <FaUserShield className="text-blue-500 text-3xl mr-4" />
              <div>
                <p className="text-gray-600">Total Admins</p>
                <p className="text-2xl font-bold">{adminCount}</p>
              </div>
            </div>
          </motion.div>
          <motion.div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow" variants={itemVariants} whileHover={{ scale: 1.02 }}>
            <div className="flex items-center">
              <FaUsers className="text-green-500 text-3xl mr-4" />
              <div>
                <p className="text-gray-600">Total Users</p>
                <p className="text-2xl font-bold">{userCount}</p>
              </div>
            </div>
          </motion.div>
          <motion.div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow" variants={itemVariants} whileHover={{ scale: 1.02 }}>
            <div className="flex items-center">
              <FaEnvelope className="text-purple-500 text-3xl mr-4" />
              <div>
                <p className="text-gray-600">Total Messages</p>
                <p className="text-2xl font-bold">{messageCount}</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4" 
          variants={containerVariants}
        >
          <motion.div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow" variants={itemVariants} whileHover={{ scale: 1.02 }}>
            <div className="flex items-center">
              <FaStar className="text-yellow-500 text-3xl mr-4" />
              <div>
                <p className="text-gray-600">Starred Messages</p>
                <p className="text-2xl font-bold">{starredCount}</p>
              </div>
            </div>
          </motion.div>
          <motion.div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow" variants={itemVariants} whileHover={{ scale: 1.02 }}>
            <div className="flex items-center">
              <FaCheckCircle className="text-green-500 text-3xl mr-4" />
              <div>
                <p className="text-gray-600">Read Messages</p>
                <p className="text-2xl font-bold">{readCount}</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AdminOverview;
