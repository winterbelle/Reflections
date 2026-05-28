import { useState } from "react";

function Chatbot() {
  // Stores all chatbot conversation messages
  const [messages, setMessages] = useState([]);

  // Stores the current user input
  const [input, setInput] = useState("");

  // Tracks loading state while waiting for chatbot response
  const [isLoading, setIsLoading] = useState(false);

  // Sends the user's message to the backend chatbot route
  const handleSendMessage = async () => {
    // Prevent empty submissions
    if (!input.trim()) return;

    // Create the user's message object
    const userMessage = {
      role: "user",
      content: input,
    };

    // Clear input after sending
    setInput("");

    // Add the user's message to the chat history
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    // Show loading state while waiting for chatbot response
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:3000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          message: input,
        }),
      });

      const data = await response.json();

      // Create chatbot response message
      const botMessage = {
        role: "assistant",
        content: data.reply,
      };

      // Add chatbot response to chat history
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error(error);

      // Fallback frontend error message
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          role: "assistant",
          content: "Unable to connect to chatbot right now.",
        },
      ]);
    }

    // Stop loading state
    setIsLoading(false);
  };

  return (
    <div>
      <h2>KindredParenting Chatbot</h2>

      {/* Displays the chatbot conversation */}
      <div>
        {messages.map((message, index) => (
          <p key={index}>
            <strong>{message.role}:</strong> {message.content}
          </p>
        ))}
      </div>
      {/* Chat input section */}
      <form
        onSubmit={(event) => {
          // Prevents full page refresh
          event.preventDefault();

          handleSendMessage();
        }}
      >
        <input
          type="text"
          placeholder="Ask a parenting question..."
          value={input}
          onChange={(event) => setInput(event.target.value)}
        />

        <button type="submit" disabled={isLoading}>
          Send
        </button>
      </form>

      {/* Loading feedback while waiting for chatbot */}
      {isLoading && <p>Chatbot is thinking...</p>}
    </div>
  );
}

export default Chatbot;
