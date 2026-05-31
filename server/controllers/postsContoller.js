const posts = require("../data/dummyPosts");
const db = require("../db/db");

exports.getAllPosts = async (req, res) => {
  try {
    // Get real posts that users created from PostgreSQL
    const result = await db.query("SELECT * FROM posts ORDER BY date DESC");

    // Add source labels so the frontend/backend can tell where each post came from in order to prevent multiple posts from having the same id #
    const featuredPosts = posts.map((post) => ({
      ...post,
      source: "featured",
    }));

    const databasePosts = result.rows.map((post) => ({
      ...post,
      source: "database",
    }));



    // Combine featured dummy posts with real database posts
    // I am thinking "Featured posts" will help the site look populated for demo/presentation
    // Database posts will show real content created by users
    const allPosts = [...featuredPosts, ...databasePosts];

    res.json(allPosts);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Unable to get posts",
    });
  }
};

exports.getPostById = async (req, res) => {
  const postId = req.params.id;

  // Check featured posts first
  const featuredPost = posts.find(
    (post) => post.id === postId
  );

  if (featuredPost) {
    return res.json(featuredPost);
  }

  try {
    // If not a featured post, check PostgreSQL
    const result = await db.query(
      "SELECT * FROM posts WHERE id = $1",
      [postId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Unable to get post",
    });
  }
};

exports.createPost = async (req, res) => {
  const { title, content, tag } = req.body;

  if (!title || !content || !tag) {
    //I removed the author because this will be for the logged in author
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Save the new post to PostgreSQL
    // RETURNING * gives us the post that was just created
    const result = await db.query(
      `INSERT INTO posts (title, content, tag, author)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [title, content, tag, req.user.email],
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Unable to create post",
    });
  }
};

exports.updatePost = async (req, res) => {
  const postId = req.params.id;
  const { title, content, tag } = req.body;

  // Featured posts are starter/demo content.
  // They should not be edited through the API.
  if (postId.startsWith("featured-")) {
    return res.status(403).json({
      message: "Featured posts cannot be edited",
    });
  }

  try {
    // First, find the post in PostgreSQL
    const existingPost = await db.query(
      "SELECT * FROM posts WHERE id = $1",
      [postId]
    );

    if (existingPost.rows.length === 0) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    const post = existingPost.rows[0];

    // A user can update the post if:
    // 1. They created the post, OR
    // 2. They are an admin
    const isOwner = post.author === req.user.email;
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        message: "You are not allowed to update this post",
      });
    }

    // Keep the old value if a field was not provided
    const updatedTitle = title || post.title;
    const updatedContent = content || post.content;
    const updatedTag = tag || post.tag;

    const result = await db.query(
      `UPDATE posts
       SET title = $1, content = $2, tag = $3
       WHERE id = $4
       RETURNING *`,
      [updatedTitle, updatedContent, updatedTag, postId]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Unable to update post",
    });
  }
};

exports.deletePost = async (req, res) => {
  const postId = req.params.id;

  // Featured posts are starter/demo content.
  // They should not be deleted through the API.
  if (postId.startsWith("featured-")) {
    return res.status(403).json({
      message: "Featured posts cannot be deleted",
    });
  }

  try {
    // First, find the post in PostgreSQL
    const existingPost = await db.query(
      "SELECT * FROM posts WHERE id = $1",
      [postId]
    );

    if (existingPost.rows.length === 0) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    const post = existingPost.rows[0];

    // A user can delete the post if:
    // 1. They created the post, OR
    // 2. They are an admin
    const isOwner = post.author === req.user.email;
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        message: "You are not allowed to delete this post",
      });
    }

    await db.query("DELETE FROM posts WHERE id = $1", [postId]);

    res.status(204).send();
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Unable to delete post",
    });
  }
};

exports.addCommentToPost = (req, res) => {
  const postId = parseInt(req.params.id);
  const post = posts.find((post) => post.id === postId);

  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }

  const { content } = req.body;

  if (!content) {
    return res.status(400).json({ message: "Comment content is required" });
  }

  const newComment = {
    id: post.comments.length + 1,
    content,
    author: req.user.email,
    authorEmail: req.user.email,
    date: new Date().toISOString().split("T")[0],

    // replies will be added later
    replies: [],
  };

  post.comments.push(newComment);

  res.status(201).json(newComment);
};
