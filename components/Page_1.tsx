"use client";
import React, { useState, useCallback } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const Page_1: React.FC = () => {
  const [text, setText] = useState("");
  const [AiGenWords, setAiGenWords] = useState("0");
  const [fakePercentage, setFakePercentage] = useState("0");
  const [isHuman, setIsHuman] = useState("0");

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
        toast.error("You have reached 1000 words!", {
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
  const wordLimit = 1000;

  return (
    <>
      <div className="min-h-screen text-white p-6" id="bgPage1">
        <header className="text-center">
          <h1 className="text-[4vw] font-bold ">
            <span className=" bg-[linear-gradient(180deg,_#8d21fb,_#d089ff,_#FF8CDF)] bg-clip-text text-transparent ">
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

        <main className="flex flex-col items-center  mt-8">
          <div className="w-[90%] flex justify-between items-center gap-[3vw]">
            <div className="bg-white text-black rounded-md shadow-md p-6 w-full ">
              <h2 className="text-xl font-semibold">Examples:</h2>
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
                  disabled={wordCount >= 1000}
                  className="py-1 px-4 rounded "
                  style={{
                    backgroundColor: wordCount >= 1000 ? "#EF4444"  : "#3B82F6",
                    color: "white",
                  }}
                >
                  {wordCount >= 1000 ? "Limit Reached!" : "Submit"}
                </button>
                <p style={{ color: wordCount >= 1000 ? "#EF4444" : "#000000" }}>
                  Word count: {wordCount} / {wordLimit}
                </p>
              </div>
            </div>

            <aside className="bg-white text-black rounded-md shadow-md p-4 w-full max-w-xs">
              <h2 className="text-xl font-semibold m-[0.5vw_0vw]">
                View full report here :
              </h2>
              <ul className="list-disc list-inside mt-2">
                <h2 className="m-[1vw_0vw] text-xl">Text words: <span style={{ color: wordCount >= 1000 ? "#EF4444" : "#000000" }}>{wordCount} words</span></h2>
                <h2 className="m-[1vw_0vw] text-xl">AI words count: <span>{AiGenWords} words</span></h2>
                <h2 className="m-[1vw_0vw] text-xl">AI : <span>{fakePercentage} %</span></h2>
                <h2 className="m-[1vw_0vw] text-xl">Human : <span>{isHuman} %</span></h2>
              </ul>
            </aside>
          </div>
          <p className="mt-[1.5vw] text-[.7vw]">
            Certain platforms, like Grammarly, use ChatGPT and other genAI
            models for key functionalities and can be flagged as potential AI
            content.<span className="text-blue-500"> Read the article</span>
          </p>
        </main>
      </div>
      <ToastContainer />
    </>
  );
};

export default Page_1;
