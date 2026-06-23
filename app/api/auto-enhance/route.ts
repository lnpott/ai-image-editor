import {NextResponse} from 'next/server';
import sharp from 'sharp';

export async function POST(req:Request){
 try{
  const {image}=await req.json();

  if(!image){
   return NextResponse.json({error:'Imagem obrigatória'},{status:400});
  }

  const buffer=Buffer.from(image.split(',')[1],'base64');

  const output = await sharp(buffer)
   .normalize()
   .modulate({
    brightness:1.1,
    saturation:1.2
   })
   .sharpen()
   .toBuffer();

  return NextResponse.json({
   image:`data:image/png;base64,${output.toString('base64')}`
  });

 }catch(error:any){
  return NextResponse.json({error:error.message},{status:500});
 }
}
