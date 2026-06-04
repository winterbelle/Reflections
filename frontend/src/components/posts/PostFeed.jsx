// This component is responsible for rendering the feed of posts on the community page.
// It fetches the posts from the server and maps over them to render a PostCard for each post.

import React, { useEffect, useState } from "react";
import PostCard from "./PostCard";
import PostPreview from "./PostPreview";

const PostFeed = () => {
  const [posts, setPosts] = useState([]);
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
    <div className="post-feed">
      {posts.map((post) => (
        <PostPreview key={post.id} post={post} />
      ))}
    </div>
  );
};

export default PostFeed;
