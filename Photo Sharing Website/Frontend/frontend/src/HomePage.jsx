import { useState, useEffect } from "react";
import axios from "axios";
import { app } from "./firebase";
import { getDatabase, ref, push, onValue } from "firebase/database";

export default function HomePage({ user, onLogout }) {
  const [images, setImages] = useState([]);
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const API_BASE = import.meta.env.VITE_API_BASE;

  const db = getDatabase(app);

  useEffect(() => {
    const imagesRef = ref(db, "images/");
    onValue(imagesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const formatted = Object.values(data).reverse(); 
        setImages(formatted);
      } else {
        setImages([]);
      }
    });
  }, []);

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("media", file);
    return axios.post(`${API_BASE}/uploadMedia`, formData);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please choose an image first");
    if (!description.trim()) return alert("Please add a description");

    setLoading(true);

    try {
      const res = await uploadImage(file);
      const newUrl = res.data?.data?.secure_url;

      if (newUrl) {
        const imagesRef = ref(db, "images/");
        await push(imagesRef, {
          url: newUrl,
          description,
          uploadedBy: user?.email || "Anonymous",
          uploadedAt: new Date().toISOString(),
        });

        setFile(null);
        setDescription("");
        alert("Image uploaded successfully!");
      } else {
        throw new Error("Upload response missing URL");
      }
    } catch (err) {
      console.error("Upload failed:", err.response?.data || err.message);
      alert("Upload failed");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="flex justify-between p-4 bg-blue-600 text-white">
        <h1 className="text-xl font-semibold">Gallery</h1>
        <div className="flex items-center gap-3">
          {user?.photoURL && (
            <img
              src={user.photoURL}
              alt="profile"
              className="w-8 h-8 rounded-full border"
            />
          )}
          <button onClick={onLogout} className="bg-red-500 px-3 py-1 rounded">
            Logout
          </button>
        </div>
      </nav>

      <div className="p-6 max-w-4xl mx-auto text-center">
        <form
          onSubmit={handleUpload}
          className="flex flex-col items-center gap-3 bg-white p-6 rounded shadow mb-6"
        >
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
            className="border p-2 rounded w-64"
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Write a short description..."
            className="border p-2 rounded w-64 h-20 resize-none"
          />
          <button
            disabled={loading}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            {loading ? "Uploading..." : "Upload"}
          </button>
        </form>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {images.length === 0 ? (
            <p className="col-span-full text-gray-500">
              No images uploaded yet
            </p>
          ) : (
            images.map((item, i) => (
              <div
                key={i}
                className="bg-white p-3 rounded-xl shadow-md flex flex-col items-center"
              >
                <img
                  src={item.url}
                  alt="upload"
                  className="rounded-lg shadow-md mb-2"
                />
                <p className="text-sm text-gray-700">{item.description}</p>
                {item.uploadedBy && (
                  <p className="text-xs text-gray-400 mt-1">
                    by {item.uploadedBy}
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
