import React from 'react';
import Image from "next/image";
import Logo from  "@/assets/logo.svg";

const Navbar = () => {
  return (
    <>
    <nav className=" bg-[#0B163E] text-white px-[2.5vw] py-[1vw] flex justify-between items-center ">
        <div className=" flex gap-[2vw]">
        <Image  src={Logo} alt="Logo Here"/>
        </div>
        <div className="flex justify-between gap-[2vw] items-center ">
          <a href="#" className="py-[.7vw] px-[2vw] flex items-center gap-[2vw]">
            English
          </a>
          <div className=" flex gap-[2vw]">
            <button className=" py-[.7vw] px-[2vw] rounded-full rounded-tr-none text-[#3F9AF5] border border-solid border-[#3F9AF5]">
              Sign Up
            </button>
            <button className=" py-[.7vw] px-[2vw] bg-[#3F9AF5] rounded-full rounded-tr-none border border-solid border-[#3F9AF5]">
              Login
            </button>
          </div>
        </div>
      </nav>
    </>
  )
}

export default Navbar