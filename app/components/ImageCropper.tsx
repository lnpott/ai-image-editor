"use client";

import { useState, useRef, useEffect } from "react";
import ReactCrop, { Crop, PixelCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

interface ImageCropperProps {
  image: string;
  onCropComplete: (croppedImage: string) => void;
  onCancel: () => void;
}

export default function ImageCropper({ image, onCropComplete, onCancel }: ImageCropperProps) {
  const [crop, setCrop] = useState<Crop>();
  const [zoom, setZoom] = useState(1);
  const [aspect, setAspect] = useState<number | undefined>(undefined);
  const imgRef = useRef<HTMLImageElement>(null);

  const aspects = [
    { label: "Livre", value: undefined },
    { label: "1:1", value: 1 },
    { label: "16:9", value: 16 / 9 },
    { label: "4:3", value: 4 / 3 },
  ];

  useEffect(() => {
    if (aspect) {
      setCrop({ unit: '%', width: 50, height: 50 / aspect, x: 25, y: (50 - 50 / aspect) / 2 });
    } else {
      setCrop({ unit: '%', width: 50, height: 50, x: 25, y: 25 });
    }
  }, [aspect]);

  function handleCropComplete(crop: PixelCrop) {
    if (!imgRef.current || !crop) return;

    const image = imgRef.current;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    canvas.width = crop.width * scaleX;
    canvas.height = crop.height * scaleY;

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      canvas.width,
      canvas.height
    );

    const croppedImage = canvas.toDataURL("image/png");
    onCropComplete(croppedImage);
  }

  return (
    <div style={{ padding: 20, border: "1px solid #ccc", borderRadius: 8 }}>
      <h3>Cortar Imagem</h3>

      <div style={{ marginBottom: 20 }}>
        <label>Proporção: </label>
        <select
          value={aspect || "free"}
          onChange={(e) => setAspect(e.target.value === "free" ? undefined : Number(e.target.value))}
          style={{ padding: 5, marginLeft: 10 }}
          aria-label="Selecionar proporção"
          title="Selecionar proporção"
        >
          {aspects.map((a) => (
            <option key={a.label} value={a.value || "free"}>
              {a.label}
            </option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: 20 }}>
        <label>Zoom: {zoom.toFixed(1)}x</label>
        <input
          type="range"
          min={0.5}
          max={3}
          step={0.1}
          value={zoom}
          onChange={(e) => setZoom(Number(e.target.value))}
          style={{ width: 200, marginLeft: 10 }}
          aria-label="Zoom"
          title="Zoom"
        />
      </div>

      <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
        <div style={{ transform: `scale(${zoom})`, transformOrigin: "center" }}>
          <ReactCrop
            crop={crop}
            onChange={(c) => setCrop(c)}
            onComplete={handleCropComplete}
            aspect={aspect}
          >
            <img
              ref={imgRef}
              src={image}
              alt="Crop preview"
              style={{ maxWidth: 500 }}
            />
          </ReactCrop>
        </div>
      </div>

      <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
        <button
          onClick={onCancel}
          style={{ padding: 10, background: "#ccc", border: "none", borderRadius: 4, cursor: "pointer" }}
        >
          Cancelar
        </button>
        <button
          onClick={() => crop && handleCropComplete(crop as PixelCrop)}
          disabled={!crop}
          style={{ padding: 10, background: "#0070f3", color: "white", border: "none", borderRadius: 4, cursor: "pointer" }}
        >
          Aplicar Corte
        </button>
      </div>
    </div>
  );
}
