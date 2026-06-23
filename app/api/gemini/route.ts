import {GoogleGenerativeAI} from '@google/generative-ai';
import {NextResponse} from 'next/server';

export async function POST(req:Request){
 try {
  const {prompt,image}=await req.json();

  const apiKey = process.env.GEMINI_API_KEY;
  if(!apiKey){
   return NextResponse.json({error:'GEMINI_API_KEY não configurada'},{status:500});
  }

  const genAI=new GoogleGenerativeAI(apiKey);
  const model=genAI.getGenerativeModel({model:'gemini-1.5-flash'});

  const parts:any[]=[{text:prompt || 'Analise esta imagem'}];

  if(image){
   const base64=image.split(',')[1];
   parts.push({inlineData:{data:base64,mimeType:'image/jpeg'}});
  }

  const result=await model.generateContent(parts);

  return NextResponse.json({
   text:result.response.text()
  });
 } catch(error:any){
  return NextResponse.json({error:error.message},{status:500});
 }
}
