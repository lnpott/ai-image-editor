"use client";

import { useState } from "react";

export default function Home() {
  const [image, setImage] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [chat, setChat] = useState<any[]>([]);
  const [command, setCommand] = useState("");

  function loadImage(e: any) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => setImage(reader.result as string);
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
        body:JSON.stringify({image,width:2400})
      });

      const processed = await process.json();
      if(processed.image) setResult(processed.image);
    }

    setCommand("");
    setLoading(false);
  }

  return (
    <main style={{padding:40,fontFamily:"Arial"}}>
      <h1>AI Image Editor</h1>

      <input type="file" accept="image/*" onChange={loadImage}/>

      {image && <>
        <h3>Imagem</h3>
        <img src={image} style={{maxWidth:500}}/>
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

      <button onClick={sendCommand} disabled={loading} style={{padding:10}}>
        {loading ? "Processando...":"Enviar"}
      </button>

      {result && <>
        <h3>Resultado</h3>
        <img src={result} style={{maxWidth:500}}/>
        <br/>
        <a href={result} download="imagem.jpg">Baixar</a>
      </>}
    </main>
  );
}
