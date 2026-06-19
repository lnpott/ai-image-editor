import {NextResponse} from 'next/server';
import {GoogleGenerativeAI} from '@google/generative-ai';

export async function POST(req:Request){
 try{
  const {command}=await req.json();

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
  const model = genAI.getGenerativeModel({model:'gemini-2.0-flash'});

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
