"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "./Navbar";
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "./Navbar";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const Pricing: React.FC = () => {
  const [hoveredPlan, setHoveredPlan] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

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
    hidden: { x: -50, opacity: 0 },
    visible: {
      x: 0,
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
      priceId: "price_1Q7xdoSB8DEzcY7OhFYnho1E",
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
      priceId: "price_1Q7xeGSB8DEzcY7Owp7KfX1y",
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
      priceId: null,
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
    },
  ];

  const handlePayment = async (priceId: string | null) => {
    if (!priceId) {
      window.location.href = '/contact';
      return;
    }

    setIsLoading(true);

    try {
      const stripe = await stripePromise;
      if (!stripe) throw new Error('Stripe initialization failed');

      const { error } = await stripe.redirectToCheckout({
        lineItems: [{ price: priceId, quantity: 1 }],
        mode: 'subscription',
        successUrl: `${window.location.origin}/success`,
        cancelUrl: `${window.location.origin}/pricing`,
      });

      if (error) {
        console.error('Stripe Checkout Error:', error);
        alert('Error processing payment. Please try again.');
      }
    } catch (error) {
      console.error('Payment Error:', error);
      alert('An error occurred during payment processing. Please try again or contact support.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
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
            className="flex justify-center items-center pb-8 gap-10"
            variants={containerVariants}
          >
            {plans.map((plan, index) => (
              <motion.div
                key={index}
                className={`bg-gradient-to-b from-[#1C2951] to-[#0F1A36] rounded-2xl p-10 shadow-2xl transform transition duration-300 flex-shrink-0 flex flex-col justify-between w-[350px] h-[650px] relative overflow-hidden ${
                  plan.popular ? "border-2 border-[#3F9AF5]" : ""
                }`}
                variants={itemVariants}
                whileHover={{ scale: 1.05, zIndex: 10 }}
                onHoverStart={() => setHoveredPlan(index)}
                onHoverEnd={() => setHoveredPlan(null)}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-0 bg-[#3F9AF5] text-white text-sm font-bold px-4 py-2 rounded-bl-2xl rounded-tr-2xl flex items-center">
                    <span className="mr-2 text-yellow-300">★</span> MOST POPULAR
                  </div>
                )}
                <div>
                  <h3 className="text-3xl font-semibold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-purple-300">
                    {plan.name}
                  </h3>
                  <p className="text-5xl font-bold mb-8">
                    {plan.price}
                    <span className="text-2xl font-normal text-gray-400">
                      {plan.price !== "Custom" ? "/month" : ""}
                    </span>
                  </p>
                  <ul className="mb-10 space-y-4">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center">
                        <span className="text-green-400 mr-3">✓</span> {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                <motion.button
                  className={`w-full bg-gradient-to-r ${plan.color} text-white py-4 px-6 rounded-full text-lg font-semibold hover:shadow-lg transition duration-300 z-10 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handlePayment(plan.priceId)}
                  disabled={isLoading}
                >
                  {isLoading ? 'Processing...' : plan.buttonText}
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
                        <span className="text-4xl text-blue-400 mb-4 mx-auto block">ℹ️</span>
                        <h4 className="text-2xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                          Why Choose {plan.name}?
                        </h4>
                        <p className="text-gray-300">
                          {plan.name === "Basic"
                            ? "Perfect for individuals and small teams starting out with AI detection. Get essential features at an affordable price."
                            : plan.name === "Pro"
                            ? "Ideal for growing businesses needing advanced AI detection capabilities. Unlock powerful features and priority support."
                            : "Tailored for large enterprises requiring custom solutions. Get a dedicated team and advanced security features."}
                        </p>
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
  );
};

export default Pricing;
