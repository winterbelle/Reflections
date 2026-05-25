const posts = require('../data/dummyPosts');

exports.getAllPosts = (req, res) => {
    res.json(posts);
};

exports.getPostById = (req, res) => {
    const postId = parseInt(req.params.id);
    const post = posts.find(p => p.id === postId);

    if (post) {
        res.json(post);
    } else {
        res.status(404).json({ message: 'Post not found' });
    }
};

exports.createPost = (req, res) => {
    const { title, content, tag, author } = req.body;

    if (!title || !content || !tag || !author) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    const newPost = {
        id: posts.length + 1,
        title,
        content,
        tag,
        author,
        date: new Date().toISOString().split('T')[0],
    };

    posts.push(newPost);
    res.status(201).json(newPost);
};

exports.updatePost = (req, res) => {
    const postId = parseInt(req.params.id);
    const post = posts.find(p => p.id === postId);

    if (!post) {
        return res.status(404).json({ message: 'Post not found' });
    }

    const { title, content, tag, author } = req.body;

    if (title) post.title = title;
    if (content) post.content = content;
    if (tag) post.tag = tag;
    if (author) post.author = author;

    res.json(post);
};

exports.deletePost = (req, res) => {
    const postId = parseInt(req.params.id);
    const postIndex = posts.findIndex(p => p.id === postId);

    if (postIndex === -1) {
        return res.status(404).json({ message: 'Post not found' });
    }

    posts.splice(postIndex, 1);
    res.status(204).send();
};