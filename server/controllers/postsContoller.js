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

    allPosts.sort((a, b) => new Date(b.date) - new Date(a.date));

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
  const featuredPost = posts.find((post) => post.id === postId);

  if (featuredPost) {
    return res.json(featuredPost);
  }

  try {
    // If not a featured post, check PostgreSQL
    const result = await db.query("SELECT * FROM posts WHERE id = $1", [
      postId,
    ]);

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
  const { title, content, tag, mood } = req.body;

  if (!title || !content || !tag) {
    //I removed the author because this will be for the logged in author
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Save the new post to PostgreSQL
    // RETURNING * gives us the post that was just created
    const result = await db.query(
      `INSERT INTO posts (title, content, tag, mood, author)
   VALUES ($1, $2, $3, $4, $5)
   RETURNING *`,
      [title, content, tag, mood, req.user.email],
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
    const existingPost = await db.query("SELECT * FROM posts WHERE id = $1", [
      postId,
    ]);

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
      [updatedTitle, updatedContent, updatedTag, postId],
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
    const existingPost = await db.query("SELECT * FROM posts WHERE id = $1", [
      postId,
    ]);

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

exports.addCommentToPost = async (req, res) => {
  const postId = req.params.id;
  const { content } = req.body;

  if (!content) {
    return res.status(400).json({ message: "Comment content is required" });
  }

  // If the post ID starts with "featured-", it belongs to dummyPosts.js
  if (postId.startsWith("featured-")) {
    const post = posts.find((post) => post.id === postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
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

    return res.status(201).json(newComment);
  }

  try {
    // Make sure the database post exists before adding a comment
    const existingPost = await db.query("SELECT * FROM posts WHERE id = $1", [
      postId,
    ]);

    if (existingPost.rows.length === 0) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Save the comment to PostgreSQL
    const result = await db.query(
      `INSERT INTO comments (post_id, content, author)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [postId, content, req.user.email],
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Unable to add comment",
    });
  }
};

exports.getCommentsByPostId = async (req, res) => {
  const postId = req.params.id;

  // Featured post comments are stored directly inside dummyPosts.js
  if (postId.startsWith("featured-")) {
    const post = posts.find((post) => post.id === postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    return res.json(post.comments);
  }

  try {
    // Get comments connected to this database post
    const result = await db.query(
      "SELECT * FROM comments WHERE post_id = $1 ORDER BY date ASC",
      [postId],
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Unable to get comments",
    });
  }
};

exports.deleteComment = async (req, res) => {
  const { postId, commentId } = req.params;

  // Featured post comments are stored in dummyPosts.js
  if (postId.startsWith("featured-")) {
    const post = posts.find((post) => post.id === postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const commentIndex = post.comments.findIndex(
      (comment) => comment.id === parseInt(commentId),
    );

    if (commentIndex === -1) {
      return res.status(404).json({ message: "Comment not found" });
    }

    const comment = post.comments[commentIndex];

    const isOwner = comment.authorEmail === req.user.email;
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        message: "You are not allowed to delete this comment",
      });
    }

    post.comments.splice(commentIndex, 1);

    return res.status(204).send();
  }

  try {
    // Find the database comment first so we can check ownership
    const existingComment = await db.query(
      "SELECT * FROM comments WHERE id = $1 AND post_id = $2",
      [commentId, postId],
    );

    if (existingComment.rows.length === 0) {
      return res.status(404).json({ message: "Comment not found" });
    }

    const comment = existingComment.rows[0];

    const isOwner = comment.author === req.user.email;
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        message: "You are not allowed to delete this comment",
      });
    }

    await db.query("DELETE FROM comments WHERE id = $1 AND post_id = $2", [
      commentId,
      postId,
    ]);

    res.status(204).send();
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Unable to delete comment",
    });
  }
};

exports.updateComment = async (req, res) => {
  const { postId, commentId } = req.params;
  const { content } = req.body;

  if (!content) {
    return res.status(400).json({
      message: "Comment content is required",
    });
  }

  // Featured post comments are stored in dummyPosts.js
  if (postId.startsWith("featured-")) {
    const post = posts.find((post) => post.id === postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const comment = post.comments.find(
      (comment) => comment.id === parseInt(commentId),
    );

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    const isOwner = comment.authorEmail === req.user.email;
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        message: "You are not allowed to update this comment",
      });
    }

    comment.content = content;

    return res.json(comment);
  }

  try {
    // Find the database comment first so we can check ownership
    const existingComment = await db.query(
      "SELECT * FROM comments WHERE id = $1 AND post_id = $2",
      [commentId, postId],
    );

    if (existingComment.rows.length === 0) {
      return res.status(404).json({
        message: "Comment not found",
      });
    }

    const comment = existingComment.rows[0];

    const isOwner = comment.author === req.user.email;
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        message: "You are not allowed to update this comment",
      });
    }

    const result = await db.query(
      `UPDATE comments
       SET content = $1
       WHERE id = $2 AND post_id = $3
       RETURNING *`,
      [content, commentId, postId],
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Unable to update comment",
    });
  }
};
