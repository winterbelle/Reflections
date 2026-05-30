//this contains the header of the post card, which includes the profile picture, username, and timestamp of the post

import React from "react";
import { Avatar } from "@mui/material";
import { formatDistanceToNow } from "date-fns";

const PostCardHeader = ({ post }) => {
    return (
        <div className="post-header">
        <Avatar>{post.author.charAt(0).toUpperCase()}</Avatar>
        <div className="post-author-info">
          <span className="post-author">{post.author} </span>
          <span className="post-date">
            {formatDistanceToNow(new Date(post.date), { addSuffix: true })}
          </span>
        </div>
      </div>
    )
}

export default PostCardHeader;