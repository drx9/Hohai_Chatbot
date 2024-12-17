"use client";

import {  useState, FormEvent } from "react";

type Message = {
  sender: "user" | "bot";
  text: string;
};

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    { sender: "bot", text: "Hello! How can I help you today?" },
  ]);
  const [input, setInput] = useState<string>("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (input.trim() === "") return;

    // Add the user message to the chat
    const newMessages: Message[] = [...messages, { sender: "user", text: input }];
    setMessages(newMessages);
    setInput("");

    try {
      // Call your API endpoint to get the response
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      if (!response.ok) {
        throw new Error("Error fetching response");
      }

      const data = await response.json();
      // Add the bot response to the chat
      setMessages([...newMessages, { sender: "bot", text: data.response }]);
    } catch (error) {
      console.error("Error:", error);
      setMessages([
        ...newMessages,
        { sender: "bot", text: "Sorry, I am unable to respond at the moment." },
      ]);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-4">
        <h1 className="text-2xl font-bold text-center mb-4">Chatbot</h1>
        <div className="flex flex-col space-y-4 overflow-y-auto max-h-80 mb-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`p-2 rounded-lg ${
                msg.sender === "bot"
                  ? "bg-blue-100 text-left"
                  : "bg-green-100 text-right"
              }`}
            >
              {msg.text}
            </div>
          ))}
        </div>
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 p-2 border rounded-lg"
          />
          <button
            type="submit"
            className="p-2 bg-blue-500 text-white rounded-lg"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
