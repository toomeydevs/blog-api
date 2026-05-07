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

//start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
})