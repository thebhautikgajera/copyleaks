"use client";
import React, { useState, useCallback } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import Navbar from "./Navbar";

const Page_1: React.FC = () => {
  const [text, setText] = useState("");
  const [AiGenWords, setAiGenWords] = useState("0");
  const [fakePercentage, setFakePercentage] = useState("0");
  const [isHuman, setIsHuman] = useState("0");
  const [sentences, setSentences] = useState([]);

  const genAns = async () => {
    const options = await axios({
      method: "POST",
      url: "https://ai-content-detector-ai-gpt.p.rapidapi.com/api/detectText/",
      headers: {
        "x-rapidapi-key": "07a09ee154mshda09783fcd25921p1a09f7jsn995f87a21cd8",
        "x-rapidapi-host": "ai-content-detector-ai-gpt.p.rapidapi.com",
        "Content-Type": "application/json",
      },
      data: {
        text: text,
      },
    });

    setAiGenWords(options.data.aiWords);
    setFakePercentage(options.data.fakePercentage);
    setIsHuman(options.data.isHuman);
    setSentences(options.data.sentences);
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
        toast.error("You have reached 500 words!", {
          position: "bottom-right",
          autoClose: 5000,
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
      <div className="min-h-screen w-full text-white p-6 bg-gradient-to-br from-purple-800 via-indigo-900 to-blue-900" id="bgPage1">
        <Navbar />
        <header className="text-center">
          <h1 className="text-[4vw] font-bold ">
            <span className="bg-[linear-gradient(180deg,_#8d21fb,_#d089ff,_#FF8CDF)] bg-clip-text text-transparent">
              AI Detector
            </span>{" "}
            By Copyleaks
          </h1>
          <p className="mt-[2vw] text-[1.5vw]">
            The most accurate AI content detector and ChatGPT checker, trusted
            by top <br /> organizations worldwide and backed by{" "}
            <a href="#" className="text-yellow-500">
              independent studies
            </a>
            .
          </p>
        </header>

        <main className="flex flex-col items-center mt-8">
          <div className="w-[90%] flex justify-between items-center gap-[3vw]">
            <div className="bg-white text-black rounded-md shadow-md p-6 w-full ">
              <h2 className="font-bold text-center text-3xl m-[0.5vw_0vw_2vw_0vw]">
                Was this text written by a human or AI?
              </h2>
              <h2 className="text-xl font-semibold">
                Try detecting one of our sample texts:
              </h2>
              <div className="flex space-x-4 mt-2">
                <button className="bg-blue-500 text-white py-1 px-2 rounded">
                  ChatGPT
                </button>
                <button className="bg-blue-500 text-white py-1 px-2 rounded">
                  Gemini
                </button>
                <button className="bg-blue-500 text-white py-1 px-2 rounded">
                  Human
                </button>
                <button className="bg-blue-500 text-white py-1 px-2 rounded">
                  AI + Human
                </button>
              </div>

              <textarea
                value={text}
                onChange={handleChange}
                rows={10}
                cols={50}
                className="mt-4 w-full p-2 border border-gray-300 rounded-md"
                placeholder="Enter your text here (max 1000 words)"
              />

              <div className="flex justify-between items-center mt-4 ">
                <button
                  onClick={genAns}
                  disabled={wordCount >= 500}
                  className="py-1 px-4 rounded "
                  style={{
                    backgroundColor: wordCount >= 500 ? "#EF4444" : "#3B82F6",
                    color: "white",
                  }}
                >
                  {wordCount >= 500 ? "Limit Reached!" : "Submit"}
                </button>
                <p style={{ color: wordCount >= 500 ? "#EF4444" : "#000000" }}>
                  Word count: {wordCount} / {wordLimit}
                </p>
              </div>
            </div>
          </div>
          <aside className="bg-white text-black rounded-md shadow-md p-[1vw_3vw_1vw_3vw] w-full mt-8">
            <h2 className="text-3xl text-center font-semibold m-[0.5vw_0vw]">
              View full report here :
            </h2>
            <ul className="list-disc list-inside mt-2">
              <h2 className="m-[1vw_0vw] text-xl">
                Text words:{" "}
                <span
                  style={{ color: wordCount >= 1000 ? "#EF4444" : "#000000" }}
                >
                  {wordCount} words
                </span>
              </h2>
              <h2 className="m-[1vw_0vw] text-xl">
                AI words count: <span>{AiGenWords} words</span>
              </h2>
              <h2 className="m-[1vw_0vw] text-xl">
                AI : <span>{fakePercentage} %</span>
              </h2>
              <h2 className="m-[1vw_0vw] text-xl">
                Human : <span>{isHuman} %</span>
              </h2>
              <h2 className="m-[1vw_0vw] text-xl">
                AI detected sentences :{" "}
                <span>{sentences.length} sentences detected</span>
              </h2>
              {sentences.map((sentence, i) => {
                return (
                  <p key={i}>
                    <span className="font-black">{i + 1}. </span>{sentence} <br />
                  </p>
                );
              })}
            </ul>
          </aside>
          {/* <p className="mt-[1.5vw] text-[.7vw]">
            Certain platforms, like Grammarly, use ChatGPT and other genAI
            models for key functionalities and can be flagged as potential AI
            content.<span className="text-blue-500"> Read the article</span>
          </p> */}
        </main>
      </div>
      <ToastContainer />
    </>
  );
};

export default Page_1;
