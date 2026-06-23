import {NextResponse} from 'next/server';
import sharp from 'sharp';

export async function POST(req:Request){
 try{
  const {image,x,y,width,height}=await req.json();

  if(!image){
   return NextResponse.json({error:'Imagem obrigatória'},{status:400});
  }

  if(!x || !y || !width || !height){
   return NextResponse.json({error:'Coordenadas de crop obrigatórias'},{status:400});
  }

  const buffer=Buffer.from(image.split(',')[1],'base64');

  const output = await sharp(buffer)
   .extract({
    left:Math.round(x),
    top:Math.round(y),
    width:Math.round(width),
    height:Math.round(height)
   })
   .toBuffer();

  return NextResponse.json({
   image:`data:image/png;base64,${output.toString('base64')}`
  });

 }catch(error:any){
  return NextResponse.json({error:error.message},{status:500});
 }
}
