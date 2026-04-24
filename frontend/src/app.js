import React, { useEffect, useState } from "react";
import axios from "axios";
import Upload from "./components/Upload";

function App() {
  const [posts, setPosts] = useState([]);

  const fetchPosts = async () => {
    const res = await axios.get("http://localhost:3001/posts");
    setPosts(res.data);
  };

  const likePost = async (id) => {
    await axios.post(`http://localhost:3001/posts/${id}/like`);
    fetchPosts();
  };

  const addComment = async (id, text) => {
    await axios.post(`http://localhost:3001/posts/${id}/comment`, { text });
    fetchPosts();
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div style={{ textAlign: "center" }}>
      <h1>🚗 Green Auto Club</h1>

      <Upload onUpload={fetchPosts} />

      {posts.map((post) => (
        <div key={post.id} style={{ marginBottom: "30px" }}>
          <img src={post.imageUrl} alt="car" style={{ width: "300px" }} />

          <p>❤️ {post.likes}</p>
          <button onClick={() => likePost(post.id)}>Curtir</button>

          <Comments post={post} addComment={addComment} />
        </div>
      ))}
    </div>
  );
}

function Comments({ post, addComment }) {
  const [text, setText] = useState("");

  return (
    <div>
      <h4>Comentários</h4>

      {post.comments.map((c) => (
        <p key={c.id}>{c.text}</p>
      ))}

      <input
        type="text"
        placeholder="Escreva um comentário..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <button
        onClick={() => {
          addComment(post.id, text);
          setText("");
        }}
      >
        Comentar
      </button>
    </div>
  );
}

export default App;