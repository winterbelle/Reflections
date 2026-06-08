import React from "react";
import "../components/posts/PostFeed.css";
import "../components/posts/PostPreview.css";
import "../components/posts/Filter.css";
import "./community.css";

// display the community feed
import PostFeed from "../components/posts/PostFeed"


const Community = () => {
  return (
    <div className="community-page">
      <h1>Community Feed</h1>
      <PostFeed />
    </div>
  );
};

export default Community;