"use client";
import React, { useState, useCallback } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NavbarBeforeLogin from "./NavbarBeforeLogin";
import Footer from "./Footer";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { ClipLoader } from "react-spinners";
import axios from "axios";

const HomeBeforeLogin: React.FC = () => {
  const [text, setText] = useState("");
  const [aiGenWords, setAiGenWords] = useState("0");
  const [fakePercentage, setFakePercentage] = useState("0");
  const [humanPercentage, setHumanPercentage] = useState("100");
  const [sentences, setSentences] = useState<string[]>([]);
  const [analysisText, setAnalysisText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasAnalyzed, setHasAnalyzed] = useState(false);
  const router = useRouter();

  const wordLimit = 500;
  const minWords = 50;

  const showToast = (
    type: "error" | "warn" | "success",
    message: string,
    autoClose = 3000
  ) => {
    toast[type](message, {
      position: "top-right",
      autoClose,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
  };

  const validateText = (wordCount: number): boolean => {
    if (text.trim() === "") {
      showToast("error", "Please enter some text before analyzing.");
      return false;
    }

    if (wordCount < minWords) {
      showToast(
        "error",
        `Please enter at least ${minWords} words for analysis.`
      );
      return false;
    }

    if (hasAnalyzed) {
      showToast("warn", "Please login to analyze more text!");
      setTimeout(() => router.push("/login"), 3000);
      return false;
    }

    return true;
  };

  const genAns = async () => {
    const wordCount = text.trim().split(/\s+/).length;

    if (!validateText(wordCount)) return;

    setIsLoading(true);
    try {
      const response = await axios.post(
        process.env.NEXT_PUBLIC_API_URL ?? "",
        { text },
        {
          headers: {
            "x-rapidapi-key": process.env.NEXT_PUBLIC_RAPIDAPI_KEY ?? "",
            "x-rapidapi-host": process.env.NEXT_PUBLIC_RAPIDAPI_HOST,
            "Content-Type": "application/json",
          },
        }
      );

      const {
        aiWords,
        fakePercentage: fakePercent,
        sentences: detectedSentences,
      } = response.data;

      setAiGenWords(aiWords);
      setFakePercentage(fakePercent);
      setHumanPercentage((100 - parseFloat(fakePercent)).toFixed(2));
      setSentences(detectedSentences);

      const analysisResult = `Based on our analysis, ${fakePercent}% of the content appears to be AI-generated. We detected ${aiWords} AI-generated words out of a total of ${wordCount} words. ${detectedSentences.length} sentences were flagged as potentially AI-written.`;
      setAnalysisText(analysisResult);
      setHasAnalyzed(true);

      showToast(
        "success",
        "Analysis complete! Login to analyze more text.",
        5000
      );
    } catch (error: unknown) {
      console.error("Error during analysis:", error);
      setAnalysisText(
        "An error occurred during the analysis. Please try again."
      );
      showToast("error", "Failed to analyze the text. Please try again.", 5000);
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
        showToast("error", `You've reached the ${wordLimit} word limit!`);
      }
    },
    []
  );

  const wordCount = text.trim().split(/\s+/).length;

  const sampleTexts = ["ChatGPT", "Gemini", "Human", "AI + Human"];

  const handleSampleText = (type: string) => {
    switch (type) {
      case "ChatGPT":
        setText(
          "As an AI language model, I find the concept of consciousness fascinating. While I can process information and generate responses, the question of whether I truly 'experience' or 'understand' in the way humans do remains a complex philosophical debate. I can analyze patterns, generate text, and engage in conversations, but my responses are based on training data and algorithms rather than genuine emotional or conscious experiences. This raises interesting questions about the nature of intelligence, consciousness, and what it truly means to 'think' or 'feel'."
        );
        break;
      case "Gemini":
        setText(
          "The integration of quantum computing with artificial intelligence represents a groundbreaking frontier in technology. By leveraging quantum mechanical phenomena like superposition and entanglement, quantum computers can potentially solve complex problems exponentially faster than classical computers. This convergence could revolutionize fields ranging from drug discovery to climate modeling, while raising important questions about computational limits and technological ethics."
        );
        break;
      case "Human":
        setText(
          "O say can you see, by the dawn’s early light, What so proudly we hail’d at the twilight’s last gleaming,Whose broad stripes and bright stars through the perilous fight O’er the ramparts we watch’d were so gallantly streaming? And the rocket’s red glare, the bombs bursting in air, Gave proof through the night that our flag was still there, O say does that star-spangled banner yet wave O’er the land of the free and the home of the brave? "
        );
        break;
      case "AI + Human":
        setText(
          "While AI wrote the technical analysis of climate change data, I added personal observations from my years as an environmental scientist. The resulting report combined AI's ability to process vast amounts of data with human insights and emotional context. The AI highlighted concerning trends in global temperature rises, while I contributed first-hand accounts of changing ecosystems in the Amazon rainforest. This collaboration produced a more comprehensive and engaging document than either could have created alone."
        );
        break;
    }
  };

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
            <div className="flex flex-wrap gap-3 md:gap-5 sm:hidden mb-8">
              {sampleTexts.map((btn) => (
                <motion.button
                  key={btn}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSampleText(btn)}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2.5 px-4 md:px-6 rounded-full transition-all duration-300 text-sm md:text-base font-medium shadow-lg hover:shadow-blue-500/30 hover:from-blue-600 hover:to-blue-700 active:scale-95"
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
              placeholder="Please enter at least 50 words of text to analyze. You can write up to 500 words. Try pasting an article, essay, or any content you'd like to check for AI detection."
              style={{
                minHeight: "50px",
                fontSize: "16px",
                lineHeight: "1.5",
                WebkitAppearance: "none",
              }}
            />

            <div className="flex sm:flex-col md:flex-row justify-between items-center mt-4 gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={genAns}
                disabled={
                  wordCount < minWords || wordCount >= wordLimit || isLoading
                }
                className={`sm:w-full lg:w-auto md:w-auto py-2 px-6 rounded-full text-white font-semibold transition duration-300 ${
                  wordCount < minWords || wordCount >= wordLimit || isLoading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-500 hover:bg-blue-600"
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <ClipLoader color="#ffffff" loading={true} size={20} />
                    <span className="ml-2">Analyzing...</span>
                  </div>
                ) : wordCount < 50 ? (
                  "Min 50 words"
                ) : wordCount >= 500 ? (
                  "Limit Reached!"
                ) : (
                  "Analyze"
                )}
              </motion.button>
              <p
                className={`font-medium ${
                  wordCount >= wordLimit
                    ? "text-red-500"
                    : wordCount < minWords
                    ? "text-yellow-500"
                    : "text-gray-600"
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
              <p className="text-center text-lg md:text-xl">
                No analysis available yet. Please enter text and click
                &apos;Analyze&apos;.
              </p>
            )}
            {!isLoading && analysisText && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-8">
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <h3 className="text-lg md:text-xl font-semibold mb-2">
                      Text Statistics
                    </h3>
                    <p>
                      Total words:{" "}
                      <span className="font-bold">{wordCount}</span>
                    </p>
                    <p>
                      AI-generated words:{" "}
                      <span className="font-bold">{aiGenWords}</span>
                    </p>
                  </div>
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <h3 className="text-lg md:text-xl font-semibold mb-2">
                      Content Origin
                    </h3>
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
