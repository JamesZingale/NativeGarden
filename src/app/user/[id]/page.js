"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

export default function UserPage() {
  const router = useRouter();
  const params = useParams();
  const userId = params?.id;

  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  const [comments, setComments] = useState({});
  const [expanded, setExpanded] = useState({});
  const [newComment, setNewComment] = useState({});

  const [showModal, setShowModal] = useState(false);
  const [plantQuery, setPlantQuery] = useState("");
  const [plantResults, setPlantResults] = useState([]);
  const [plantId, setPlantId] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (!userId) return;

    loadData();
  }, [userId]);

  const loadData = async () => {
    const res = await fetch(`/api/users/${userId}`);
    const data = await res.json();

    setUser(data.user);
    setPosts(data.posts || []);

    // comments
    for (const post of data.posts || []) {
      const res = await fetch(`/api/posts/${post.id}/comments`);
      const c = await res.json();

      setComments(prev => ({
        ...prev,
        [post.id]: c.comments || []
      }));
    }
  };

  const loadCurrentUser = async () => {
    const res = await fetch("/api/auth/me");
    const data = await res.json();
    setCurrentUser(data.user);
  };

  useEffect(() => {
    loadCurrentUser();
  }, []);

  const isOwnProfile =
    currentUser && String(currentUser.id) === String(userId);

  const toggleLike = async (postId) => {
    await fetch(`/api/posts/${postId}/like`, { method: "POST" });

    // IMPORTANT: reload correct API (not feed, not posts endpoint)
    loadData();
  };

  const submitComment = async (postId) => {
    await fetch(`/api/posts/${postId}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: newComment[postId]
      })
    });

    setNewComment(prev => ({ ...prev, [postId]: "" }));
    loadData();
  };

  const uploadImage = async () => {
    if (!imageFile) return null;

    const formData = new FormData();
    formData.append("file", imageFile);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData
    });

    const data = await res.json();
    return data.url;
  };

  const createPost = async () => {
    const imageUrl = await uploadImage();

    await fetch("/api/posts/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        plant_id: plantId,
        image_url: imageUrl,
        description
      })
    });

    setShowModal(false);
    setPlantQuery("");
    setPlantResults([]);
    setPlantId("");
    setImageFile(null);
    setImagePreview(null);
    setDescription("");

    loadData();
  };

  const searchPlants = async (value) => {
    setPlantQuery(value);

    if (!value) return setPlantResults([]);

    const res = await fetch(`/api/plants/search?q=${value}`);
    const data = await res.json();

    setPlantResults(data.plants || []);
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#f3f4f6",
      padding: "24px",
      display: "flex",
      justifyContent: "center"
    }}>
      <div style={{ width: "100%", maxWidth: "900px" }}>

        {/* HEADER */}
        <div style={{
          background: "white",
          padding: "20px",
          borderRadius: "12px",
          marginBottom: "20px",
          display: "flex",
          justifyContent: "space-between"
        }}>
          <h1 style={{ fontSize: "24px", fontWeight: "bold" }}>
            {user ? `${user.username}'s Garden` : "Loading..."}
          </h1>

          {isOwnProfile && (
            <button
              onClick={() => setShowModal(true)}
              style={{
                background: "#16a34a",
                color: "white",
                padding: "8px 14px",
                borderRadius: "8px",
                border: "none",
                cursor: "pointer",
                fontWeight: "bold"
              }}
            >
              Create Post
            </button>
          )}
        </div>

        {/* POSTS */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {posts.map(post => {
            const postComments = comments[post.id] || [];
            const isExpanded = expanded[post.id];
            const visible = isExpanded
              ? postComments
              : postComments.slice(0, 2);

            return (
              <div key={post.id} style={{
                background: "white",
                padding: "16px",
                borderRadius: "12px"
              }}>

                {/* IMAGE */}
                {post.image_url && (
                  <img
                    src={post.image_url}
                    style={{
                      width: "100%",
                      borderRadius: "10px",
                      marginBottom: "10px"
                    }}
                  />
                )}

                {/* PLANT */}
                <p
                  style={{
                    color: "#16a34a",
                    cursor: "pointer",
                    fontWeight: "bold"
                  }}
                  onClick={() => router.push(`/plant/${post.plant_id}`)}
                >
                  {post.common_name}
                </p>

                <p>{post.description}</p>

                {/* LIKE BUTTON (FIXED) */}
                <button
                  onClick={() => toggleLike(post.id)}
                  style={{
                    marginTop: "10px",
                    padding: "6px 12px",
                    borderRadius: "8px",
                    border: "none",
                    cursor: "pointer",
                    background: post.liked ? "#16a34a" : "#e5e7eb",
                    color: post.liked ? "white" : "black",
                    fontWeight: "bold"
                  }}
                >
                  👍 {post.like_count || 0}
                </button>

                {/* COMMENTS */}
                <div style={{ marginTop: "12px" }}>
                  {visible.map(c => (
                    <div key={c.id}>
                      <b>{c.username}</b>: {c.content}
                    </div>
                  ))}
                </div>

                <div style={{ display: "flex", gap: "6px", marginTop: "8px" }}>
                  <input
                    value={newComment[post.id] || ""}
                    onChange={(e) =>
                      setNewComment(prev => ({
                        ...prev,
                        [post.id]: e.target.value
                      }))
                    }
                    placeholder="Add comment..."
                    style={{
                      flex: 1,
                      padding: "6px",
                      borderRadius: "6px",
                      border: "1px solid #ccc"
                    }}
                  />

                  <button
                    onClick={() => submitComment(post.id)}
                    style={{
                      background: "#16a34a",
                      color: "white",
                      border: "none",
                      padding: "6px 10px",
                      borderRadius: "6px",
                      cursor: "pointer"
                    }}
                  >
                    Post
                  </button>
                </div>

              </div>
            );
          })}
        </div>

        {/* MODAL */}
        {showModal && (
          <div style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000
          }}>
            <div style={{
              background: "white",
              padding: "20px",
              borderRadius: "12px",
              width: "100%",
              maxWidth: "500px"
            }}>
              <h2 style={{ marginBottom: "10px" }}>Create Post</h2>

              <input
                value={plantQuery}
                onChange={(e) => searchPlants(e.target.value)}
                placeholder="Search plant..."
                style={{ width: "100%", padding: "8px", marginBottom: "8px" }}
              />

              {plantResults.map(p => (
                <div
                  key={p.id}
                  onClick={() => {
                    setPlantId(p.id);
                    setPlantQuery(p.common_name);
                    setPlantResults([]);
                  }}
                  style={{ cursor: "pointer", padding: "4px 0" }}
                >
                  {p.common_name}
                </div>
              ))}

              <input
                type="file"
                onChange={(e) => {
                  const file = e.target.files[0];
                  setImageFile(file);
                  if (file) setImagePreview(URL.createObjectURL(file));
                }}
              />

              {imagePreview && (
                <img
                  src={imagePreview}
                  style={{ width: "100%", marginTop: "10px" }}
                />
              )}

              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description..."
                style={{ width: "100%", marginTop: "10px", padding: "8px" }}
              />

              <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                <button
                  onClick={createPost}
                  style={{
                    background: "#16a34a",
                    color: "white",
                    padding: "8px",
                    borderRadius: "6px",
                    border: "none",
                    flex: 1
                  }}
                >
                  Post
                </button>

                <button
                  onClick={() => setShowModal(false)}
                  style={{
                    background: "#e5e7eb",
                    padding: "8px",
                    borderRadius: "6px",
                    border: "none",
                    flex: 1
                  }}
                >
                  Cancel
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}