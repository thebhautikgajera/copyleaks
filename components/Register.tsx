"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { ClipLoader } from "react-spinners";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [bgColor, setBgColor] = useState({ from: "rgb(59, 130, 246)", to: "rgb(147, 51, 234)" });
  const router = useRouter();
  const gradientRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post("/api/register", {
        username,
        email,
        password,
        confirmPassword
      });

      if (response.status === 201) {
        router.push("/login");
      } else {
        setError(response.data.message || "Registration failed");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Registration error:", error.response?.data);
        setError(
          error.response?.data?.message ||
            "An error occurred during registration"
        );
      } else {
        console.error("Registration error:", error);
        setError("An unexpected error occurred during registration");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const canvas = document.getElementById('background-canvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: { x: number; y: number; radius: number; dx: number; dy: number; color: string }[] = [];

    const colors = ['#f3f4f6'];

    for (let i = 0; i < 100; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2 + 1,
        dx: (Math.random() - 0.5) * 0.5,
        dy: (Math.random() - 0.5) * 0.5,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }

    function animate() {
      requestAnimationFrame(animate);
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach(particle => {
          particle.x += particle.dx;
          particle.y += particle.dy;

          if (particle.x < 0 || particle.x > canvas.width) particle.dx *= -1;
          if (particle.y < 0 || particle.y > canvas.height) particle.dy *= -1;

          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
          ctx.fillStyle = particle.color;
          ctx.fill();
        });
      }
    }

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Smooth color transition effect
  useEffect(() => {
    const colors = [
      { from: "rgb(59, 130, 246)", to: "rgb(147, 51, 234)" },
      { from: "rgb(74, 222, 128)", to: "rgb(59, 130, 246)" },
      { from: "rgb(236, 72, 153)", to: "rgb(234, 179, 8)" },
      { from: "rgb(99, 102, 241)", to: "rgb(236, 72, 153)" },
    ];
    let colorIndex = 0;
    let transitionProgress = 0;

    const changeColor = () => {
      const currentColor = colors[colorIndex];
      const nextColor = colors[(colorIndex + 1) % colors.length];
      
      const fromRGB = currentColor.from.match(/\d+/g)!.map(Number);
      const toRGB = currentColor.to.match(/\d+/g)!.map(Number);
      const nextFromRGB = nextColor.from.match(/\d+/g)!.map(Number);
      const nextToRGB = nextColor.to.match(/\d+/g)!.map(Number);

      const interpolateColor = (start: number[], end: number[], progress: number) => {
        return start.map((startValue, i) => {
          const endValue = end[i];
          return Math.round(startValue + (endValue - startValue) * progress);
        });
      };

      const newFrom = interpolateColor(fromRGB, nextFromRGB, transitionProgress);
      const newTo = interpolateColor(toRGB, nextToRGB, transitionProgress);

      setBgColor({
        from: `rgb(${newFrom.join(',')})`,
        to: `rgb(${newTo.join(',')})`,
      });

      transitionProgress += 0.005;
      if (transitionProgress >= 1) {
        transitionProgress = 0;
        colorIndex = (colorIndex + 1) % colors.length;
      }
    };

    const colorChangeInterval = setInterval(changeColor, 50);

    return () => {
      clearInterval(colorChangeInterval);
    };
  }, []);

  const inputVariants = {
    focus: { scale: 1.02, transition: { duration: 0.2 } },
    blur: { scale: 1, transition: { duration: 0.2 } },
  };

  return (
    <div 
      ref={gradientRef} 
      className="min-h-screen flex items-center justify-center relative transition-all duration-[30000ms] ease-in-out px-4 sm:px-6 lg:px-8"
      style={{
        background: `linear-gradient(to bottom right, ${bgColor.from}, ${bgColor.to})`,
      }}
    >
      <canvas id="background-canvas" className="absolute top-0 left-0 w-full h-full" />
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white bg-opacity-90 p-6 sm:p-8 md:p-10 rounded-2xl shadow-2xl w-full max-w-md relative z-10 backdrop-filter backdrop-blur-sm mx-auto"
      >
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-3xl sm:text-4xl font-extrabold text-center text-gray-800 mb-6 sm:mb-8"
        >
          Join Us
        </motion.h2>
        <motion.form
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          onSubmit={handleSubmit}
          className="space-y-4 sm:space-y-6"
        >
          <motion.div 
            className="relative"
            variants={inputVariants}
            whileFocus="focus"
            whileTap="focus"
          >
            <FaUser className="absolute top-3 left-3 text-indigo-500" />
            <input
              id="username"
              name="username"
              type="text"
              required
              className="w-full pl-10 pr-3 py-3 border-b-2 border-gray-300 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-all duration-300 text-sm sm:text-base"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </motion.div>
          <motion.div 
            className="relative"
            variants={inputVariants}
            whileFocus="focus"
            whileTap="focus"
          >
            <FaEnvelope className="absolute top-3 left-3 text-indigo-500" />
            <input
              id="email-address"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="w-full pl-10 pr-3 py-3 border-b-2 border-gray-300 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-all duration-300 text-sm sm:text-base"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </motion.div>
          <motion.div 
            className="relative"
            variants={inputVariants}
            whileFocus="focus"
            whileTap="focus"
          >
            <FaLock className="absolute top-3 left-3 text-indigo-500" />
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              required
              className="w-full pl-10 pr-10 py-3 border-b-2 border-gray-300 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-all duration-300 text-sm sm:text-base"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 text-indigo-500 focus:outline-none"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </motion.div>
          <motion.div 
            className="relative"
            variants={inputVariants}
            whileFocus="focus"
            whileTap="focus"
          >
            <FaLock className="absolute top-3 left-3 text-indigo-500" />
            <input
              id="confirm-password"
              name="confirm-password"
              type={showConfirmPassword ? "text" : "password"}
              autoComplete="new-password"
              required
              className="w-full pl-10 pr-10 py-3 border-b-2 border-gray-300 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-all duration-300 text-sm sm:text-base"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 text-indigo-500 focus:outline-none"
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </motion.div>

          <AnimatePresence>
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-center text-xs sm:text-sm text-red-600 bg-red-100 p-2 rounded-md"
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          <motion.button
            type="submit"
            disabled={isLoading}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full py-2.5 sm:py-3 px-4 border border-transparent rounded-md shadow-sm text-base sm:text-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300"
          >
            {isLoading ? <ClipLoader color="#ffffff" size={20} /> : "Create Account"}
          </motion.button>
        </motion.form>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mt-4 sm:mt-6 text-center"
        >
          <p className="text-xs sm:text-sm text-gray-600">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
              Log in
            </Link>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Register;
