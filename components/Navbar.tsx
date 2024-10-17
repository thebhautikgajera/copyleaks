"use client"

import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Logo from '../assets/logo.png';
import { FiMenu, FiX } from 'react-icons/fi';
import axios from 'axios';
import { ClipLoader } from "react-spinners";

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

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

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const response = await axios.post('/api/logout');
      if (response.status === 200) {
        localStorage.removeItem('authToken');
        router.push('/login');
      } else {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      setIsLoggingOut(false);
    }
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
              
              <Link href="/home" className={`block px-4 py-2 text-2xl mb-4 ${isActive('/') ? 'bg-white bg-opacity-20 font-bold' : 'text-white'}`} onClick={toggleMenu}>Home</Link>
              <Link href="/about" className={`block px-4 py-2 text-2xl mb-4 ${isActive('/about') ? 'bg-white bg-opacity-20 font-bold' : 'text-white'}`} onClick={toggleMenu}>About</Link>
              <Link href="/pricing" className={`block px-4 py-2 text-2xl mb-4 ${isActive('/pricing') ? 'bg-white bg-opacity-20 font-bold' : 'text-white'}`} onClick={toggleMenu}>Pricing</Link>
              <Link href="/contact" className={`block px-4 py-2 text-2xl mb-4 ${isActive('/contact') ? 'bg-white bg-opacity-20 font-bold' : 'text-white'}`} onClick={toggleMenu}>Contact Us</Link>
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="block px-4 py-2 text-2xl mb-4 text-white rounded"
              >
                {isLoggingOut ? <ClipLoader color="#ffffff" size={20} /> : 'Logout'}
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="flex items-center space-x-6">
          
          <Link href="/home" className={`text-[1.3vw] px-3 py-1 rounded ${isActive('/') ? 'bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg font-bold' : 'text-white hover:text-gray-300'}`}>Home</Link>
          <Link href="/about" className={`text-[1.3vw] px-3 py-1 rounded ${isActive('/about') ? 'bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg font-bold' : 'text-white hover:text-gray-300'}`}>About</Link>
          <Link href="/pricing" className={`text-[1.3vw] px-3 py-1 rounded ${isActive('/pricing') ? 'bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg font-bold' : 'text-white hover:text-gray-300'}`}>Pricing</Link>
          <Link href="/contact" className={`text-[1.3vw] px-3 py-1 rounded ${isActive('/contact') ? 'bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg font-bold' : 'text-white hover:text-gray-300'}`}>Contact Us</Link>
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="text-[1.3vw] px-3 py-1 rounded text-white"
          >
            {isLoggingOut ? <ClipLoader color="#ffffff" size={20} /> : 'Logout'}
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
