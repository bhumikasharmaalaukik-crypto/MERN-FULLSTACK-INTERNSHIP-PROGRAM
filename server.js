const express = require("express");

const app = express();
const PORT = 5000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Node.js backend server is running!");
});

app.get("/api/users", (req, res) => {
  res.json([
    { id: 1, name: "Rahul" },
    { id: 2, name: "Amit" }
  ]);
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});