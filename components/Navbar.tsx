"use client"

import React from 'react';
import Image from "next/image";
import Logo from  "@/assets/logo.svg";
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Navbar = () => {
  const pathname = usePathname();

  return (
    <>
    <nav className="bg-transparent text-white px-[2.5vw] py-[1vw] flex justify-between items-center">
        <div className="flex gap-[2vw]">
          <Link href="/">
            <Image src={Logo} alt="Logo"/>
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
          <div className="flex gap-[2vw]">
            <button className="py-[.7vw] px-[2vw] rounded-full rounded-tr-none text-[#3F9AF5] border border-solid border-[#3F9AF5]">
              Sign Up
            </button>
            <button className="py-[.7vw] px-[2vw] bg-[#3F9AF5] rounded-full rounded-tr-none border border-solid border-[#3F9AF5]">
              Login
            </button>
          </div>
        </div>
      </nav>
    </>
  )
}

export default Navbar