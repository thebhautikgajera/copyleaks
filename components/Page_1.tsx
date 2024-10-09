"use client";
import React, { useState, useCallback } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import Navbar from "./Navbar";
import { motion } from "framer-motion";

const Page_1: React.FC = () => {
  const [text, setText] = useState("");
  const [aiGenWords, setAiGenWords] = useState("0");
  const [fakePercentage, setFakePercentage] = useState("0");
  const [humanPercentage, setHumanPercentage] = useState("100");
  const [sentences, setSentences] = useState([]);

  const genAns = async () => {
    try {
      const response = await axios.post(
        "https://ai-content-detector-ai-gpt.p.rapidapi.com/api/detectText/",
        { text },
        {
          headers: {
            "x-rapidapi-key": "07a09ee154mshda09783fcd25921p1a09f7jsn995f87a21cd8",
            "x-rapidapi-host": "ai-content-detector-ai-gpt.p.rapidapi.com",
            "Content-Type": "application/json",
          },
        }
      );

      const { aiWords, fakePercentage, sentences } = response.data;
      setAiGenWords(aiWords);
      setFakePercentage(fakePercentage);
      setHumanPercentage((100 - parseFloat(fakePercentage)).toFixed(2));
      setSentences(sentences);
    } catch (error) {
      console.error("Error processing request:", error);
      toast.error("An error occurred while processing your request.");
    }
  };

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const inputText = e.target.value;
      const words = inputText.trim().split(/\s+/);

      if (words.length <= wordLimit) {
        setText(inputText);
      } else {
        const limitedText = words.slice(0, wordLimit).join(" ");
        setText(limitedText);
        toast.warning("You've reached the 500-word limit!", {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      }
    },
    []
  );

  const wordCount = text.trim().split(/\s+/).length;
  const wordLimit = 500;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="min-h-screen w-full pb-[4vw] text-white bg-gradient-to-br from-purple-800 via-indigo-900 to-blue-900" 
      id="bgPage1Home"
    >
      <Navbar />
      <motion.header 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="text-center py-12"
      >
        <h1 className="text-6xl font-bold mb-4">
          <motion.span 
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
            className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent"
          >
            AI Detector
          </motion.span>{" "}
          By Copyleaks
        </h1>
        <motion.p 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="text-xl max-w-3xl mx-auto"
        >
          The most accurate AI content detector and ChatGPT checker, trusted
          by top organizations worldwide and backed by{" "}
          <a href="#" className="text-yellow-300 hover:underline">
            independent studies
          </a>
          .
        </motion.p>
      </motion.header>

      <motion.main 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
        className="container mx-auto px-4"
      >
        <motion.div 
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
          className="bg-white text-gray-800 rounded-lg shadow-xl p-8 mb-8"
        >
          <h2 className="font-bold text-center text-3xl mb-6">
            Was this text written by a human or AI?
          </h2>
          <h3 className="text-xl font-semibold mb-4">
            Try detecting one of our sample texts:
          </h3>
          <div className="flex flex-wrap gap-4 mb-6">
            {["ChatGPT", "Gemini", "Human", "AI + Human"].map((btn) => (
              <motion.button
                key={btn}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-full transition duration-300"
              >
                {btn}
              </motion.button>
            ))}
          </div>

          <textarea
            value={text}
            onChange={handleChange}
            rows={10}
            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300"
            placeholder="Enter your text here (max 500 words)"
          />

          <div className="flex justify-between items-center mt-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={genAns}
              disabled={wordCount === 0 || wordCount >= 500}
              className={`py-2 px-6 rounded-full text-white font-semibold transition duration-300 ${
                wordCount === 0 || wordCount >= 500
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600"
              }`}
            >
              {wordCount === 0 ? "Enter text" : wordCount >= 500 ? "Limit Reached!" : "Analyze"}
            </motion.button>
            <p className={`font-medium ${wordCount >= 500 ? "text-red-500" : "text-gray-600"}`}>
              Word count: {wordCount} / {wordLimit}
            </p>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="bg-white text-gray-800 rounded-lg shadow-xl p-8"
        >
          <h2 className="text-3xl text-center font-bold mb-6">
            Analysis Report
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gray-100 p-4 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">Text Statistics</h3>
              <p>Total words: <span className="font-bold">{wordCount}</span></p>
              <p>AI-generated words: <span className="font-bold">{aiGenWords}</span></p>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">Content Origin</h3>
              <p>AI content: <span className="font-bold text-red-500">{fakePercentage}%</span></p>
              <p>Human content: <span className="font-bold text-green-500">{humanPercentage}%</span></p>
            </div>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4">AI-detected sentences: <span className="font-bold">{sentences.length}</span></h3>
            <ul className="space-y-2">
              {sentences.map((sentence, i) => (
                <motion.li 
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.4 + i * 0.1 }}
                  className="bg-red-100 p-3 rounded-lg"
                >
                  <span className="font-bold mr-2">{i + 1}.</span>{sentence}
                </motion.li>
              ))}
            </ul>
          </div>
        </motion.div>
      </motion.main>
      <ToastContainer />
    </motion.div>
  );
};

export default Page_1;
