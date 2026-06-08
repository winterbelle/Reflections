import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ProfileAvatar from "./ProfileAvatar";

const moods = [
  { emoji: "😊", value: "happy" },
  { emoji: "😔", value: "sad" },
  { emoji: "😰", value: "anxious" },
  { emoji: "🫩", value: "exhausted" },
  { emoji: "❤️", value: "loved" },
  { emoji: "😡", value: "frustrated" },
];

const CreatePostForm = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [mood, setMood] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);

  const handleTagKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();

      const newTag = tagInput
        .trim()
        .replace("#", "")
        .toLowerCase();

      if (!newTag) return;

      if (tags.includes(newTag)) {
        setTagInput("");
        return;
      }

      setTags([...tags, newTag]);
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(
      tags.filter((tag) => tag !== tagToRemove)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim() || !mood) {
      alert("Please enter a title, content, and select a mood.");
      return;
    }

    setIsSubmitting(true);

    try {
      console.log({
  title,
  content,
  mood,
  tag: tags.join(","),
  isAnonymous,
});
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/posts`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
          title,
          content,
          mood,
          tag: tags.join(","),
          isAnonymous,
        }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create post");
      }

      const data = await response.json();

      console.log("Post created:", data);

      setTitle("");
      setContent("");
      setMood("");
      setTagInput("");
      setTags([]);

      navigate("/community");
    } catch (error) {
      console.error("Error creating post:", error);
      alert("Something went wrong while creating your post.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="create-post-form">
      <div className="form-group">
        <label htmlFor="title">Title</label>

        <input
          id="title"
          type="text"
          placeholder="Enter a title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="create-post-title"
          maxLength={100}
          required
        />
      </div>

      <div className="form-group">
        <label>How are you feeling?</label>

        <div className="mood-selector">
          {moods.map((item) => (
            <button
              key={item.value}
              type="button"
              className={`mood-button ${
                mood === item.value ? "selected" : ""
              }`}
              onClick={() => setMood(item.value)}
            >
              {item.emoji}
            </button>
          ))}
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="tag">Tags</label>

        <div className="tag-list">
          {tags.map((tag) => (
            <span
              key={tag}
              className="tag-pill"
            >
              #{tag}

              <button
                type="button"
                className="remove-tag-button"
                onClick={() => removeTag(tag)}
              >
                ×
              </button>
            </span>
          ))}
        </div>

        <input
          id="tag"
          type="text"
          placeholder="Add a tag and press Enter"
          value={tagInput}
          onChange={(e) =>
            setTagInput(
              e.target.value.replace("#", "")
            )
          }
          onKeyDown={handleTagKeyDown}
          className="tag-input"
        />
      </div>

      <div className="form-group">
        <label htmlFor="content">Post</label>

        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Share your thoughts, feelings, questions, or experiences..."
          className="create-post-textarea"
          rows={8}
          required
        />
      </div>

      <div className="form-group">
        <label className="anonymous-checkbox">
          <input
            type="checkbox"
            checked={isAnonymous}
            onChange={(e) =>
              setIsAnonymous(e.target.checked)
            }
          />

          Post anonymously
        </label>

        <small className="anonymous-note">
          Your name will not be displayed to other users.
        </small>
      </div>

      <div className="create-post-actions">
        <button
          type="button"
          className="cancel-button"
          onClick={() => navigate("/community")}
        >
          Cancel
        </button>

        <button
          type="submit"
          className="create-post-button"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Posting..." : "Share Post"}
        </button>
      </div>
    </form>
  );
};

export default CreatePostForm;