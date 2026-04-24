const express = require("express");
const router = express.Router();
const multer = require("multer");
// Removi o 'await pool.query' que estava aqui solto e a causar o erro!

// Configuração do Multer (Garagem das imagens)
const storage = multer.diskStorage({
  destination: "./uploads",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// 🚀 Criar post
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const imageUrl = `http://localhost:3001/uploads/${req.file.filename}`;
    // O 'pool' deve estar definido no teu db.js e importado no server.js ou aqui
    const result = await req.app.get('pool').query(
      "INSERT INTO posts (image_url) VALUES ($1) RETURNING *",
      [imageUrl]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Erro ao criar post" });
  }
});

// 🔎 Listar posts + comentários
router.get("/", async (req, res) => {
  try {
    const pool = req.app.get('pool');
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
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar posts" });
  }
});

// ❤️ Like
router.post("/:id/like", async (req, res) => {
  try {
    const result = await req.app.get('pool').query(
      "UPDATE posts SET likes = likes + 1 WHERE id = $1 RETURNING *",
      [req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Erro ao dar like" });
  }
});

// 💬 Comentário
router.post("/:id/comment", async (req, res) => {
  try {
    const { text } = req.body;
    const result = await req.app.get('pool').query(
      "INSERT INTO comments (post_id, text) VALUES ($1, $2) RETURNING *",
      [req.params.id, text]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Erro ao comentar" });
  }
});

module.exports = router;