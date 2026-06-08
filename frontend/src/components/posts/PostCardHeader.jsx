//this contains the header of the post card, which includes the profile picture, username, and timestamp of the post

import React from "react";
import { Avatar } from "@mui/material";
import { formatDistanceToNow } from "date-fns";
import ProfileAvatar from "./ProfileAvatar";

const PostCardHeader = ({ post }) => {
  console.log(post);
    return (
        <div className="post-header">
        <ProfileAvatar username={post.is_anonymous ? "Anonymous" : post.author} />
        <div className="post-author-info">
          <span className="post-author">{post.is_anonymous ? "Anonymous" : post.author} </span>
          <span className="post-date">
            {formatDistanceToNow(new Date(post.date), { addSuffix: true })}
          </span>
        </div>
      </div>
    )
}

export default PostCardHeader;