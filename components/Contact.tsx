"use client";

import React, { useState, useCallback } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { motion } from "framer-motion";
import { useDropzone } from "react-dropzone";
import {
  FiUser,
  FiMail,
  FiMessageSquare,
  FiTag,
  FiList,
  FiPaperclip,
} from "react-icons/fi";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    topic: "",
    message: "",
    attachment: null as File | null,
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFormData((prevState) => ({
      ...prevState,
      attachment: acceptedFiles[0],
    }));
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    setFormData({
      name: "",
      email: "",
      subject: "",
      topic: "",
      message: "",
      attachment: null,
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  return (
    <>
      <div
        className="min-h-screen w-full pb-[4vw] text-white bg-gradient-to-br from-purple-800 via-indigo-900 to-blue-900"
        id="bgPage1Contact"
      >
        <Navbar />
        <motion.div
          className="container mx-auto px-4 py-10 md:py-20"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.h1
            className="text-4xl md:text-7xl font-extrabold text-center mb-8 md:mb-16 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500"
            variants={itemVariants}
          >
            Get in Touch
          </motion.h1>
          <motion.form
            onSubmit={handleSubmit}
            className="max-w-2xl mx-auto bg-white/10 backdrop-blur-md rounded-2xl p-6 md:p-10 shadow-2xl"
            variants={containerVariants}
          >
            <motion.div className="mb-6 md:mb-8" variants={itemVariants}>
              <label
                htmlFor="name"
                className="mb-2 text-base md:text-lg font-medium text-white flex items-center"
              >
                <FiUser className="mr-2" /> Your Name
              </label>
              <motion.input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 md:px-5 md:py-4 text-white bg-[#1C2951] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out text-base md:text-lg"
                required
                placeholder="John Doe"
                whileHover={{ scale: 1.02 }}
                whileFocus={{ scale: 1.02 }}
              />
            </motion.div>
            <motion.div className="mb-6 md:mb-8" variants={itemVariants}>
              <label
                htmlFor="email"
                className="mb-2 text-base md:text-lg font-medium text-white flex items-center"
              >
                <FiMail className="mr-2" /> Your Email
              </label>
              <motion.input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 md:px-5 md:py-4 text-white bg-[#1C2951] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out text-base md:text-lg"
                required
                placeholder="johndoe@example.com"
                whileHover={{ scale: 1.02 }}
                whileFocus={{ scale: 1.02 }}
              />
            </motion.div>
            <motion.div className="mb-6 md:mb-8" variants={itemVariants}>
              <label
                htmlFor="subject"
                className="mb-2 text-base md:text-lg font-medium text-white flex items-center"
              >
                <FiTag className="mr-2" /> Subject
              </label>
              <motion.input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="w-full px-4 py-3 md:px-5 md:py-4 text-white bg-[#1C2951] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out text-base md:text-lg"
                required
                placeholder="Enter subject"
                whileHover={{ scale: 1.02 }}
                whileFocus={{ scale: 1.02 }}
              />
            </motion.div>
            <motion.div className="mb-6 md:mb-8" variants={itemVariants}>
              <label
                htmlFor="topic"
                className="mb-2 text-base md:text-lg font-medium text-white flex items-center"
              >
                <FiList className="mr-2" /> Topic
              </label>
              <motion.select
                id="topic"
                name="topic"
                value={formData.topic}
                onChange={handleChange}
                className="w-full px-4 py-3 md:px-5 md:py-4 text-white bg-[#1C2951] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out text-base md:text-lg"
                required
                whileHover={{ scale: 1.02 }}
                whileFocus={{ scale: 1.02 }}
              >
                <option value="">Select a topic</option>
                <option value="general">General Inquiry</option>
                <option value="support">Technical Support</option>
                <option value="feedback">Feedback</option>
                <option value="other">Other</option>
              </motion.select>
            </motion.div>
            <motion.div className="mb-6 md:mb-8" variants={itemVariants}>
              <label
                htmlFor="message"
                className="mb-2 text-base md:text-lg font-medium text-white flex items-center"
              >
                <FiMessageSquare className="mr-2" /> Your Message
              </label>
              <motion.textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={5}
                className="w-full px-4 py-3 md:px-5 md:py-4 text-white bg-[#1C2951] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out resize-none text-base md:text-lg"
                required
                placeholder="Your message here..."
                whileHover={{ scale: 1.02 }}
                whileFocus={{ scale: 1.02 }}
              ></motion.textarea>
            </motion.div>
            <motion.div className="mb-6 md:mb-8" variants={itemVariants}>
              <label
                htmlFor="attachment"
                className="mb-2 text-base md:text-lg font-medium text-white flex items-center"
              >
                <FiPaperclip className="mr-2" /> Attachment
              </label>
              <div {...getRootProps()} className="dropzone">
                <input {...getInputProps()} />
                <motion.div
                  className={`w-full px-4 py-3 md:px-5 md:py-4 text-white bg-[#1C2951] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out cursor-pointer ${
                    isDragActive ? "border-2 border-dashed border-blue-500" : ""
                  }`}
                  whileHover={{ scale: 1.02 }}
                >
                  {isDragActive ? (
                    <p className="text-center text-base md:text-lg">
                      Drop the files here ...
                    </p>
                  ) : (
                    <p className="text-center text-base md:text-lg">
                      Drag &apos;n&apos; drop some files here, or click to
                      select files
                    </p>
                  )}
                </motion.div>
              </div>
              {formData.attachment && (
                <p className="mt-2 text-sm text-blue-200">
                  File: {formData.attachment.name}
                </p>
              )}
            </motion.div>
            <motion.button
              type="submit"
              className="w-full py-3 md:py-4 px-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-lg md:text-xl font-bold rounded-lg hover:from-blue-600 hover:to-purple-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              variants={itemVariants}
            >
              Send Message
            </motion.button>
          </motion.form>
        </motion.div>
      </div>
      <Footer />
    </>
  );
};

export default Contact;
