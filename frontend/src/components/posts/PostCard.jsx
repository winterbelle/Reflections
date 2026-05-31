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

const PostCard = ({ currentUser }) => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentInput, setCommentInput] = useState("");
  const [loading, setLoading] = useState(true);

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

  const isAuthor = currentUser && currentUser.email === post.authorEmail;
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

  return (
    <div className="post-card">
      <PostCardHeader post={post} />
      <h2 className="post-title">{post.title}</h2>
      <p className="post-content">{post.content}</p>
      <span className="post-tag">{post.tag}</span>
      {(isAuthor || isAdmin) && (
        <div className="post-actions">
          <Button variant="outlined" color="primary">
            Edit
          </Button>
          <Button variant="outlined" color="secondary">
            Delete
          </Button>
        </div>
      )}
      <div className="post-interactions">
        {/* Comments are fetched separately so this works for both featured posts and database posts */}
        <h3>Comments ({comments.length})</h3>
        {/* COMMENTS RENDERED TO THE PAGE */}
        {comments.map((comment) => (
          <div key={comment.id} className="comment-card">
            <p>{comment.content}</p>
            <small>{comment.author}</small>
          </div>
        ))}
      </div>

      {/* COMMENT INPUT */}
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
