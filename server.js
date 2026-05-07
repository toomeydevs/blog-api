const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

//middleware to parse JSON request body
app.use(express.json());


// Path to our JSON data file
const postsPath = path.join(__dirname, 'data', 'posts.json');

//Helper: read post from file
function readPosts(){
    const rawData = fs.readFileSync(postsPath, 'utf-8');
    return JSON.parse(rawData);
}

// Helper: write posts to file
function writePosts(posts) {
  fs.writeFileSync(postsPath, JSON.stringify(posts, null, 2), 'utf-8');
}

// GET /api/posts — Get all posts
app.get('/api/posts', (req, res) => {
    const posts = readPosts();
    res.send(posts);
})


//basic route for testing
app.get('/', (req, res) => {
    res.send("Blog API running...")
});

// GET /api/posts/:id — Get a single post by ID
app.get('/api/posts/:id', (req, res) => {
  const posts = readPosts();
  const id = Number(req.params.id);   // route params are strings
  const post = posts.find((p) => p.id === id);

  if (!post) {
    return res.status(404).json({ error: 'Post not found' });
  }

  res.json(post);
});

// POST /api/posts — Create a new post
app.post('/api/posts', (req, res) => {
  const posts = readPosts();
  const { title, content, author } = req.body;

  // Basic validation
  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content are required.' });
  }

  // Create new post
  const newPost = {
    id: posts.length > 0 ? posts[posts.length - 1].id + 1 : 1,
    title,
    content,
    author: author || 'Anonymous',
    createdAt: new Date().toISOString()
  };

  posts.push(newPost);
  writePosts(posts);

  // 201 = Created
  res.status(201).json(newPost);
});

// PUT /api/posts/:id — Update an existing post
app.put('/api/posts/:id', (req, res) => {
  const posts = readPosts();
  const id = Number(req.params.id);
  const index = posts.findIndex((p) => p.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Post not found' });
  }

  const { title, content, author } = req.body;

  // Update only the fields that were provided
  if (title !== undefined) posts[index].title = title;
  if (content !== undefined) posts[index].content = content;
  if (author !== undefined) posts[index].author = author;

  writePosts(posts);
  res.json(posts[index]);
});

// DELETE /api/posts/:id — Delete a post
app.delete('/api/posts/:id', (req, res) => {
  const posts = readPosts();
  const id = Number(req.params.id);
  const index = posts.findIndex((p) => p.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Post not found' });
  }

  const deletedPost = posts.splice(index, 1)[0];
  writePosts(posts);
  res.json({ message: 'Post deleted', post: deletedPost });
});

//start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
})