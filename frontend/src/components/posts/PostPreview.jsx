//this will be a preview of the post, so it will be a link to the full post page

import React from "react";
import { Link } from "react-router-dom";
import PostCardHeader from "./PostCardHeader";

const PostPreview = ({ post }) => {
  return (
    <div className="post-preview">
      <Link to={`/posts/${post.id}`}>
        <PostCardHeader post={post} />
        <h2>
          {post.mood && <span>{post.mood} </span>}
          {post.title}
        </h2>
        <p>{post.content.substring(0, 200)}...</p>
        <span>{post.tag}</span>
      </Link>
    </div>
  );
};

export default PostPreview;
