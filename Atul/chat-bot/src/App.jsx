import React, { useState } from "react";
import axios from "axios";

const API_KEY = "AIzaSyCN88KAgxNadbYOTtoHoms0Ke00TUz81ac";

const menuDatabase = [
  { id: 1, name: "Margherita Pizza", category: "Pizza", price: 10, image: "🍕" },
  { id: 2, name: "Pepperoni Pizza", category: "Pizza", price: 12, image: "🍕" },
  { id: 3, name: "Caesar Salad", category: "Salad", price: 8, image: "🥗" },
  { id: 4, name: "Cheeseburger", category: "Burger", price: 11, image: "🍔" },
  { id: 5, name: "Pasta Alfredo", category: "Pasta", price: 13, image: "🍝" },
  { id: 6, name: "Grilled Chicken", category: "Main Course", price: 15, image: "🍗" },
];

const FoodOrderBot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [cart, setCart] = useState([]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage = { sender: "You", text: input };
    setMessages([...messages, userMessage]);
    setInput("");

    let botResponse = { sender: "FoodBot", text: "I couldn't understand that." };

    if (input.toLowerCase().includes("recommend")) {
      const recommendation = menuDatabase[Math.floor(Math.random() * menuDatabase.length)];
      botResponse.text = (
        <table className="w-full text-left border-collapse border border-gray-700 mt-2">
          <thead>
            <tr className="bg-gray-800 text-white">
              <th className="p-2 border border-gray-600">Item</th>
              <th className="p-2 border border-gray-600">Category</th>
              <th className="p-2 border border-gray-600">Price</th>
            </tr>
          </thead>
          <tbody>
            <tr className="bg-gray-700 text-white">
              <td className="p-2 border border-gray-600">{recommendation.image} {recommendation.name}</td>
              <td className="p-2 border border-gray-600">{recommendation.category}</td>
              <td className="p-2 border border-gray-600">${recommendation.price}</td>
            </tr>
          </tbody>
        </table>
      );
    } else if (input.toLowerCase().includes("order")) {
      const itemName = input.split("order ")[1];
      const item = menuDatabase.find((menuItem) => menuItem.name.toLowerCase() === itemName.toLowerCase());
      if (item) {
        setCart([...cart, item]);
        botResponse.text = `✅ *${item.name}* added to your order!\n🛒 Your total: $${cart.reduce((total, item) => total + item.price, item.price)}`;
      } else {
        botResponse.text = "Sorry, I couldn't find that item on the menu.";
      }
    } else {
      try {
        const response = await axios.post(
          "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent",
          {
            contents: [{ parts: [{ text: `Help with food ordering: ${input}` }] }],
            generationConfig: {
              maxOutputTokens: 150,
              temperature: 0.7,
            },
          },
          {
            headers: { "Content-Type": "application/json" },
            params: { key: API_KEY },
          }
        );

        botResponse.text = response.data.candidates[0]?.content?.parts[0]?.text || "I couldn't find any recommendations.";
      } catch (error) {
        console.error("Error fetching response:", error);
        botResponse.text = "Error processing request.";
      }
    }

    setMessages([...messages, userMessage, botResponse]);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4">
      <div className="w-full max-w-md p-4 border rounded-lg bg-gray-900">
        <h1 className="text-2xl font-bold text-center text-cyan-400 mb-4">🍽️ Food Order Bot</h1>
        <div className="h-80 overflow-y-auto p-2 border-b border-gray-700 space-y-2">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg max-w-xs whitespace-pre-line ${msg.sender === "You" ? "bg-cyan-500 self-end text-white" : "bg-green-600 self-start text-white"}`}
            >
              <strong>{msg.sender}:</strong> {msg.text}
            </div>
          ))}
        </div>
        <div className="flex items-center mt-2">
          <input
            type="text"
            className="flex-1 p-3 rounded bg-gray-700 text-white placeholder-gray-400"
            placeholder="Enter your order or ask for recommendations..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button
            onClick={sendMessage}
            className="ml-2 p-3 bg-cyan-500 text-white rounded hover:bg-cyan-600"
          >
            ➤
          </button>
        </div>
      </div>
    </div>
  );
};

export default FoodOrderBot;
