"use client";

import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";

let Quill;
if (typeof window !== "undefined") {
  Quill = require("react-quill-new").Quill;

  const List = Quill.import("formats/list");
  Quill.register(List, true);
}

// import dinamis ReactQuill untuk menghindari error SSR
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["blockquote", "code-block"],
    ["link"],
    ["clean"],
  ],
};

const formats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "list",
  "blockquote",
  "code-block",
  "link",
];

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  height?: number;
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Ekspresikan perasaanmu di sini...",
  height = 300,
}: RichTextEditorProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-300 focus-within:border-green-500 focus-within::ring-2 focus-within::ring-green-200 transition-colors">
      <ReactQuill
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        style={{ height: `${height}px` }}
        theme="snow"
      />
    </div>
  );
}
