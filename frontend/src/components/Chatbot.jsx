import { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import "./Chatbot.css";

function Chatbot() {
  // Stores all chatbot conversation messages
  const [messages, setMessages] = useState(() => {
    const savedMessages = localStorage.getItem("chatMessages");

    return savedMessages ? JSON.parse(savedMessages) : [];
  });

  // Stores the current user input
  const [input, setInput] = useState("");

  // Controls whether the chatbot window is open
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Tracks loading state while waiting for chatbot response
  const [isLoading, setIsLoading] = useState(false);

  // This reference points to the bottom of the chat.
  // We use it to automatically scroll down whenever
  // a new message is added to the conversation.
  const messagesEndRef = useRef(null);

  //this useEffect saves chatbot messages to localStorage whenever the messages array changes
  useEffect(() => {
    localStorage.setItem("chatMessages", JSON.stringify(messages));
  }, [messages]);

  // Keeps the chat scrolled to the newest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Sends the user's message to the backend chatbot route
  const handleSendMessage = async () => {
    // Prevent empty submissions
    if (!input.trim()) return;

    // Create the user's message object
    const userMessage = {
      role: "user",
      content: input,
    };

    // Clear input immediately for better UX
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
          history: [...messages, userMessage],
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

  // Toggles chatbot open/closed state
  const toggleChatbot = () => {
    setIsChatOpen((prevState) => !prevState);
  };

  // Ends the current chat session
  // Clears messages from state and localStorage
  const endChat = () => {
    setMessages([]);
    localStorage.removeItem("chatMessages");
    setIsChatOpen(false);
  };

  return (
    <div className="chatbot-container">
      {/* Floating button used to open/close chatbot */}
      <button
        className="chatbot-toggle-button"
        type="button"
        onClick={toggleChatbot}
      >
        {isChatOpen ? "Close Chat" : "💬 Chat"}
      </button>

      {/* Only render chatbot window if open */}
      {isChatOpen && (
        <div className="chatbot-overlay" onClick={() => setIsChatOpen(false)}>
          <div
            className="chatbot-window"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="chatbot-header">
              <h2>Kindred Companion</h2>

              <button
                className="chatbot-end-button"
                type="button"
                onClick={endChat}
              >
                End Chat
              </button>
            </div>

            {/* Displays the chatbot conversation */}
            <div className="chatbot-messages">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`chatbot-message ${
                    message.role === "user"
                      ? "chatbot-message-user"
                      : "chatbot-message-assistant"
                  }`}
                >
                  <ReactMarkdown>{message.content}</ReactMarkdown>
                </div>
              ))}

              <div ref={messagesEndRef} />
            </div>

            {/* Chat input section */}
            <form
              className="chatbot-form"
              onSubmit={(event) => {
                // Prevents page refresh
                event.preventDefault();

                handleSendMessage();
              }}
            >
              <input
                type="text"
                placeholder="Ask a parenting question..."
                value={input}
                disabled={isLoading}
                onChange={(event) => setInput(event.target.value)}
              />

              <button type="submit" disabled={isLoading}>
                Send
              </button>
            </form>

            {/* Loading feedback while waiting for chatbot */}
            {isLoading && (
              <p className="chatbot-loading">
                Kindred Companion is thinking...
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Chatbot;
