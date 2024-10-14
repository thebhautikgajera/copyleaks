"use client"

import React from 'react';
import Image from "next/image";
import Logo from  "../assets/logo.png";
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Navbar = () => {
  const pathname = usePathname();

  return (
    <>
    <nav className="bg-transparent text-white px-[2.5vw] py-[1vw] flex justify-between items-center">
        <div className="flex gap-[2vw]">
          <Link href="/">
            <Image src={Logo} height={220} width={200} alt="Logo"/>
          </Link>
        </div>
        <div className="flex justify-between gap-[2vw] items-center">
          <Link href="/" className={`py-[.7vw] px-[2vw] flex items-center gap-[2vw] ${pathname === '/' ? 'bg-[#1C2951] rounded-md' : ''}`}>
            Home
          </Link>
          <Link href="/about" className={`py-[.7vw] px-[2vw] flex items-center gap-[2vw] ${pathname === '/about' ? 'bg-[#1C2951] rounded-md' : ''}`}>
            About
          </Link>
          <Link href="/pricing" className={`py-[.7vw] px-[2vw] flex items-center gap-[2vw] ${pathname === '/pricing' ? 'bg-[#1C2951] rounded-md' : ''}`}>
            Pricing
          </Link>
          <Link href="/contact" className={`py-[.7vw] px-[2vw] flex items-center gap-[2vw] ${pathname === '/contact' ? 'bg-[#1C2951] rounded-md' : ''}`}>
            Contact
          </Link>
        </div>
      </nav>
    </>
  )
}

export default Navbar