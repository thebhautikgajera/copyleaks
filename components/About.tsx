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
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="min-h-screen w-full pb-[4vw] text-white bg-gradient-to-br from-purple-800 via-indigo-900 to-blue-900"
        id="bgPage1About"
      >
        <Navbar />
        <div className="container mx-auto px-4 py-16">
          <motion.h1
            variants={itemVariants}
            className="text-6xl font-bold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500"
          >
            About Contentleaks
          </motion.h1>
          <motion.div
            variants={itemVariants}
            className="bg-white/10 backdrop-blur-md rounded-lg shadow-xl p-10 mb-8 hover:shadow-2xl transition-shadow duration-300"
          >
            <motion.p
              variants={itemVariants}
              className="mb-8 text-xl leading-relaxed"
            >
              Welcome to Contentleaks, your go-to resource for AI content detection. As digital content evolves, ensuring authenticity is crucial. Our advanced tools help individuals, educators, and businesses identify AI-generated material, promoting transparency and integrity in the online space.
            </motion.p>
            <motion.p
              variants={itemVariants}
              className="mb-8 text-xl leading-relaxed"
            >
              Join us in fostering a trustworthy digital environment. Explore our resources and stay informed about the latest in AI technology, empowering you to engage with genuine content.
            </motion.p>
            <motion.h2
              variants={itemVariants}
              className="text-4xl font-semibold mb-6 text-blue-300"
            >
              Key commitments:
            </motion.h2>
            <motion.ul
              variants={itemVariants}
              className="list-none pl-6 mb-8 space-y-4"
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
                  className="flex items-center text-xl"
                >
                  <span className="text-pink-400 mr-4">✦</span>
                  {feature}
                </motion.li>
              ))}
            </motion.ul>
            <motion.h1
              variants={itemVariants}
              className="text-4xl font-[1500] text-center leading-relaxed"
            >
              Contentleaks, where technology meets integrity.
            </motion.h1>
          </motion.div>
        </div>
      </motion.div>
      <Footer />
    </>
  );
};

export default About;
