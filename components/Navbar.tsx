"use client"

import React, { useState, useEffect } from 'react';
import Image from "next/image";
import Logo from  "../assets/logo.png";
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Navbar = () => {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsMenuOpen(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-transparent text-white px-4 md:px-[2.5vw] py-4 md:py-[1vw]">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/">
          <Image src={Logo} height={isMobile ? 220 : 320} width={isMobile ? 200 : 270} alt="Logo" className="transition-all duration-300"/>
        </Link>
        {isMobile ? (
          <button onClick={toggleMenu} className="text-white focus:outline-none md:hidden">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        ) : (
          <div className="flex justify-between gap-[2vw] items-center">
            {['Home', 'About', 'Pricing', 'Contact'].map((item) => (
              <Link 
                key={item} 
                href={item === 'Home' ? '/' : `/${item.toLowerCase()}`} 
                className={`py-[.7vw] px-[2vw] flex items-center gap-[2vw] ${pathname === (item === 'Home' ? '/' : `/${item.toLowerCase()}`) ? 'bg-[#1C2951] rounded-md' : ''} hover:bg-[#2C3961] transition-colors duration-200`}
              >
                {item}
              </Link>
            ))}
          </div>
        )}
      </div>
      {isMobile && (
        <div className={`${isMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'} md:hidden overflow-hidden transition-all duration-300 ease-in-out`}>
          <div className="bg-[#1C2951] mt-4">
            {['Home', 'About', 'Pricing', 'Contact'].map((item) => (
              <Link 
                key={item} 
                href={item === 'Home' ? '/' : `/${item.toLowerCase()}`} 
                onClick={closeMenu}
                className={`block py-2 px-4 ${pathname === (item === 'Home' ? '/' : `/${item.toLowerCase()}`) ? 'bg-[#2C3961]' : ''} hover:bg-[#2C3961] transition-colors duration-200`}
              >
                {item}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar