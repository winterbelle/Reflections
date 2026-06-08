// This component is responsible for rendering the feed of posts on the community page.
// It fetches the posts from the server and maps over them to render a PostCard for each post.

import React, { useEffect, useState } from "react";
import PostCard from "./PostCard";
import PostPreview from "./PostPreview";
import Filter from "./Filter";

const PostFeed = () => {
  const [posts, setPosts] = useState([]);

  // fetch call to the backend to grab the posts
  const fetchPosts = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/posts`);

      const data = await response.json();

      setPosts(data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };
  useEffect(() => {
    fetchPosts();

    window.addEventListener("postCreated", fetchPosts);

    return () => {
      window.removeEventListener("postCreated", fetchPosts);
    };
  }, []);
  return (
    <>
      <div className="post-feed-container">
        <div className="post-feed-header">
          <h2>Component to make a post goes here</h2>
        </div>
        <div className="post-feed-main-content">
          <div className="post-feed-filters">
            <Filter />
          </div>
          <div className="post-feed-posts">
            {posts.map((post) => (
              <PostPreview
                key={`${post.source || "database"}-${post.id}`}
                post={post}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default PostFeed;
