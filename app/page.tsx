"use client";

import { useState } from "react";

export default function Home() {
  const [image, setImage] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  function loadImage(e: any) {
    const file = e.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      setImage(reader.result as string);
    };

    reader.readAsDataURL(file);
  }

  async function processImage() {
    if (!image) return;

    setLoading(true);

    const response = await fetch("/api/process", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        image,
        width: 2400,
      }),
    });

    const data = await response.json();

    if (data.image) {
      setResult(data.image);
    }

    setLoading(false);
  }

  return (
    <main style={{ padding: 40, fontFamily: "Arial" }}>
      <h1>AI Image Editor</h1>

      <input
        type="file"
        accept="image/*"
        onChange={loadImage}
      />

      <br />

      {image && (
        <>
          <h3>Original</h3>
          <img
            src={image}
            style={{ maxWidth: 500 }}
          />
        </>
      )}

      <br />

      <button
        onClick={processImage}
        disabled={loading}
        style={{
          padding: 12,
          marginTop: 20
        }}
      >
        {loading ? "Processando..." : "Melhorar imagem"}
      </button>


      {result && (
        <>
          <h3>Resultado</h3>

          <img
            src={result}
            style={{ maxWidth: 500 }}
          />

          <br />

          <a
            href={result}
            download="imagem-melhorada.jpg"
          >
            Baixar imagem
          </a>
        </>
      )}

    </main>
  );
}
