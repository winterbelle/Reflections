import React from "react";
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