import {NextResponse} from 'next/server';
import {GoogleGenerativeAI} from '@google/generative-ai';

export async function POST(req:Request){
 try{
  const {command}=await req.json();

  const apiKey = process.env.GEMINI_API_KEY;
  if(!apiKey){
   return NextResponse.json({error:'GEMINI_API_KEY não configurada'},{status:500});
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({model:'gemini-1.5-flash'});

  const result = await model.generateContent(`
Classifique o comando em uma ação de editor de imagem.
Use somente:
upscale
remove_background
document
enhance

Comando: ${command}

Responda somente a ação.
`);

  return NextResponse.json({action:result.response.text().trim()});
 }catch(e:any){
  return NextResponse.json({error:e.message},{status:500});
 }
}
