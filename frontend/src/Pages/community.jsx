// display the community feed

import React from "react";
import PostFeed from "../components/Posts/PostFeed";
import "../components/posts/PostFeed.css";
import "../components/posts/PostPreview.css";
const Community = () => {
  return (
    <div className="community-page">
      <h1>Community Feed</h1>
      <PostFeed />
    </div>
  );
};

export default Community;