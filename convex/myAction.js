import { ConvexVectorStore } from "@langchain/community/vectorstores/convex";
import { action } from "./_generated/server.js";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { TaskType } from "@google/generative-ai";
import { v } from "convex/values";

export const ingest = action({
  args: {
    splitText: v.any(),
    fileId: v.string(),
  },
  handler: async (ctx, args) => {

    console.log("Google API Key being used:", process.env.GOOGLE_API_KEY);

      const splitTextArray = Array.isArray(args.splitText)
        ? args.splitText
        : [args.splitText];

      await ConvexVectorStore.fromTexts(
        splitTextArray,
        args.fileId,
        new GoogleGenerativeAIEmbeddings({
          apiKey: "AIzaSyBdcxo7HLHK6hkXKlWFdVDoTEKd8aGvuwA",
          model: "text-embedding-004",
          taskType: TaskType.RETRIEVAL_DOCUMENT,
          title: "Document title",
        }),
        { ctx }
      );
      return "Ingestion completed successfully.";
  },
});

export const search = action({
  args: {
    query: v.string(),
    fileId: v.string(),
  },
  handler: async (ctx, args) => {
    const vectorStore = new ConvexVectorStore(
      new GoogleGenerativeAIEmbeddings({
        apiKey: "AIzaSyBdcxo7HLHK6hkXKlWFdVDoTEKd8aGvuwA",
        model: "text-embedding-004",
        taskType: TaskType.RETRIEVAL_DOCUMENT,
        title: "Document title",
      }),
      { ctx }
    );

    const resultOne = (await vectorStore.similaritySearch(args.query, 1))
    .filter(q=>q.metadata.fileId === args.fileId);
    console.log(resultOne);

    return JSON.stringify(resultOne);
  },
});
