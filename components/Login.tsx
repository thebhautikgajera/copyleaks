"use client"

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiLock, FiLogIn, FiEye, FiEyeOff, FiUser } from 'react-icons/fi'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { ClipLoader } from "react-spinners"

const Login = () => {
  const router = useRouter()
  const [formData, setFormData] = useState({
    emailOrUsername: '',
    password: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const response = await axios.post('/api/login', formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.status === 200) {
        // Login successful, redirect to dashboard or home page
        router.push('/home')
      } else {
        setError('Failed to login')
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message || 'Invalid email/username or password')
      } else {
        setError('An unexpected error occurred')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
      },
    },
  }

  const iconVariants = {
    hidden: { opacity: 0, scale: 0.5, rotate: -180 },
    visible: { opacity: 1, scale: 1, rotate: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, scale: 0.5, rotate: 180, transition: { duration: 0.3 } },
  }

  return (
    <div className="min-h-screen w-full pb-[4vw] text-white bg-gradient-to-br from-purple-800 via-indigo-900 to-blue-900"
        id="bgPage1Contact">
      <div className="flex justify-center items-center min-h-screen px-4 sm:px-6 lg:px-8">
        <motion.div
          className="bg-white/10 backdrop-blur-md p-6 sm:p-10 rounded-3xl shadow-2xl w-full max-w-md border border-white/20"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.h2 
            className="text-4xl sm:text-5xl font-bold mb-6 sm:mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500"
            variants={itemVariants}
          >
            Welcome Back
          </motion.h2>
          {error && (
            <motion.p
              className="text-red-500 text-sm mb-4 text-center"
              variants={itemVariants}
            >
              {error}
            </motion.p>
          )}
          <form onSubmit={handleSubmit}>
            <motion.div className="mb-4 sm:mb-6" variants={itemVariants}>
              <label
                htmlFor="emailOrUsername"
                className="block text-white text-base sm:text-lg font-bold mb-2 flex items-center"
              >
                <FiUser className="mr-2 text-blue-400" /> Email or Username
              </label>
              <input
                type="text"
                id="emailOrUsername"
                name="emailOrUsername"
                value={formData.emailOrUsername}
                onChange={handleChange}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-[#1C2951] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out text-base sm:text-lg"
                required
                placeholder="Email or Username"
              />
            </motion.div>
            <motion.div className="mb-6 sm:mb-8" variants={itemVariants}>
              <label
                htmlFor="password"
                className="block text-white text-base sm:text-lg font-bold mb-2 flex items-center"
              >
                <FiLock className="mr-2 text-blue-400" /> Password
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
                  placeholder="••••••••"
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
            <motion.button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 sm:py-4 px-4 sm:px-6 rounded-lg hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out transform hover:scale-105 text-base sm:text-lg font-bold flex items-center justify-center"
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={isLoading}
            >
              {isLoading ? (
                <ClipLoader color="#ffffff" size={24} />
              ) : (
                <>
                  <FiLogIn className="mr-2" /> Login
                </>
              )}
            </motion.button>
          </form>
          <motion.p className="mt-4 sm:mt-6 text-center text-white/80 text-sm sm:text-base" variants={itemVariants}>
            Don&apos;t have an account? <a href="/signup" className="text-blue-400 hover:text-blue-300 transition duration-300">Sign up</a>
          </motion.p>
        </motion.div>
      </div>
    </div>
  )
}

export default Login