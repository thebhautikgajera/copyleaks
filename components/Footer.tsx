import React from 'react'
import { motion } from 'framer-motion'

const Footer = () => {
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
        type: "spring",
        stiffness: 100,
        damping: 12,
      },
    },
  }

  return (
    <footer className="text-white pt-24 pb-10 relative overflow-hidden" id="bgPage1Footer">
     
      <motion.div
        className="container mx-auto px-4 relative z-10"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div
          className="mt-10 pt-10 border-t border-gray-700 text-center"
          variants={itemVariants}
        >
          <p className="text-lg text-gray-400">&copy; {new Date().getFullYear()} contentleaks. All rights reserved.</p>
        </motion.div>
      </motion.div>
    </footer>
  )
}

export default Footer