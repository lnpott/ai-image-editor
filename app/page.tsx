"use client";
import {useState} from "react";

export default function Home(){
 const [prompt,setPrompt]=useState("");
 const [image,setImage]=useState<string>("");
 const [msg,setMsg]=useState("");

 async function run(){
  const r=await fetch('/api/gemini',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({prompt})});
  const j=await r.json();
  setMsg(j.text || 'Processado');
 }

 return <main style={{padding:40,fontFamily:'Arial'}}>
  <h1>AI Image Editor</h1>
  <p>Editor de imagem com comandos IA</p>

  <input type="file" accept="image/*" onChange={e=>{
    const f=e.target.files?.[0];
    if(f) setImage(URL.createObjectURL(f));
  }}/>

  {image && <img src={image} style={{maxWidth:400,display:'block',marginTop:20}}/>}

  <input placeholder="Ex: remover fundo, cortar documento, upscale..." value={prompt} onChange={e=>setPrompt(e.target.value)} style={{width:'80%',padding:10,marginTop:20}}/>
  <button onClick={run} style={{padding:10,margin:10}}>Executar IA</button>

  <pre>{msg}</pre>
 </main>
}
