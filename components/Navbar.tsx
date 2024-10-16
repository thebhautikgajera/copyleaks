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
        <Link href="/">
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
              <Link href="/" className={`block px-4 py-2 text-2xl mb-4 ${isActive('/') ? 'bg-white bg-opacity-20 font-bold' : 'text-white'}`} onClick={toggleMenu}>Home</Link>
              <Link href="/about" className={`block px-4 py-2 text-2xl mb-4 ${isActive('/about') ? 'bg-white bg-opacity-20 font-bold' : 'text-white'}`} onClick={toggleMenu}>About</Link>
              <Link href="/pricing" className={`block px-4 py-2 text-2xl mb-4 ${isActive('/pricing') ? 'bg-white bg-opacity-20 font-bold' : 'text-white'}`} onClick={toggleMenu}>Pricing</Link>
              <Link href="/contact" className={`block px-4 py-2 text-2xl mb-4 ${isActive('/contact') ? 'bg-white bg-opacity-20 font-bold' : 'text-white'}`} onClick={toggleMenu}>Contact Us</Link>
              <Link href="/signup" className={`block px-4 py-2 text-2xl mb-4 ${isActive('/signup') ? 'bg-white bg-opacity-20 font-bold' : 'text-white'}`} onClick={toggleMenu}>Sign Up</Link>
              <Link href="/login" className={`block px-4 py-2 text-2xl ${isActive('/login') ? 'bg-white bg-opacity-20 font-bold' : 'bg-blue-600 text-white'}`} onClick={toggleMenu}>Login</Link>
            </div>
          </div>
        </>
      ) : (
        <div className="flex items-center space-x-6">
          <Link href="/" className={`text-[1.3vw] px-3 py-1 rounded ${isActive('/') ? 'bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg font-bold' : 'text-white hover:text-gray-300'}`}>Home</Link>
          <Link href="/about" className={`text-[1.3vw] px-3 py-1 rounded ${isActive('/about') ? 'bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg font-bold' : 'text-white hover:text-gray-300'}`}>About</Link>
          <Link href="/pricing" className={`text-[1.3vw] px-3 py-1 rounded ${isActive('/pricing') ? 'bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg font-bold' : 'text-white hover:text-gray-300'}`}>Pricing</Link>
          <Link href="/contact" className={`text-[1.3vw] px-3 py-1 rounded ${isActive('/contact') ? 'bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg font-bold' : 'text-white hover:text-gray-300'}`}>Contact Us</Link>
          <Link href="/signup" className={`text-[1.3vw] px-3 py-1 rounded ${isActive('/signup') ? 'bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg font-bold' : 'text-white hover:text-gray-300'}`}>Sign Up</Link>
          <Link href="/login" className={`text-[1.3vw] px-4 py-2 rounded ${isActive('/login') ? 'bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg font-bold' : 'bg-blue-600 text-white hover:bg-blue-700'}`}>Login</Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
