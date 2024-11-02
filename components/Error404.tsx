"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Error404 = () => {
  const router = useRouter();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.5 }
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
    <AnimatePresence>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center px-4 relative overflow-hidden"
      >
        <motion.div 
          className="text-center"
          variants={itemVariants}
        >
          <motion.h1
            variants={itemVariants}
            className="text-9xl font-bold text-white mb-4"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            404
          </motion.h1>
          <motion.h2
            variants={itemVariants}
            className="text-2xl md:text-3xl font-light text-gray-300 mb-8"
          >
            Oops! Page not found
          </motion.h2>
          <motion.div
            variants={itemVariants}
            className="space-x-4"
          >
            <motion.button
              onClick={() => router.back()}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg transition-colors duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Go Back
            </motion.button>
            <motion.div
              className="inline-block"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href="/"
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg inline-block transition-colors duration-200"
              >
                Home Page
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Animated background elements */}
        <motion.div
          className="absolute top-0 left-0 w-full h-full -z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ duration: 1 }}
        >
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 opacity-30"
              style={{
                width: Math.random() * 400 + 100,
                height: Math.random() * 400 + 100,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 180, 360],
                x: [0, Math.random() * 100 - 50],
                y: [0, Math.random() * 100 - 50],
              }}
              transition={{
                duration: Math.random() * 10 + 10,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          ))}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Error404;
