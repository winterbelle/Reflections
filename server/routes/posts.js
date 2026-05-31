const express = require('express');
const router = express.Router();
const postsController = require('../controllers/postsContoller');
const authMiddleware = require('../middleware/authMiddleware');


// PUBLIC ROUTES
// Get all posts
router.get('/', postsController.getAllPosts);
// Get a single post by ID
router.get('/:id', postsController.getPostById);

// PROTECTED ROUTES
// Create a new post
router.post('/', authMiddleware, postsController.createPost);
// Update an existing post
router.put('/:id', authMiddleware, postsController.updatePost);
// Delete a post
router.delete('/:id', authMiddleware, postsController.deletePost);
 // Get comments for a post
router.get("/:id/comments", postsController.getCommentsByPostId);

// PROTECTED POSTS
router.post('/:id/comments', authMiddleware, postsController.addCommentToPost)


module.exports = router;