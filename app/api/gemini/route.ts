import {GoogleGenerativeAI} from '@google/generative-ai';
import {NextResponse} from 'next/server';

export async function POST(req:Request){
 const {prompt}=await req.json();
 const genAI=new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
 const model=genAI.getGenerativeModel({model:'gemini-2.0-flash'});
 const result=await model.generateContent(prompt);
 return NextResponse.json({text:result.response.text()});
}
