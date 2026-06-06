import React from "react";

import PostFeed from "../components/Posts/PostFeed";
import "../components/Posts/PostFeed.css";
import "../components/Posts/PostPreview.css";
import "../components/Posts/Filter.css";
import "./community.css";
import CreatePost from "../components/Posts/CreatePost";


const Community = () => {
  return (
    <div className="community-page">
      <h1>Community Feed</h1>
      <CreatePost />
      <PostFeed />
    </div>
  );
};

export default Community;