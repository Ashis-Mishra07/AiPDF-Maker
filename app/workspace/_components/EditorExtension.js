import { chatSession } from '@/configs/AIModel';
import { api } from '@/convex/_generated/api';
import { useAction } from 'convex/react';
import { AlignCenter, AlignLeft, AlignRight, Bold, Heading1, Heading2, Heading2Icon, Heading3, Highlighter, Italic, MoveLeft, MoveRight, Pointer, Redo, Sparkles, Strikethrough, Subscript, Superscript, Underline, Undo } from 'lucide-react';
import { useParams } from 'next/navigation';
import React from 'react'

function EditorExtension({editor}) {
    const { fileId } = useParams();

    const SearchAi = useAction(api.myAction.search);
    const onAiClick = async() => {
        const selectedText = editor.state.doc.textBetween(
            editor.state.selection.from, 
            editor.state.selection.to,
            ' '
        );
        // console.log("selected text" , selectedText);
        
        const result = await SearchAi({
          query: selectedText,
          fileId: fileId,
        });

        const UnformattedResult = JSON.parse(result);
        let AllUnformattedAns='';
        UnformattedResult&&UnformattedResult.forEach(item =>{
          AllUnformattedAns = AllUnformattedAns + item.pageContent;
        })

        const PROMPT = `
          You are an AI assistant tasked with formatting text into clean and semantic HTML. 

          Context:
          I have a question: "${selectedText}"
          Below is the content provided as the answer to the question. Your task is to return the answer formatted in HTML, ensuring it is structured with appropriate tags such as <p>, <ul>, <ol>, <strong>, <em>, or <h1> where necessary.

          Content:
          ${AllUnformattedAns}

          Output:
          Please return only the HTML-formatted answer, without additional comments or explanations ,
           and do not repeat the question again . Give me short answer in 2-3 lines and do not give the bold heading .
          `;

          const AiModelResult = await chatSession.sendMessage(PROMPT);
          // console.log("AI Model Result", AiModelResult.response.text());
          const FinalAns = AiModelResult.response
            .text()
            .replace("```", "")
            .replace("html", "")
            .replace("```", "");

          const AllText = editor.getHTML();
          editor.commands.setContent(
            AllText + "<p><strong>Answer:</strong>" + FinalAns + "</p>"
          );
          
    }

  return (
    editor && (
      <div className="p-5 ">
        <div className="control-group ">
          <div className="button-group flex gap-4 text-2xl">
            <button
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 1 }).run()
              }
              className={
                editor.isActive("heading", { level: 1 }) ? "is-active" : ""
              }>
              <Heading1 />
            </button>
            <button
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 2 }).run()
              }
              className={
                editor.isActive("heading", { level: 2 }) ? "is-active" : ""
              }>
              <Heading2 />
            </button>
            <button
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 3 }).run()
              }
              className={
                editor.isActive("heading", { level: 3 }) ? "is-active" : ""
              }>
              <Heading3 />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={editor.isActive("bold") ? "text-blue-500" : ""}>
              <Bold />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={editor.isActive("italic") ? "text-blue-500" : ""}>
              <Italic />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              className={editor.isActive("underline") ? "is-active" : ""}>
              <Underline />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleStrike().run()}
              className={editor.isActive("strike") ? "is-active" : ""}>
              <Strikethrough />
            </button>
            <button
              onClick={() => editor.chain().focus().setTextAlign("left").run()}
              className={
                editor.isActive({ textAlign: "left" }) ? "is-active" : ""
              }>
              <AlignLeft />
            </button>
            <button
              onClick={() =>
                editor.chain().focus().setTextAlign("center").run()
              }
              className={
                editor.isActive({ textAlign: "center" }) ? "is-active" : ""
              }>
              <AlignCenter />
            </button>
            <button
              onClick={() => editor.chain().focus().setTextAlign("right").run()}
              className={
                editor.isActive({ textAlign: "right" }) ? "is-active" : ""
              }>
              <AlignRight />
            </button>
            <button
              onClick={() =>
                editor
                  .chain()
                  .focus()
                  .toggleHighlight({ color: "#ffc078" })
                  .run()
              }
              className={
                editor.isActive("highlight", { color: "#ffc078" })
                  ? "is-active"
                  : ""
              }>
              <Highlighter />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleSuperscript().run()}
              className={editor.isActive("superscript") ? "is-active" : ""}>
              <Superscript />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleSubscript().run()}
              className={editor.isActive("subscript") ? "is-active" : ""}>
              <Subscript />
            </button>
            <button
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().undo()}>
              <Undo />
            </button>
            <button
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().redo()}>
              <Redo />
            </button>
            <button
              onClick={() => onAiClick()}
              className={"hover:text-blue-500"}>
              <Sparkles />
            </button>
          </div>
        </div>
      </div>
    )
  );
}

export default EditorExtension