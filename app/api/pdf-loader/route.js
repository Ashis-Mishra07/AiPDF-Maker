import { NextResponse } from "next/server";
import { WebPDFLoader } from "@langchain/community/document_loaders/web/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

// const pdfUrl =
//   "https://mild-chipmunk-966.convex.cloud/api/storage/935b9bba-e888-4ac1-b1ac-c3ef3a44cb95";

export async function GET(req) {
  // 1. load the pdf file

  const reqUrl=req.url;
  const {searchParams}= new URL(reqUrl);
  const pdfUrl = searchParams.get('pdfUrl');

  console.log(pdfUrl);
  

  const response = await fetch(pdfUrl);
  const data = await response.blob();
  const loader = new WebPDFLoader(data);
  const docs = await loader.load();

  let pdfTextContent = "";
  docs.forEach((doc) => {
    pdfTextContent = pdfTextContent + doc.pageContent;
  });

  // 2. split the text into small chunks
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 100,
    chunkOverlap: 20,
  });

  const output = await splitter.createDocuments([pdfTextContent]);

  let splitterList = [];
  output.forEach((doc) => {
    splitterList.push(doc.pageContent);
  });

  return NextResponse.json({ result: pdfTextContent });
}
