import React from "react";
// display the community feed
import PostFeed from "../components/posts/PostFeed"
import "../components/posts/PostFeed.css";
import "../components/posts/PostPreview.css";
import "../components/posts/Filter.css";
import "../components/posts/PostCardHeader.css";
import "./community.css";

const Community = () => {
  return (
    <div className="community-page">
      <h1>Community Feed</h1>
      <PostFeed />
    </div>
  );
};

export default Community;