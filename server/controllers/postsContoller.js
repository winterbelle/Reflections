const posts = require("../data/dummyPosts");

exports.getAllPosts = (req, res) => {
  res.json(posts);
};

exports.getPostById = (req, res) => {
  const postId = parseInt(req.params.id);
  const post = posts.find((p) => p.id === postId);

  if (post) {
    res.json(post);
  } else {
    res.status(404).json({ message: "Post not found" });
  }
};

exports.createPost = (req, res) => {
  const { title, content, mood, tag} = req.body;

  if (!title || !content || !mood || !tag) {//I removed the author because this will be for the logged in author
    return res.status(400).json({ message: "All fields are required" });
  }

  const newPost = {
    id: posts.length + 1,
    title,
    content,
    mood,
    tag,
    date: new Date().toISOString().split("T")[0],
    // The author comes from the logged-in user's JWT.
    // This prevents users from pretending to be someone else.
    author: req.user.email,
    authorEmail: req.user.email,
  };

  posts.push(newPost);
  res.status(201).json(newPost);
};

exports.updatePost = (req, res) => {
  const postId = parseInt(req.params.id);
  const post = posts.find((p) => p.id === postId);

  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }

  // A user can update the post if:
  // 1. They created the post, OR
  // 2. They are an admin
  const isOwner = post.authorEmail === req.user.email;
  const isAdmin = req.user.role === "admin";

  if (!isOwner && !isAdmin) {
    return res.status(403).json({
      message: "You are not allowed to update this post",
    });
  }

  const { title, content, mood, tag} = req.body;

  if (title) post.title = title;
  if (content) post.content = content;
  if (mood) post.mood = mood;
  if (tag) post.tag = tag;
  // if (author) post.author = author;

  res.json(post);
};

exports.deletePost = (req, res) => {
  const postId = parseInt(req.params.id);
  const postIndex = posts.findIndex((p) => p.id === postId);

  if (postIndex === -1) {
    return res.status(404).json({ message: "Post not found" });
  }

  const post = posts[postIndex];

  // A user can delete the post if:
  // 1. They created the post, OR
  // 2. They are an admin
  const isOwner = post.authorEmail === req.user.email;
  const isAdmin = req.user.role === "admin";

  if (!isOwner && !isAdmin) {
    return res.status(403).json({
      message: "You are not allowed to delete this post",
    });
  }

  posts.splice(postIndex, 1);
  res.status(204).send();
};

exports.addCommentToPost = (req, res)=> {
  const postId = parseInt(req.params.id);
  const post = posts.find((post)=> post.id === postId);

  if(!post){
    return res.status(404).json({message: "Post not found"});
  }

  const {content} = req.body;

  if(!content) {
    return res.status(400).json({message: "Comment content is required"});
  }

  const newComment = {
    id: post.comments.length + 1,
    content,
    author: req.user.email,
    authorEmail: req.user.email,
    date: new Date().toISOString().split("T")[0],

    // replies will be added later
    replies:[]
  };

  post.comments.push(newComment);

  res.status(201).json(newComment);
}
