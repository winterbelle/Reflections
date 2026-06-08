import { useState } from "react";
import { useNavigate } from "react-router";

function CreatePostModal({ onClose }) {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [tag, setTag] = useState("");
  const [content, setContent] = useState("");
  const [message, setMessage] = useState("");
  const [mood, setMood] = useState("😄");

  const handleCreatePost = async (event) => {
    event.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      setMessage("Please log in to create a post.");
      return;
    }

    if (!title || !tag || !content) {
      setMessage("Please complete all fields.");
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          tag,
          content,
          mood,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Unable to create post.");
        return;
      }

      setTitle("");
      setTag("");
      setContent("");
      setMessage("Post created successfully!");
      setMood("😄");
      window.dispatchEvent(new Event("postCreated"));
      onClose();
      navigate("/community");
    } catch (error) {
      console.error(error);
      setMessage("Unable to connect to server.");
    }
  };

  return (
    <div className="create-post-modal-overlay">
      <div className="create-post-modal">
        <button type="button" onClick={onClose}>
          X
        </button>

        <h2>Create a Post</h2>

        <form onSubmit={handleCreatePost}>
          <label>
            Title
            <input
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
          </label>

          <label>
            Tag
            <input
              type="text"
              value={tag}
              onChange={(event) => setTag(event.target.value)}
            />
          </label>

          <label>
            Mood
            <select
              value={mood}
              onChange={(event) => setMood(event.target.value)}
            >
              <option value="😊">😊 Happy</option>
              <option value="😔">😔 Sad</option>
              <option value="😫">😫 Stressed</option>
              <option value="😡">😡 Frustrated</option>
              <option value="😴">😴 Tired</option>
              <option value="🥰">🥰 Grateful</option>
            </select>
          </label>

          <label>
            Content
            <textarea
              value={content}
              onChange={(event) => setContent(event.target.value)}
            />
          </label>

          <button type="submit">Create Post</button>
        </form>

        {message && <p>{message}</p>}
      </div>
    </div>
  );
}

export default CreatePostModal;
