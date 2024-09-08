import React, { useState } from "react";
import "../styles/Dashboard.css";

const BASE_URL = process.env.REACT_APP_BASE_URL;

const Dashboard = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const handleSendMessage = async () => {
    if (input.trim()) {
      const newMessage = { text: "Input : " + input, isUser: true };
      setMessages([...messages, newMessage]);
      setInput("");
      try {
        const response = await fetch(`${BASE_URL}generate`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ prompt: input }),
        });

        const data = await response.json();
        console.log(data);
        const responseMessage = {
          text: data.result,
          isUser: false,
        };
        setMessages((prevMessages) => [...prevMessages, responseMessage]);
      } catch (error) {
        console.error("Error fetching API:", error);
        const errorMessage = {
          text: "Sorry, something went wrong. Please try again later.",
          isUser: false,
        };
        setMessages((prevMessages) => [...prevMessages, errorMessage]);
      }

      setInput("");
    }
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };
  const renderMessageText = (text) => {
    const parts = text.split(/(\*\*[^*]+\*\*)/g);

    return parts.map((part, index) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={index}>{part.slice(2, -2)}</strong>;
      }
      return <span key={index}>{part}</span>;
    });
  };
  return (
    <div className="chat-container">
      <div className="chat-window">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`chat-message ${
              message.isUser ? "user-message" : "response-message"
            }`}
            style={{
              width: `${Math.min(80, message.text.length)}%`,
            }}
          >
            {renderMessageText(message.text)}
          </div>
        ))}
      </div>

      <div className="chat-input-container">
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder="Type your message..."
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Dashboard;
