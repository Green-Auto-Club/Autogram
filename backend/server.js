const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const postsRoute = require("./routes/posts");
app.use("/posts", postsRoute);

app.listen(3001, () => console.log("Servidor rodando na porta 3001"));
app.use(express.json());