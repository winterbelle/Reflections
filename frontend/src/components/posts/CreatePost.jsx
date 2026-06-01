import { useState } from "react";
import ProfileAvatar from "./ProfileAvatar";

const CreatePost = () => {
  const [content, setContent] = useState("");

  const handleSubmit = async (e) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
      });
      if (response.ok) {
        setContent("");
      } else {
        console.error("Failed to create post");
      }
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="create-post-form">
      <ProfileAvatar username="User" />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="What's on your mind?"
        className="create-post-textarea"
      />
      <button type="submit" className="create-post-button">
        Post
      </button>
    </form>
  );
};

export default CreatePost;