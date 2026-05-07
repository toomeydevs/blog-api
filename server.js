const express = require('express');

const app = express();
const PORT = 3000;

//basic route for testing
app.get('/', (req, res) => {
    res.send("Blog API running...")
});

//start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
})