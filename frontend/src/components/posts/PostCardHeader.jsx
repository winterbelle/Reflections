//this contains the header of the post card, which includes the profile picture, username, and timestamp of the post

import React from "react";
import { Avatar } from "@mui/material";
import ProfileAvatar from "./ProfileAvatar";

import { formatDistanceToNow } from "date-fns";

const PostCardHeader = ({ post }) => {
  const postDate =
    typeof post.date === "string" && post.date.endsWith("Z")
      ? new Date(post.date)
      : new Date(`${post.date}T00:00:00`);

  return (
    <div className="post-header">
      <ProfileAvatar username={post.author} />
      <div className="post-author-info">
        <span className="post-author">{post.author} </span>
        <span className="post-date">
          {formatDistanceToNow(postDate, { addSuffix: true })}
        </span>
      </div>
    </div>
  );
};

export default PostCardHeader;