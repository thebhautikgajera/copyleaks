"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "./Navbar";
import Footer from "./Footer";
const Pricing: React.FC = () => {
  const [hoveredPlan, setHoveredPlan] = useState<number | null>(null);

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
    hidden: { y: 50, opacity: 0 },
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

  const plans = [
    {
      name: "Basic",
      price: "₹299",
      features: [
        "500 AI detections per month",
        "Basic reporting and analytics",
        "Email support within 24 hours",
        "Access to knowledge base",
      ],
      buttonText: "Get Started",
      color: "from-blue-400 to-blue-600",
    },
    {
      name: "Pro",
      price: "₹699",
      features: [
        "Unlimited AI detections",
        "Advanced reporting and analytics",
        "Priority support with 4-hour response time",
        "API access for integrations",
        "Custom AI model training",
      ],
      buttonText: "Upgrade to Pro",
      color: "from-purple-400 to-purple-600",
      popular: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      features: [
        "All Pro features included",
        "Custom integration and deployment",
        "Dedicated account manager",
        "24/7 phone and email support",
        "On-premise solution available",
        "Advanced security features",
      ],
      buttonText: "Contact Sales",
      color: "from-indigo-400 to-indigo-600",
      url: "https://example.com/enterprise-plan",
    },
  ];

  return (
    <>
      <div
        className="min-h-screen w-full pb-[4vw] text-white bg-gradient-to-br from-purple-800 via-indigo-900 to-blue-900"
        id="bgPage1Price"
      >
        <Navbar />
        <motion.div
          className="text-white py-20"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <div className="container mx-auto px-4">
            <motion.h2
              className="text-7xl font-bold text-center mb-16 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500"
              variants={itemVariants}
            >
              Choose Your Perfect Plan
            </motion.h2>
            <motion.div
              className="flex justify-center items-center pb-8 gap-10 sm:flex sm:flex-col sm:justify-center sm:items-center"         
              variants={containerVariants}
            >
              {plans.map((plan, index) => (
                <motion.div
                  key={index}
                  className={`bg-gradient-to-b from-[#1C2951] to-[#0F1A36] rounded-2xl p-10 shadow-2xl transform transition duration-300 flex-shrink-0 flex flex-col justify-between w-[350px] h-[650px] relative overflow-hidden ${
                    plan.popular ? "border-2 border-[#3F9AF5]" : ""
                  }`}
                  variants={itemVariants}
                  whileHover={{
                    scale: 1.05,
                    zIndex: 10,
                    boxShadow: "0 0 30px rgba(63, 154, 245, 0.3)",
                  }}
                  onHoverStart={() => setHoveredPlan(index)}
                  onHoverEnd={() => setHoveredPlan(null)}
                >
                  {plan.popular && (
                    <motion.div
                      className="absolute top-0 right-0 bg-[#3F9AF5] text-white text-sm font-bold px-4 py-2 rounded-bl-2xl rounded-tr-2xl flex items-center"
                      initial={{ x: 100 }}
                      animate={{ x: 0 }}
                      transition={{ type: "spring", stiffness: 100 }}
                    >
                      <span className="mr-2 text-yellow-300">★</span> MOST
                      POPULAR
                    </motion.div>
                  )}
                  <div>
                    <h3 className="text-3xl font-semibold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-purple-300">
                      {plan.name}
                    </h3>
                    <motion.p
                      className="text-5xl font-bold mb-8"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      {plan.price}
                      <span className="text-2xl font-normal text-gray-400">
                        {plan.price !== "Custom" ? "/month" : ""}
                      </span>
                    </motion.p>
                    <ul className="mb-10 space-y-4">
                      {plan.features.map((feature, idx) => (
                        <motion.li
                          key={idx}
                          className="flex items-center"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.4 + idx * 0.1 }}
                        >
                          <span className="text-green-400 mr-3">✓</span>{" "}
                          {feature}
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                  <motion.button
                    className={`w-full bg-gradient-to-r ${plan.color} text-white py-4 px-6 rounded-full text-lg font-semibold hover:shadow-lg transition duration-300 z-10`}
                    whileHover={{
                      scale: 1.05,
                      boxShadow: "0 0 20px rgba(255, 255, 255, 0.3)",
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {plan.buttonText}
                  </motion.button>
                  <AnimatePresence>
                    {hoveredPlan === index && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="absolute inset-0 bg-black bg-opacity-90 flex items-center justify-center rounded-2xl"
                      >
                        <div className="text-center p-6">
                          <motion.span
                            className="text-6xl text-blue-400 mb-4 mx-auto block"
                            initial={{ rotate: -180, scale: 0 }}
                            animate={{ rotate: 0, scale: 1 }}
                            transition={{ type: "spring", stiffness: 200 }}
                          >
                            ℹ️
                          </motion.span>
                          <h4 className="text-2xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                            Why Choose {plan.name}?
                          </h4>
                          <motion.p
                            className="text-gray-300"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                          >
                            {plan.name === "Basic"
                              ? "Perfect for individuals and small teams starting out with AI detection. Get essential features at an affordable price."
                              : plan.name === "Pro"
                              ? "Ideal for growing businesses needing advanced AI detection capabilities. Unlock powerful features and priority support."
                              : "Tailored for large enterprises requiring custom solutions. Get a dedicated team and advanced security features."}
                          </motion.p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>
      <Footer />
    </>
  );
};

export default Pricing;