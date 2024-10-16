"use client";

import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { motion } from "framer-motion";

const About = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
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
        damping: 12,
      },
    },
  };

  return (
    <>
      <div
        className="min-h-screen w-full pb-4 sm:pb-8 md:pb-[4vw] text-white bg-gradient-to-br from-purple-800 via-indigo-900 to-blue-900"
        id="bgPage1About"
      >
        <Navbar />
        <div className="container mx-auto px-4 py-8 md:py-12 lg:pt-[8vw]">
          <motion.h1
            variants={itemVariants}
            className="text-4xl sm:text-3xl md:text-6xl font-bold mb-6 sm:mb-8 md:mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 leading-tight"
          >
            About Contentleaks
          </motion.h1>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="bg-white/10 backdrop-blur-md rounded-lg shadow-xl p-4 sm:p-6 md:p-10 mb-8 hover:shadow-2xl transition-shadow duration-300"
          >
            <motion.p
              variants={itemVariants}
              className="mb-4 sm:mb-6 md:mb-8 text-base sm:text-lg md:text-xl leading-relaxed"
            >
              Welcome to Contentleaks, your go-to resource for AI content
              detection. As digital content evolves, ensuring authenticity is
              crucial. Our advanced tools help individuals, educators, and
              businesses identify AI-generated material, promoting transparency
              and integrity in the online space.
            </motion.p>
            <motion.p
              variants={itemVariants}
              className="mb-4 sm:mb-6 md:mb-8 text-base sm:text-lg md:text-xl leading-relaxed"
            >
              Join us in fostering a trustworthy digital environment. Explore
              our resources and stay informed about the latest in AI technology,
              empowering you to engage with genuine content.
            </motion.p>
            <motion.h2
              variants={itemVariants}
              className="text-2xl sm:text-3xl md:text-4xl font-semibold mb-4 sm:mb-6 md:mb-8 lg:mt-[3vw] text-blue-300 text-center"
            >
              Key commitments:
            </motion.h2>
            <motion.ul
              variants={containerVariants}
              className="list-none pl-0 mb-6 sm:mb-8 md:mb-10 space-y-3 sm:space-y-4 md:space-y-6"
            >
              {[
                "Ethical AI development",
                "Continuous innovation",
                "Regulatory transparency and compliance",
                "Education awareness and integrity",
                "IP protection and copyright compliance",
                "Academic integrity and plagiarism prevention",
                "High accuracy in detecting AI-generated content",
                "User-friendly interface for easy content analysis",
                "Detailed reports with confidence scores",
                "Continuous updates to keep up with evolving AI technologies",
              ].map((feature, index) => (
                <motion.li
                  key={index}
                  variants={itemVariants}
                  className="flex items-center text-sm sm:text-base md:text-xl bg-white/5 rounded-lg p-3 sm:p-4 transition-all duration-300 hover:bg-white/10"
                >
                  <span className="text-pink-400 mr-3 sm:mr-4 text-xl sm:text-2xl">✦</span>
                  {feature}
                </motion.li>
              ))}
            </motion.ul>
            <motion.h1
              variants={itemVariants}
              className="text-xl sm:text-2xl md:text-3xl font-[1500] text-center leading-relaxed bg-clip-text text-transparent bg-gradient-to-r from-blue-300 via-purple-400 to-pink-300"
            >
              Contentleaks, where technology meets integrity.
            </motion.h1>
          </motion.div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default About;
