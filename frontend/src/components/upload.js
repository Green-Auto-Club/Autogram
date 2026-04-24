import React, { useState } from "react";
import axios from "axios";

function Upload({ onUpload }) {
  const [image, setImage] = useState(null);

  const handleUpload = async () => {
    if (!image) return;

    const formData = new FormData();
    formData.append("image", image);

    await axios.post("http://localhost:3001/posts", formData);
    onUpload();
  };

  return (
    <div>
      <input type="file" onChange={(e) => setImage(e.target.files[0])} />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
}

export default Upload;