// src/Chatbot.js
import React from "react";
import { Chatbot } from "react-chatbot-kit";
import config from "../chat/config";
import ActionProvider from "../chat/actionProvider";
import MessageParser from "../chat/messageParser";
import "react-chatbot-kit/build/main.css";

const ChatbotComponent = () => {
  return (
    <div className="chatbot-container">
      <Chatbot
        config={config}
        actionProvider={ActionProvider}
        messageParser={MessageParser}
      />
    </div>
  );
};

export default ChatbotComponent;