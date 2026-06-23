import {NextResponse} from 'next/server';
import sharp from 'sharp';

export async function POST(req:Request){
 try{
  const {image,width,action}=await req.json();

  if(!image){
   return NextResponse.json({error:'Imagem obrigatória'},{status:400});
  }

  let buffer=Buffer.from(image.split(',')[1],'base64');

  if(action === 'remove_background'){
   return NextResponse.json({error:'Funcionalidade de remoção de fundo temporariamente desabilitada. Use outras opções de edição.'},{status:400});
  }

  let editor = sharp(buffer);

  if(action === 'document'){
   editor = editor
    .grayscale()
    .normalize();
  }

  if(action === 'enhance' || action === 'upscale'){
   const targetWidth = width || 2400;
   editor = editor
    .resize({ 
      width: targetWidth, 
      withoutEnlargement: false,
      kernel: 'lanczos3',
      fit: 'inside'
    })
    .sharpen({
      sigma: 1,
      m1: 1,
      m2: 2
    })
    .modulate({
      brightness: 1.05,
      saturation: 1.1
    });
  }

  const output = await editor.toBuffer();

  return NextResponse.json({
   image:`data:image/png;base64,${output.toString('base64')}`
  });

 }catch(error:any){
  return NextResponse.json({error:error.message},{status:500});
 }
}
