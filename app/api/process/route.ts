import {NextResponse} from 'next/server';
import sharp from 'sharp';

export async function POST(req:Request){
 try{
  const {image,width,action}=await req.json();

  if(!image){
   return NextResponse.json({error:'Imagem obrigatória'},{status:400});
  }

  const buffer=Buffer.from(image.split(',')[1],'base64');

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

  const output = await editor
   .jpeg({quality:95})
   .toBuffer();

  return NextResponse.json({
   image:`data:image/jpeg;base64,${output.toString('base64')}`
  });

 }catch(error:any){
  return NextResponse.json({error:error.message},{status:500});
 }
}
