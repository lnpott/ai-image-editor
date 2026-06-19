"use client";
import {useState} from "react";

export default function Home(){
 const [prompt,setPrompt]=useState("");
 const [msg,setMsg]=useState("");
 async function run(){
  const r=await fetch('/api/gemini',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({prompt})});
  const j=await r.json(); setMsg(j.text||'OK');
 }
 return <main style={{padding:40,fontFamily:'Arial'}}>
 <h1>AI Image Editor</h1>
 <p>Editor de imagem com Gemini</p>
 <input placeholder="Ex: remova fundo, melhore imagem..." value={prompt} onChange={e=>setPrompt(e.target.value)} style={{width:'80%',padding:10}}/>
 <button onClick={run} style={{padding:10,margin:10}}>Enviar</button>
 <pre>{msg}</pre>
 </main>
}
