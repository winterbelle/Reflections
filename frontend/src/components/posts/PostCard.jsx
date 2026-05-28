// This component renders a single post card when clicked on from the PostFeed. It displays the
// author's avatar, name/username, post title, content, and tag. It also has buttons for editing and deleting 
// the post if the user is the author or an admin, however the editing and deleting functionality will be handled 
// separately. It also has a section for comments and a form to add a new comment. it also displays the date the 
// post was created in a human-readable format and the number of comments on the post and likes on the post.

import React from "react";
import { Avatar, Button } from "@mui/material";
import { formatDistanceToNow } from "date-fns";

const PostCard = ({ post, currentUser }) => {
  const isAuthor = currentUser && currentUser.email === post.authorEmail;
  const isAdmin = currentUser && currentUser.role === "admin";

  return (
    <div className="post-card">
      <div className="post-header">
        <Avatar>{post.author.charAt(0).toUpperCase()}</Avatar>
        <div className="post-author-info">
          <span className="post-author">{post.author} </span>
          <span className="post-date">
            {formatDistanceToNow(new Date(post.date), { addSuffix: true })}
          </span>
        </div>
      </div>
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
        {/* <h3>Likes ({post.likes.length})</h3> */}
        <h3>Comments ({post.comments.length})</h3>
        {/* Render comments here */}
      </div>
      <div className="add-comment">
        <input type="text" placeholder="Add a comment..." />
        <Button variant="contained" color="primary">
          Post
        </Button>
      </div>
    </div>
  );
}

export default PostCard;

