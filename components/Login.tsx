"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { FaUser, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { setCookie } from 'cookies-next';
import { ClipLoader } from "react-spinners";

const Login = () => {
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [bgColor, setBgColor] = useState({ from: "rgb(59, 130, 246)", to: "rgb(147, 51, 234)" });
  const router = useRouter();
  const gradientRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post("/api/login", {
        emailOrUsername,
        password,
      });

      if (response.status === 200) {
        // Set session cookie
        setCookie('session', response.data.sessionToken, {
          maxAge: 30 * 24 * 60 * 60, // 30 days
          path: '/',
          sameSite: 'strict',
          secure: window.location.protocol === 'https:',
        });

        // Store user data in localStorage
        localStorage.setItem('user', JSON.stringify(response.data.user));

        router.push("/home");
      } else {
        setError(response.data.message || "Login failed");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Login error:", error.response?.data);
        setError(
          error.response?.data?.message ||
            "An error occurred during login"
        );
      } else {
        console.error("Login error:", error);
        setError("An unexpected error occurred during login");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const colors = [
      { from: "rgb(59, 130, 246)", to: "rgb(147, 51, 234)" },
      { from: "rgb(236, 72, 153)", to: "rgb(239, 68, 68)" },
      { from: "rgb(16, 185, 129)", to: "rgb(59, 130, 246)" },
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

    // Initialize canvas
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (canvas && ctx) {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      const particles: Particle[] = [];
      const particleCount = 100;

      class Particle {
        x: number;
        y: number;
        size: number;
        speedX: number;
        speedY: number;
        constructor() {
          this.x = Math.random() * (canvas?.width ?? 0);
          this.y = Math.random() * (canvas?.height ?? 0);
          this.size = Math.random() * 5 + 1;
          this.speedX = Math.random() * 3 - 1.5;
          this.speedY = Math.random() * 3 - 1.5;
        }

        update() {
          this.x += this.speedX;
          this.y += this.speedY;

          if (this.x > (canvas?.width ?? 0)) this.x = 0;
          else if (this.x < 0) this.x = (canvas?.width ?? 0);

          if (this.y > (canvas?.height ?? 0)) this.y = 0;
          else if (this.y < 0) this.y = (canvas?.height ?? 0);
        }
        draw() {
          if (ctx) {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.closePath();
            ctx.fill();
          }
        }
      }

      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }

      const animate = () => {
        if (ctx && canvas) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          for (const particle of particles) {
            particle.update();
            particle.draw();
          }
          requestAnimationFrame(animate);
        }
      };

      animate();
    }

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
      className="min-h-screen flex items-center justify-center relative transition-all duration-[30000ms] ease-in-out"
      style={{
        background: `linear-gradient(to bottom right, ${bgColor.from}, ${bgColor.to})`,
      }}
    >
      <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full" />
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white bg-opacity-90 p-10 rounded-2xl shadow-2xl w-[90%] md:w-[70%] lg:w-[40%] max-w-md relative z-10 backdrop-filter backdrop-blur-sm mx-4"
      >
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-4xl font-extrabold text-center text-gray-800 mb-8"
        >
          Welcome Back
        </motion.h2>
        <motion.form
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          <motion.div 
            className="relative"
            variants={inputVariants}
            whileFocus="focus"
            whileTap="focus"
          >
            <FaUser className="absolute top-3 left-3 text-indigo-500" />
            <input
              id="emailOrUsername"
              name="emailOrUsername"
              type="text"
              required
              className="w-full pl-10 pr-3 py-3 border-b-2 border-gray-300 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-all duration-300"
              placeholder="Email or Username"
              value={emailOrUsername}
              onChange={(e) => setEmailOrUsername(e.target.value)}
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
              autoComplete="current-password"
              required
              className="w-full pl-10 pr-10 py-3 border-b-2 border-gray-300 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-all duration-300"
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
          <AnimatePresence>
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-red-500 text-sm mt-2"
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {isLoading ? <ClipLoader color="#ffffff" size={20} /> : "Login"}
          </motion.button>
        </motion.form>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mt-6 text-center"
        >
          <p className="text-sm text-gray-600">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
              register now
            </Link>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;