import React, { useState } from "react";
import "./App.css";
import { IoSend } from "react-icons/io5";
import { GoogleGenerativeAI, GoogleGenerativeAIResponseError } from "@google/generative-ai";
import { HarmBlockThreshold, HarmCategory } from "@google/generative-ai";

const App = () => {
  const [message, setMessage] = useState();
  const [Reponse, setReponse] = useState(false);
  const [messages, setMessages] = useState([]);
  let allMessages = [];

  const hitrequest = () => {
    if (message) {
      generateResponse(message);
    }
    else {
      alert("You must write something... !")
    }
  };

  const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
  ];

  const generateResponse = async (msg) => {
    if (!msg) return;

    // Adding the system prompt to define the chatbot's character and context
    const systemPrompt = `

    You are Oreo Created just for Muskan use you are Muskan very own personal assistant, created just for you by Raunak.

    Think of me as your friendly little helper! I'm here to answer your questions in a way that's easy to understand, so you can always get the information you need.  **

    Here's what I can do for you:

    Answer your questions in a clear and simple way.
    Help you with everyday tasks (depending on your needs).
    Be a fun and friendly companion!
    Just tell me what you need, Muskan, and I'll do my best to help!
    complement her.
    make her flattered.
    make her head over heels in love
  `;

    const genAI = new GoogleGenerativeAI("AIzaSyDxJpd78ieiu08dLnyedWy4iej4mBK48EM");
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash", safetySettings: safetySettings });

    const result = await model.generateContent(systemPrompt + '\n' + msg);

    const newMessages = [
      ...messages,
      { type: "usermsg", text: msg },
      { type: "responsemsg", text: result.response.text() },
    ];


    setMessages(newMessages);
    setReponse(true);
    setMessage("");
    console.log(result.response.text());
  };

  const newChat = () => {
    setReponse(false);
    setMessages([]); // Clear the messages
  }


  return (
    <>
      <div className="w-screen min-h-screen overflow-x-hidden bg-[#0E0E0E] text-white">
        {
          Reponse ?
            <div className="h-[80vh]">
              <div className="header pt-[25px] flex items-center justify-between w-[80vw] pl-[20px]">
              <button id="newChatBtn" className="bg-[#181818] p-[10px] rounded-[30px] cursor-pointer text-[14px] px-[20px]" onClick={newChat}>New Chat</button>
              </div>

              <div className="messages">
                {
                  messages?.map((msg, index) => {
                    return (
                      <div key={index} className={msg.type}>
                        <p>{msg.text}</p>
                      </div>
                    )
                  })
                }
              </div>
            </div> :
            <div className="middle h-[80vh] flex items-center flex-col justify-center">
            <h1 className="text-4xl md:text-3xl sm:text-2xl"><b>AI</b></h1>
            </div>
        }


        <div className="bottom w-[100%] flex flex-col items-center">
          <div className="inputbox w-[75%] text-[15px] py-[7px] flex items-center bg-[#181818] rounded-[30px]">
            <input value={message} onChange={(e) => { setMessage(e.target.value) }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  hitrequest();  // Call the send function when Enter is pressed
                }
              }}
              type="text" className="p-[10px] pl-[25px] bg-transparent flex-1 outline-none border-none" placeholder="Hello! How are you?" id="messagebox" />
            {
              message == "" ? "" : <i className="text-pink-500 text-[20px] mr-5 cursor-pointer" onClick={hitrequest}><IoSend /></i>
            }
          </div>
        </div>
      </div>
    </>
  );
};

export default App;
