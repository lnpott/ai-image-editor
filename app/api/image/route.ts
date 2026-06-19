import {NextResponse} from 'next/server';

export async function POST(req:Request){
 try{
  const {image,action}=await req.json();

  if(!image){
   return NextResponse.json({error:'Imagem obrigatória'},{status:400});
  }

  return NextResponse.json({
   message:'Pipeline de edição preparado',
   action,
   image
  });
 }catch(e:any){
  return NextResponse.json({error:e.message},{status:500});
 }
}
