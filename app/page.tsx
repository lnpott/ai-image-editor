"use client";

import { useState } from "react";
import ImageCropper from "./components/ImageCropper";

export default function Home() {
  const [image, setImage] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [chat, setChat] = useState<any[]>([]);
  const [command, setCommand] = useState("");
  const [showCropper, setShowCropper] = useState(false);
  const [showResult, setShowResult] = useState(false);

  function loadImage(e: any) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result as string);
      setResult("");
      setShowResult(false);
      setChat([]);
    };
    reader.readAsDataURL(file);
  }

  async function sendCommand() {
    if (!command) return;

    setLoading(true);

    const newChat = [...chat, {role:"user", text:command}];
    setChat(newChat);

    const response = await fetch("/api/command", {
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({command})
    });

    const data = await response.json();

    setChat([...newChat, {role:"ai", text:data.action}]);

    if (image) {
      const process = await fetch("/api/process", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({image,width:2400,action:data.action})
      });

      const processed = await process.json();
      if(processed.image) {
        setResult(processed.image);
        setShowResult(true);
      }
    }

    setCommand("");
    setLoading(false);
  }

  async function autoEnhance() {
    if (!image) return;
    setLoading(true);

    const response = await fetch("/api/auto-enhance", {
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({image})
    });

    const data = await response.json();
    if(data.image) {
      setResult(data.image);
      setShowResult(true);
    }
    setLoading(false);
  }

  async function removeBackground() {
    if (!image) return;
    setLoading(true);

    const response = await fetch("/api/process", {
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({image,action:"remove_background"})
    });

    const data = await response.json();
    if(data.image) {
      setResult(data.image);
      setShowResult(true);
    }
    setLoading(false);
  }

  async function upscale() {
    if (!image) return;
    setLoading(true);

    const response = await fetch("/api/process", {
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({image,width:2400,action:"upscale"})
    });

    const data = await response.json();
    if(data.image) {
      setResult(data.image);
      setShowResult(true);
    }
    setLoading(false);
  }

  function handleCropComplete(croppedImage: string) {
    setImage(croppedImage);
    setShowCropper(false);
  }

  function continueEditing() {
    setImage(result);
    setResult("");
    setShowResult(false);
  }

  function resetToStart() {
    setImage("");
    setResult("");
    setShowResult(false);
    setChat([]);
  }

  if (showResult && result) {
    return (
      <main style={{padding:40,fontFamily:"Arial"}}>
        <h1>Resultado</h1>
        
        <div style={{marginBottom:20}}>
          <img src={result} alt="Imagem editada" style={{maxWidth:"100%",borderRadius:8}}/>
        </div>

        <div style={{display:"flex",gap:10,flexWrap:"wrap",justifyContent:"center"}}>
          <a 
            href={result} 
            download="imagem-editada.png"
            style={{
              padding:"12px 24px",
              background:"#0070f3",
              color:"white",
              textDecoration:"none",
              borderRadius:4,
              cursor:"pointer"
            }}
          >
            Baixar Imagem
          </a>
          <button 
            onClick={continueEditing}
            style={{padding:12,background:"#28a745",color:"white",border:"none",borderRadius:4,cursor:"pointer"}}
          >
            Continuar Editando
          </button>
          <button 
            onClick={resetToStart}
            style={{padding:12,background:"#6c757d",color:"white",border:"none",borderRadius:4,cursor:"pointer"}}
          >
            Nova Imagem
          </button>
        </div>
      </main>
    );
  }

  return (
    <main style={{padding:40,fontFamily:"Arial"}}>
      <h1>AI Image Editor</h1>

      <input type="file" accept="image/*" onChange={loadImage} aria-label="Carregar imagem"/>

      {showCropper && image && (
        <ImageCropper
          image={image}
          onCropComplete={handleCropComplete}
          onCancel={() => setShowCropper(false)}
        />
      )}

      {!showCropper && image && <>
        <h3>Imagem</h3>
        <img src={image} alt="Imagem carregada" style={{maxWidth:500,borderRadius:8}}/>

        <div style={{marginTop:20,display:"flex",gap:10,flexWrap:"wrap"}}>
          <button onClick={() => setShowCropper(true)} disabled={loading} style={{padding:10,background:"#0070f3",color:"white",border:"none",borderRadius:4,cursor:"pointer"}}>
            Cortar
          </button>
          <button onClick={autoEnhance} disabled={loading} style={{padding:10,background:"#28a745",color:"white",border:"none",borderRadius:4,cursor:"pointer"}}>
            {loading ? "Processando...":"Auto Melhorar"}
          </button>
          <button onClick={removeBackground} disabled={loading} style={{padding:10,background:"#dc3545",color:"white",border:"none",borderRadius:4,cursor:"pointer"}}>
            {loading ? "Processando...":"Remover Fundo"}
          </button>
          <button onClick={upscale} disabled={loading} style={{padding:10,background:"#ffc107",color:"black",border:"none",borderRadius:4,cursor:"pointer"}}>
            {loading ? "Processando...":"Aumentar Resolução"}
          </button>
        </div>
      </>}

      <hr/>

      <h3>Chat IA</h3>

      <div>
        {chat.map((m,i)=>(
          <p key={i}><b>{m.role}:</b> {m.text}</p>
        ))}
      </div>

      <input
        value={command}
        onChange={e=>setCommand(e.target.value)}
        placeholder="Ex: remove o fundo, melhora qualidade..."
        style={{width:"80%",padding:10}}
      />

      <button onClick={sendCommand} disabled={loading} style={{padding:10,background:"#0070f3",color:"white",border:"none",borderRadius:4,cursor:"pointer"}}>
        {loading ? "Processando...":"Enviar"}
      </button>
    </main>
  );
}
