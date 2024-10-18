"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import axios from "axios";
import { useRouter } from 'next/navigation';
import { ClipLoader } from "react-spinners";

const Signup = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    if (isRedirecting) {
      const timer = setTimeout(() => {
        router.push('/login');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isRedirecting, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post('/api/signup', formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 201) {
        setSuccess('Account created successfully! Redirecting to login page...');
        setFormData({
          username: "",
          email: "",
          password: "",
          confirmPassword: "",
        });
        setIsRedirecting(true);
      } else {
        setError('Failed to register user');
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message || 'Something went wrong');
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  const iconVariants = {
    hidden: { opacity: 0, scale: 0.5, rotate: -180 },
    visible: { opacity: 1, scale: 1, rotate: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, scale: 0.5, rotate: 180, transition: { duration: 0.3 } },
  };

  return (
    <>
      <div
        className="min-h-screen w-full pb-[4vw] text-white bg-gradient-to-br from-purple-800 via-indigo-900 to-blue-900"
        id="bgPage1Contact"
      >
        <div className="flex justify-center items-center min-h-screen px-4 py-8">
          <motion.div
            className="bg-white/10 backdrop-blur-md p-6 sm:p-10 rounded-3xl shadow-2xl w-full max-w-[450px]"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <motion.h2 
              className="text-3xl sm:text-5xl font-bold mb-6 sm:mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500"
              variants={itemVariants}
            >
              Join Us
            </motion.h2>
            {error && (
              <motion.p
                className="text-red-500 text-sm mb-4 text-center"
                variants={itemVariants}
              >
                {error}
              </motion.p>
            )}
            {success && (
              <motion.p
                className="text-green-500 text-sm mb-4 text-center"
                variants={itemVariants}
              >
                {success}
              </motion.p>
            )}
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <motion.div variants={itemVariants}>
                <label
                  htmlFor="username"
                  className="block text-white text-base sm:text-lg font-bold mb-2 flex items-center"
                >
                  <FiUser className="mr-2 text-blue-400 flex-shrink-0" /> <span>Username</span>
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-[#1C2951] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out text-base sm:text-lg"
                  required
                  placeholder="Enter your username"
                />
              </motion.div>
              <motion.div variants={itemVariants}>
                <label
                  htmlFor="email"
                  className="block text-white text-base sm:text-lg font-bold mb-2 flex items-center"
                >
                  <FiMail className="mr-2 text-blue-400 flex-shrink-0" /> <span>Email</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-[#1C2951] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out text-base sm:text-lg"
                  required
                  placeholder="Enter your email"
                />
              </motion.div>
              <motion.div variants={itemVariants}>
                <label
                  htmlFor="password"
                  className="block text-white text-base sm:text-lg font-bold mb-2 flex items-center"
                >
                  <FiLock className="mr-2 text-blue-400 flex-shrink-0" /> <span>Password</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-[#1C2951] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out text-base sm:text-lg"
                    required
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-400"
                  >
                    <AnimatePresence mode="wait" initial={false}>
                      {showPassword ? (
                        <motion.div
                          key="eyeOff"
                          variants={iconVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                        >
                          <FiEyeOff />
                        </motion.div>
                      ) : (
                        <motion.div
                          key="eye"
                          variants={iconVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                        >
                          <FiEye />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </button>
                </div>
              </motion.div>
              <motion.div variants={itemVariants}>
                <label
                  htmlFor="confirmPassword"
                  className="block text-white text-base sm:text-lg font-bold mb-2 flex items-center"
                >
                  <FiLock className="mr-2 text-blue-400 flex-shrink-0" /> <span>Confirm Password</span>
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-[#1C2951] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out text-base sm:text-lg"
                    required
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-400"
                  >
                    <AnimatePresence mode="wait" initial={false}>
                      {showConfirmPassword ? (
                        <motion.div
                          key="eyeOff"
                          variants={iconVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                        >
                          <FiEyeOff />
                        </motion.div>
                      ) : (
                        <motion.div
                          key="eye"
                          variants={iconVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                        >
                          <FiEye />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </button>
                </div>
              </motion.div>
              <motion.button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 sm:py-4 px-4 sm:px-6 rounded-lg text-base sm:text-lg font-bold hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out transform hover:scale-105 shadow-lg flex justify-center items-center"
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={isLoading || isRedirecting}
              >
                {isLoading || isRedirecting ? (
                  <ClipLoader color="#ffffff" size={24} />
                ) : (
                  "Create Account"
                )}
              </motion.button>
            </form>
            <motion.p 
              className="mt-4 sm:mt-6 text-center text-white text-xs sm:text-sm"
              variants={itemVariants}
            >
              Already have an account? <a href="/login" className="text-blue-400 hover:underline">Log in</a>
            </motion.p>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default Signup;
