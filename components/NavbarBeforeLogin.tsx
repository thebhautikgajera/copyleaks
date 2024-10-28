"use client"

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import Logo from '../assets/logo.png';
import { FiMenu, FiX } from 'react-icons/fi';

const Navbar = () => {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMenuOpen]);

  const isActive = (path: string) => pathname === path;

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="flex justify-between items-center p-4 bg-transparent shadow-md relative z-50">
      <div className="flex-shrink-0">
        <Link href="/home">
          <Image src={Logo} alt="Logo" width={320} height={270} />
        </Link>
      </div>
      {isMobile ? (
        <>
          <button onClick={toggleMenu} className="text-white z-50">
            {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
          <div className={`fixed inset-0 bg-indigo-900 bg-opacity-95 z-40 transition-transform duration-300 ease-in-out ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
            <div className="flex flex-col justify-center items-center h-full">
              
              <Link href="/home" className={`block px-4 py-2 text-2xl mb-4 ${isActive('/home') ? 'bg-white bg-opacity-20 font-bold' : 'text-white'}`} onClick={toggleMenu}>Home</Link>
              <Link href="/about" className={`block px-4 py-2 text-2xl mb-4 ${isActive('/about') ? 'bg-white bg-opacity-20 font-bold' : 'text-white'}`} onClick={toggleMenu}>About</Link>
              <Link href="/pricing" className={`block px-4 py-2 text-2xl mb-4 ${isActive('/pricing') ? 'bg-white bg-opacity-20 font-bold' : 'text-white'}`} onClick={toggleMenu}>Pricing</Link>
              <Link href="/contact" className={`block px-4 py-2 text-2xl mb-4 ${isActive('/contact') ? 'bg-white bg-opacity-20 font-bold' : 'text-white'}`} onClick={toggleMenu}>Contact Us</Link>
              <Link href="/login" className="flex items-center px-6 py-3 text-2xl text-white bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/30 hover:scale-105 active:scale-95 mb-4">
                Login
              </Link>
              <Link href="/signup" className="flex items-center px-6 py-3 text-2xl text-white bg-gradient-to-r from-green-500 to-green-600 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-green-500/30 hover:scale-105 active:scale-95">
                Sign Up
              </Link>
            </div>
          </div>
        </>
      ) : (
        <div className="flex items-center space-x-6">
          
          <Link href="/home" className={`text-[1.3vw] px-3 py-1 rounded ${isActive('/home') ? 'bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg font-bold' : 'text-white hover:text-gray-300'}`}>Home</Link>
          <Link href="/about" className={`text-[1.3vw] px-3 py-1 rounded ${isActive('/about') ? 'bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg font-bold' : 'text-white hover:text-gray-300'}`}>About</Link>
          <Link href="/pricing" className={`text-[1.3vw] px-3 py-1 rounded ${isActive('/pricing') ? 'bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg font-bold' : 'text-white hover:text-gray-300'}`}>Pricing</Link>
          <Link href="/contact" className={`text-[1.3vw] px-3 py-1 rounded ${isActive('/contact') ? 'bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg font-bold' : 'text-white hover:text-gray-300'}`}>Contact Us</Link>
          <Link href="/login" className="flex items-center text-[1.3vw] px-6 py-2.5 text-white bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg transition-all duration-300 shadow-lg hover:shadow-blue-500/30 hover:scale-105 active:scale-95 font-semibold">
            Login
          </Link>
          <Link href="/signup" className="flex items-center text-[1.3vw] px-6 py-2.5 text-white bg-gradient-to-r from-green-500 to-green-600 rounded-lg transition-all duration-300 shadow-lg hover:shadow-green-500/30 hover:scale-105 active:scale-95 font-semibold">
            Sign Up
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
