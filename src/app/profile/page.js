"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();

  const [posts, setPosts] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const [plantQuery, setPlantQuery] = useState("");
  const [plantResults, setPlantResults] = useState([]);
  const [plantId, setPlantId] = useState("");

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [description, setDescription] = useState("");

  const loadPosts = async () => {
    const res = await fetch("/api/posts/my-posts");
    const data = await res.json();
    setPosts(data.posts || []);
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const searchPlants = async (value) => {
    setPlantQuery(value);

    if (!value) {
      setPlantResults([]);
      return;
    }

    const res = await fetch(`/api/plants/search?q=${value}`);
    const data = await res.json();

    setPlantResults(data.plants || []);
  };

  const uploadImage = async () => {
    if (!imageFile) return null;

    const formData = new FormData();
    formData.append("file", imageFile);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (!res.ok) {
      alert("Image upload failed");
      return null;
    }

    return data.url;
  };

  const createPost = async () => {
    const imageUrl = await uploadImage();

    const res = await fetch("/api/posts/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        plant_id: plantId,
        image_url: imageUrl,
        description
      })
    });

    const data = await res.json();

    if (res.ok) {
      setShowModal(false);
      setPlantQuery("");
      setPlantResults([]);
      setPlantId("");
      setImageFile(null);
      setImagePreview(null);
      setDescription("");
      loadPosts();
    } else {
      alert(data.error || "Failed to create post");
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f3f4f6", padding: "24px", display: "flex", justifyContent: "center" }}>
      <div style={{ width: "100%", maxWidth: "900px" }}>

        {/* HEADER */}
        <div style={{ background: "white", padding: "20px", borderRadius: "12px", marginBottom: "20px", display: "flex", justifyContent: "space-between" }}>
          <h1>My Garden</h1>

          <button
            onClick={() => setShowModal(true)}
            style={{ background: "green", color: "white", padding: "8px 12px", borderRadius: "6px" }}
          >
            Create Post
          </button>
        </div>

        {/* POSTS */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {posts.map(post => (
            <div key={post.id} style={{ background: "white", padding: "16px", borderRadius: "12px" }}>

              {post.image_url && (
                <div
                  style={{
                    width: "100%",
                    height: "0",
                    paddingTop: "56.25%",
                    position: "relative",
                    overflow: "hidden",
                    borderRadius: "10px",
                    background: "#ddd",
                    marginBottom: "10px"
                  }}
                >
                  <img
                    src={post.image_url}
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "cover"
                    }}
                  />
                </div>
              )}

              <p
                style={{ color: "green", fontWeight: "bold", cursor: "pointer" }}
                onClick={() => router.push(`/plant/${post.plant_id}`)}
              >
                {post.common_name}
              </p>

              <p>{post.description}</p>
            </div>
          ))}
        </div>

        {/* MODAL */}
        {showModal && (
          <div style={{
            position: "fixed",
            inset: 0,
            zIndex: 99999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>
            <div
              onClick={() => setShowModal(false)}
              style={{
                position: "absolute",
                inset: 0,
                background: "rgba(0,0,0,0.75)"
              }}
            />

            <div style={{
              background: "white",
              padding: "20px",
              borderRadius: "12px",
              width: "100%",
              maxWidth: "500px",
              position: "relative"
            }}>
              <h2>Create Post</h2>

              <input
                value={plantQuery}
                onChange={(e) => searchPlants(e.target.value)}
                placeholder="Search plant"
                style={{ width: "100%", marginTop: "10px" }}
              />

              {plantResults.map(p => (
                <div
                  key={p.id}
                  onClick={() => {
                    setPlantId(p.id);
                    setPlantQuery(p.common_name);
                    setPlantResults([]);
                  }}
                  style={{ cursor: "pointer" }}
                >
                  {p.common_name}
                </div>
              ))}

              {/* IMAGE UPLOAD */}
              <label style={{
                display: "block",
                marginTop: "10px",
                border: "2px dashed #ccc",
                padding: "10px",
                textAlign: "center",
                cursor: "pointer"
              }}>
                {imageFile ? imageFile.name : "Choose Image"}

                <input
                  type="file"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    setImageFile(file);

                    if (file) {
                      setImagePreview(URL.createObjectURL(file));
                    }
                  }}
                  style={{ display: "none" }}
                />
              </label>

              {/* IMAGE PREVIEW */}
              {imagePreview && (
                <div
                  style={{
                    width: "100%",
                    height: "0",
                    paddingTop: "56.25%",
                    position: "relative",
                    marginTop: "10px",
                    borderRadius: "10px",
                    overflow: "hidden"
                  }}
                >
                  <img
                    src={imagePreview}
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "cover"
                    }}
                  />
                </div>
              )}

              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description"
                style={{ width: "100%", marginTop: "10px" }}
              />

              <button
                onClick={createPost}
                style={{ marginTop: "10px", background: "green", color: "white", padding: "8px" }}
              >
                Post
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}