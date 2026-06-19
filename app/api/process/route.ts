import {NextResponse} from 'next/server';
import sharp from 'sharp';

async function removeBackground(buffer:Buffer){
 const apiKey = process.env.REMOVE_BG_API_KEY;

 if(!apiKey){
  throw new Error('REMOVE_BG_API_KEY não configurada');
 }

 const form = new FormData();
 form.append('image_file', new Blob([buffer]), 'image.png');
 form.append('size','auto');

 const response = await fetch('https://api.remove.bg/v1.0/removebg',{
  method:'POST',
  headers:{
   'X-Api-Key':apiKey
  },
  body:form
 });

 if(!response.ok){
  throw new Error('Falha ao remover fundo');
 }

 return Buffer.from(await response.arrayBuffer());
}

export async function POST(req:Request){
 try{
  const {image,width,action}=await req.json();

  if(!image){
   return NextResponse.json({error:'Imagem obrigatória'},{status:400});
  }

  let buffer=Buffer.from(image.split(',')[1],'base64');

  if(action === 'remove_background'){
   buffer = await removeBackground(buffer);
  }

  let editor = sharp(buffer);

  if(action === 'document'){
   editor = editor
    .grayscale()
    .normalize();
  }

  if(action === 'enhance' || action === 'upscale'){
   editor = editor
    .resize({width:width || 2400, withoutEnlargement:false})
    .sharpen();
  }

  const output = await editor.toBuffer();

  return NextResponse.json({
   image:`data:image/png;base64,${output.toString('base64')}`
  });

 }catch(error:any){
  return NextResponse.json({error:error.message},{status:500});
 }
}
