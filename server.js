require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const Post = require('./models/Post');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());

// ===== ROUTES =====

// GET /api/posts — Get all posts (newest first)
app.get('/api/posts', async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Server error while fetching posts' });
  }
});

// GET /api/posts/:id — Get a single post
app.get('/api/posts/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: 'Server error while fetching post' });
  }
});

// POST /api/posts — Create a new post
app.post('/api/posts', async (req, res) => {
  try {
    const { title, content, author } = req.body;

    // Find highest existing numeric ID
const lastPost = await Post.findOne().sort({ id: -1 });

// Generate next ID
const newId = lastPost ? lastPost.id + 1 : 1;

// Create post
const post = new Post({
  id: newId,
  title,
  content,
  author
});

    // Save to database (triggers validation)
    const savedPost = await post.save();
    res.status(201).json(savedPost);
  } catch (error) {
    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ error: messages.join('. ') });
    }
    res.status(500).json({ error: 'Server error while creating post' });
  }
});

// PUT /api/posts/:id — Update a post
app.put('/api/posts/:id', async (req, res) => {
  try {
    const { title, content, author } = req.body;

    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { title, content, author },
      { new: true, runValidators: true }
    );

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.json(post);
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ error: messages.join('. ') });
    }
    res.status(500).json({ error: 'Server error while updating post' });
  }
});

// DELETE /api/posts/:id — Delete a post
app.delete('/api/posts/:id', async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.json({ message: 'Post deleted', post });
  } catch (error) {
    res.status(500).json({ error: 'Server error while deleting post' });
  }
});

app.delete('/api/posts', async (req, res) => {
  await Post.deleteMany({});
  res.json({ message: 'All posts deleted' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});