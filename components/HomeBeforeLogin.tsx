"use client";
import React, { useState, useCallback } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NavbarBeforeLogin from "./NavbarBeforeLogin";
import Footer from "./Footer";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { ClipLoader } from "react-spinners";

const HomeBeforeLogin: React.FC = () => {
  const [text, setText] = useState("");
  const [aiGenWords] = useState("0");
  const [fakePercentage] = useState("0");
  const [humanPercentage] = useState("100");
  const [sentences] = useState([]);
  const [analysisText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const genAns = async () => {
    if (text.trim() === "") {
      toast.error("Please enter some text before analyzing.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Simulate analysis process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.warn("Please Login to continue...", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });

      // Wait for toast to be visible
      await new Promise(resolve => setTimeout(resolve, 5000));

      // Redirect to login page
      router.push('/login');
    } catch (error: unknown) {
      console.error('Error during analysis or redirection:', error);
      toast.error('An error occurred. Please try again.', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    } finally {
      setIsLoading(false);
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
        toast.error("You've reached the 500 word limit!", {
          position: "top-right",
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
    <>
      <div
        className="min-h-screen w-full pb-[4vw] text-white bg-gradient-to-br from-purple-800 via-indigo-900 to-blue-900"
        id="bgPage1Home"
      >
        <NavbarBeforeLogin />
        <motion.header
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-center py-6 md:py-12 lg:py-12 px-4"
        >
          <h1 className="text-4xl md:text-6xl lg:text-6xl font-bold mb-4">
            <motion.span
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
              className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent"
            >
              AI Detector
            </motion.span>{" "}
            By Contentleaks
          </h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="text-lg md:text-xl max-w-3xl mx-auto"
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
            className="bg-white text-gray-800 rounded-lg shadow-xl p-4 md:p-8 mb-8"
          >
            <h2 className="font-bold text-center text-2xl md:text-3xl mb-6">
              Was this text written by a human or AI?
            </h2>
            <h3 className="text-lg md:text-xl font-semibold mb-4">
              Try detecting one of our sample texts:
            </h3>
            <div className="flex flex-wrap gap-2 md:gap-4 sm:hidden mb-6">
              {["ChatGPT", "Gemini", "Human", "AI + Human"].map((btn) => (
                <motion.button
                  key={btn}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-3 md:px-4 rounded-full transition duration-300 text-sm md:text-base"
                >
                  {btn}
                </motion.button>
              ))}
            </div>

            <textarea
              value={text}
              onChange={handleChange}
              rows={8}
              className="w-full p-3 md:p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-300 text-sm md:text-base resize-none"
              placeholder="Enter your text here (max 500 words)"
              style={{
                minHeight: '150px',
                fontSize: '16px',
                lineHeight: '1.5',
                WebkitAppearance: 'none',
              }}
            />

            <div className="flex sm:flex-col md:flex-row justify-between items-center mt-4 gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={genAns}
                disabled={wordCount === 0 || wordCount >= 500 || isLoading}
                className={`sm:w-full lg:w-auto md:w-auto py-2 px-6 rounded-full text-white font-semibold transition duration-300 ${
                  wordCount === 0 || wordCount >= 500 || isLoading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-500 hover:bg-blue-600"
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <ClipLoader color="#ffffff" loading={true} size={20} />
                    <span className="ml-2">Analyzing...</span>
                  </div>
                ) : wordCount === 0
                  ? "Enter text"
                  : wordCount >= 500
                  ? "Limit Reached!"
                  : "Analyze"}
              </motion.button>
              <p
                className={`font-medium ${
                  wordCount >= 500 ? "text-red-500" : "text-gray-600"
                }`}
              >
                Word count: {wordCount} / {wordLimit}
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            className="bg-white text-gray-800 rounded-lg shadow-xl p-4 md:p-8"
          >
            <h2 className="text-2xl md:text-3xl text-center font-bold mb-6">
              Analysis Report
            </h2>
            {isLoading ? (
              <div className="flex justify-center items-center">
                <ClipLoader color="#123abc" loading={true} size={50} />
              </div>
            ) : analysisText ? (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="text-base md:text-lg mb-6 p-4 bg-blue-100 rounded-lg"
              >
                {analysisText}
              </motion.p>
            ) : (
              <p className="text-center text-lg md:text-xl">No analysis available yet. Please enter text and click &apos;Analyze&apos;.</p>
            )}
            {!isLoading && analysisText && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-8">
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <h3 className="text-lg md:text-xl font-semibold mb-2">Text Statistics</h3>
                    <p>
                      Total words: <span className="font-bold">{wordCount}</span>
                    </p>
                    <p>
                      AI-generated words:{" "}
                      <span className="font-bold">{aiGenWords}</span>
                    </p>
                  </div>
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <h3 className="text-lg md:text-xl font-semibold mb-2">Content Origin</h3>
                    <p>
                      AI content:{" "}
                      <span className="font-bold text-red-500">
                        {fakePercentage}%
                      </span>
                    </p>
                    <p>
                      Human content:{" "}
                      <span className="font-bold text-green-500">
                        {humanPercentage}%
                      </span>
                    </p>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg md:text-xl font-semibold mb-4">
                    AI-detected sentences:{" "}
                    <span className="font-bold">{sentences.length}</span>
                  </h3>
                  <ul className="space-y-2">
                    {sentences.map((sentence, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1.4 + i * 0.1 }}
                        className="bg-red-100 p-3 rounded-lg text-sm md:text-base"
                      >
                        <span className="font-bold mr-2">{i + 1}.</span>
                        {sentence}
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </>
            )}
          </motion.div>
        </motion.main>
        <ToastContainer />
      </div>
      <Footer />
    </>
  );
};

export default HomeBeforeLogin;
