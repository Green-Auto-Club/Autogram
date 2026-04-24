const express = require("express");
const router = express.Router();
const multer = require("multer");
let posts = [];
const result = await pool.query("SELECT * FROM posts");

const storage = multer.diskStorage({
  destination: "./uploads",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });


// Criar post
router.post("/", upload.single("image"), async (req, res) => {
  const imageUrl = `http://localhost:3001/uploads/${req.file.filename}`;

  const result = await pool.query(
    "INSERT INTO posts (image_url) VALUES ($1) RETURNING *",
    [imageUrl]
  );

  res.json(result.rows[0]);
});


// Listar posts + comentários
router.get("/", async (req, res) => {
  const postsResult = await pool.query("SELECT * FROM posts ORDER BY id DESC");

  const posts = postsResult.rows;

  for (let post of posts) {
    const commentsResult = await pool.query(
      "SELECT * FROM comments WHERE post_id = $1",
      [post.id]
    );
    post.comments = commentsResult.rows;
  }

  res.json(posts);
});


// ❤️ Like
router.post("/:id/like", async (req, res) => {
  const result = await pool.query(
    "UPDATE posts SET likes = likes + 1 WHERE id = $1 RETURNING *",
    [req.params.id]
  );

  res.json(result.rows[0]);
});


// 💬 Comentário
router.post("/:id/comment", async (req, res) => {
  const { text } = req.body;

  const result = await pool.query(
    "INSERT INTO comments (post_id, text) VALUES ($1, $2) RETURNING *",
    [req.params.id, text]
  );

  res.json(result.rows[0]);
});

module.exports = router;