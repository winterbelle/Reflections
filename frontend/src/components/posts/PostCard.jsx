// This component renders a single post card when clicked on from the PostFeed. It displays the
// author's avatar, name/username, post title, content, and tag. It also has buttons for editing and deleting
// the post if the user is the author or an admin, however the editing and deleting functionality will be handled
// separately. It also has a section for comments and a form to add a new comment. it also displays the date the
// post was created in a human-readable format and the number of comments on the post and likes on the post.

import React from "react";
import { Avatar, Button } from "@mui/material";
import { formatDistanceToNow } from "date-fns";
import PostCardHeader from "./PostCardHeader";
import { useEffect, useState } from "react";
import { useParams } from "react-router";

const PostCard = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentInput, setCommentInput] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editedCommentContent, setEditedCommentContent] = useState("");
  const [isEditingPost, setIsEditingPost] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedTag, setEditedTag] = useState("");
  const [editedContent, setEditedContent] = useState("");
  const [loading, setLoading] = useState(true);

  // Ensure this component can read which user is logged in
  const savedUser = localStorage.getItem("user");
  const currentUser = savedUser ? JSON.parse(savedUser) : null;

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/posts/${id}`,
        );
        const data = await response.json();
        setPost(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching post:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();

    const fetchComments = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/posts/${id}/comments`,
        );

        const data = await response.json();
        setComments(data);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    fetchComments();
  }, [id]);

  //loading while waiting for the post to be fetched
  if (loading) {
    return <div>Loading...</div>;
  }

  if (!post) {
    return <div>Post not found</div>;
  }

  const isAuthor = currentUser && currentUser.email === post.author;
  const isAdmin = currentUser && currentUser.role === "admin";

  const handleAddComment = async () => {
    // Prevent empty comments from being submitted
    if (!commentInput.trim()) return;

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please log in to add a comment.");
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/posts/${id}/comments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            content: commentInput,
          }),
        },
      );

      const newComment = await response.json();

      // Add the new comment to the screen without forcing a page refresh
      setComments((prevComments) => [...prevComments, newComment]);

      // Clear input after successful submission
      setCommentInput("");
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handleEditComment = (comment) => {
    setEditingCommentId(comment.id);
    setEditedCommentContent(comment.content);
  };

  const handleUpdateComment = async (commentId) => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please log in to edit a comment.");
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/posts/${id}/comments/${commentId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            content: editedCommentContent,
          }),
        },
      );

      const updatedComment = await response.json();

      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment.id === commentId ? updatedComment : comment,
        ),
      );

      setEditingCommentId(null);
      setEditedCommentContent("");
    } catch (error) {
      console.error("Error updating comment:", error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please log in to delete a comment.");
      return;
    }

    try {
      await fetch(
        `${import.meta.env.VITE_API_URL}/posts/${id}/comments/${commentId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
 
      setComments((prevComments) =>
        prevComments.filter((comment) => comment.id !== commentId),
      );
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const handleEditPost = () => {
    setIsEditingPost(true);
    setEditedTitle(post.title);
    setEditedTag(post.tag);
    setEditedContent(post.content);
  };

  const handleUpdatePost = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please log in to edit this post.");
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/posts/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: editedTitle,
            tag: editedTag,
            content: editedContent,
          }),
        },
      );

      const updatedPost = await response.json();

      setPost(updatedPost);
      setIsEditingPost(false);
    } catch (error) {
      console.error("Error updating post:", error);
    }
  };

  const handleDeletePost = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please log in to delete this post.");
      return;
    }

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this post?",
    );

    if (!confirmDelete) return;

    try {
      await fetch(`${import.meta.env.VITE_API_URL}/posts/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      window.location.href = "/community";
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const moodEmojis = {
    happy: "😊",
    sad: "😔",
    anxious: "😰",
    exhausted: "🫩",
    loved: "❤️",
    frustrated: "😡",
  };

  console.log("Rendered Post:", post);

  return (
    <div className="post-card">
      <PostCardHeader post={post} />

      {isEditingPost ? (
        <div className="edit-post-form">
          <input
            type="text"
            value={editedTitle}
            onChange={(event) => setEditedTitle(event.target.value)}
          />

          <input
            type="text"
            value={editedTag}
            onChange={(event) => setEditedTag(event.target.value)}
          />

          <textarea
            value={editedContent}
            onChange={(event) => setEditedContent(event.target.value)}
          />

          <Button
            variant="contained"
            color="primary"
            onClick={handleUpdatePost}
          >
            Save Post
          </Button>

          <Button
            variant="outlined"
            color="secondary"
            onClick={() => setIsEditingPost(false)}
          >
            Cancel
          </Button>
        </div>
      ) : (
        <>
          <h2 className="post-title">{post.title}</h2>
          <p className="post-content">{post.content}</p>
          <div className="post-mood">{moodEmojis[post.mood]} {post.mood}</div>
          <span className="post-tag">{post.tag && `#${post.tag}`}</span>
        </>
      )}

      {(isAuthor || isAdmin) && (
        <div className="post-actions">
          <Button variant="outlined" color="primary" onClick={handleEditPost}>
            Edit
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleDeletePost}
          >
            Delete
          </Button>
        </div>
      )}

      <div className="post-interactions">
        {/* Comments are fetched separately so this works for both featured posts and database posts */}
        <h3>Comments ({comments.length})</h3>

        {comments.map((comment) => (
          <div key={comment.id} className="comment-card">
            {editingCommentId === comment.id ? (
              <>
                <input
                  type="text"
                  value={editedCommentContent}
                  onChange={(event) =>
                    setEditedCommentContent(event.target.value)
                  }
                />

                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleUpdateComment(comment.id)}
                >
                  Save
                </Button>

                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => setEditingCommentId(null)}
                >
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <p>{comment.content}</p>
                <small>{comment.author}</small>

                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => handleEditComment(comment)}
                >
                  Edit
                </Button>

                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => handleDeleteComment(comment.id)}
                >
                  Delete
                </Button>
              </>
            )}
          </div>
        ))}
      </div>

      <div className="add-comment">
        <input
          type="text"
          placeholder="Add a comment..."
          value={commentInput}
          onChange={(event) => setCommentInput(event.target.value)}
        />

        <Button variant="contained" color="primary" onClick={handleAddComment}>
          Post
        </Button>
      </div>
    </div>
  );
};

export default PostCard;
