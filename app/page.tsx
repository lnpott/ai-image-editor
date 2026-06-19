"use client";
import {useState} from "react";

export default function Home(){
 const [prompt,setPrompt]=useState("");
 const [image,setImage]=useState<string>("");
 const [msg,setMsg]=useState("");

 async function run(){
  const r=await fetch('/api/gemini',{
   method:'POST',
   headers:{'Content-Type':'application/json'},
   body:JSON.stringify({prompt,image})
  });
  const j=await r.json();
  setMsg(j.text || j.error || 'Finalizado');
 }

 function loadImage(e:any){
  const f=e.target.files?.[0];
  if(!f) return;
  const reader=new FileReader();
  reader.onload=()=>setImage(reader.result as string);
  reader.readAsDataURL(f);
 }

 return <main style={{padding:40,fontFamily:'Arial'}}>
  <h1>AI Image Editor</h1>
  <p>Editor com IA por comandos</p>

  <input type="file" accept="image/*" onChange={loadImage}/>

  {image && <img src={image} style={{maxWidth:500,display:'block',marginTop:20}}/>}

  <input value={prompt} onChange={e=>setPrompt(e.target.value)} placeholder="Ex: remova o fundo e melhore a qualidade" style={{width:'80%',padding:10,marginTop:20}}/>

  <button onClick={run} style={{padding:10,margin:10}}>Aplicar IA</button>

  <pre>{msg}</pre>
 </main>
}
