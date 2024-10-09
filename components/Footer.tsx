import React from 'react'
import Link from 'next/link'
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from 'react-icons/fa'
import { motion } from 'framer-motion'
import Logo from '../assets/logo.svg'
import Image from 'next/image'

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
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[url('/path/to/your/background-image.jpg')] bg-cover bg-center opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-70"></div>
      </div>
      <motion.div
        className="container mx-auto px-4 relative z-10"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16">
          <motion.div variants={itemVariants} className="text-center md:text-left relative">
            <Image src={Logo} alt="AI Content Detective Logo" className="w-48 h-auto mb-6" />
            <p className="text-l text-gray-200 leading-relaxed mb-6 font-light italic">
              Illuminating truth, fostering creativity, and championing authenticity through our pioneering AI detection technology.
            </p>
          </motion.div>
          <motion.div variants={itemVariants}>
            <h4 className="text-3xl font-semibold mb-8 text-blue-300">Quick Links</h4>
            <ul className="space-y-5">
              {['Home', 'About', 'Pricing', 'Contact'].map((item, index) => (
                <li key={index}>
                  <Link href={item === 'Home' ? '/' : `/${item.toLowerCase()}`} className="text-lg hover:text-purple-300 transition duration-300 flex items-center group">
                    <span className="mr-3 transform group-hover:translate-x-2 transition-transform duration-300">→</span>
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
          <motion.div variants={itemVariants}>
            <h4 className="text-3xl font-semibold mb-8 text-blue-300">Resources</h4>
            <ul className="space-y-5">
              {['Blog', 'FAQ', 'API Documentation'].map((item, index) => (
                <li key={index}>
                  <a href="#" className="text-lg hover:text-purple-300 transition duration-300 flex items-center group">
                    <span className="mr-3 transform group-hover:translate-x-2 transition-transform duration-300">→</span>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
          <motion.div variants={itemVariants}>
            <h4 className="text-3xl font-semibold mb-8 text-blue-300">Connect With Us</h4>
            <div className="flex justify-center md:justify-start space-x-8">
              {[FaFacebook, FaTwitter, FaLinkedin, FaInstagram].map((Icon, index) => (
                <a key={index} href="#" className="text-4xl hover:text-blue-400 transition duration-300 transform hover:scale-110">
                  <Icon />
                </a>
              ))}
            </div>
          </motion.div>
        </div>
        <motion.div
          className="mt-10 pt-10 border-t border-gray-700 text-center"
          variants={itemVariants}
        >
          <p className="text-lg text-gray-400">&copy; {new Date().getFullYear()} copyleaks X <span className="font-extrabold font-[SSr]">The Bhautik Gajera</span>. All rights reserved.</p>
        </motion.div>
      </motion.div>
    </footer>
  )
}

export default Footer