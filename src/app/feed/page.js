"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function FeedPage() {
  const router = useRouter();

  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState({});
  const [expanded, setExpanded] = useState({});
  const [newComment, setNewComment] = useState({});

  useEffect(() => {
    loadFeed();
  }, []);

  const loadFeed = async () => {
    const res = await fetch("/api/posts/feed");
    const data = await res.json();

    const posts = data.posts || [];
    setPosts(posts);

    // preload comments
    for (const post of posts) {
      const res = await fetch(`/api/posts/${post.id}/comments`);
      const data = await res.json();

      setComments(prev => ({
        ...prev,
        [post.id]: data.comments || []
      }));
    }
  };

  const toggleLike = async (postId) => {
    await fetch(`/api/posts/${postId}/like`, { method: "POST" });
    loadFeed(); // refresh counts + state
  };

  const submitComment = async (postId) => {
    await fetch(`/api/posts/${postId}/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        content: newComment[postId]
      })
    });

    setNewComment(prev => ({ ...prev, [postId]: "" }));

    // reload comments
    const res = await fetch(`/api/posts/${postId}/comments`);
    const data = await res.json();

    setComments(prev => ({
      ...prev,
      [postId]: data.comments
    }));
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

        <h1 style={{
          fontSize: "26px",
          fontWeight: "bold",
          marginBottom: "20px"
        }}>
          Following Feed
        </h1>

        {posts.map(post => {
          const postComments = comments[post.id] || [];
          const isExpanded = expanded[post.id];

          const visibleComments = isExpanded
            ? postComments
            : postComments.slice(0, 2);

          return (
            <div key={post.id} style={{
              background: "white",
              padding: "16px",
              borderRadius: "12px",
              marginBottom: "20px",
              boxShadow: "0 2px 6px rgba(0,0,0,0.05)"
            }}>

              {/* IMAGE */}
              {post.image_url && (
                  <div style={{
                    width: "100%",
                    aspectRatio: "16/9",
                    position: "relative",
                    overflow: "hidden",
                    borderRadius: "10px",
                    marginBottom: "10px"
                  }}>
                    <img
                      src={post.image_url}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover"
                      }}
                    />
                  </div>
                )}

              {/* USER */}
              <p
                style={{
                  fontWeight: "bold",
                  cursor: "pointer",
                  marginBottom: "4px"
                }}
                onClick={() => router.push(`/user/${post.user_id}`)}
              >
                {post.username}
              </p>

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

              <p style={{ marginTop: "6px" }}>
                {post.description}
              </p>

              {/* LIKE BUTTON */}
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
                👍 {post.like_count}
              </button>

              {/* COMMENTS */}
              <div style={{ marginTop: "12px" }}>

                {/* COMMENT LIST */}
                <div style={{
                  maxHeight: isExpanded ? "140px" : "auto",
                  overflowY: isExpanded ? "auto" : "visible",
                  marginBottom: "6px"
                }}>
                  {visibleComments.map(c => (
                    <div key={c.id} style={{ marginBottom: "4px" }}>
                      <b>{c.username}</b>: {c.content}
                    </div>
                  ))}
                </div>

                {/* EXPAND BUTTON */}
                {postComments.length > 2 && (
                  <button
                    onClick={() =>
                      setExpanded(prev => ({
                        ...prev,
                        [post.id]: !prev[post.id]
                      }))
                    }
                    style={{
                      marginBottom: "6px",
                      background: "#e5e7eb",
                      border: "none",
                      padding: "4px 8px",
                      borderRadius: "6px",
                      cursor: "pointer"
                    }}
                  >
                    {isExpanded ? "Hide comments" : "View all comments"}
                  </button>
                )}

                {/* INPUT */}
                <div style={{ display: "flex", gap: "6px" }}>
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

            </div>
          );
        })}

      </div>
    </div>
  );
}