"use client";

import { useState, type TextareaHTMLAttributes } from "react";

interface RichTextFieldProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "onChange" | "value"> {
  label: string;
  value: string;
  onChange: (value: string) => void;
  minHeight?: string;
}

export default function RichTextField({
  label,
  value,
  onChange,
  minHeight = "190px",
  className,
  ...props
}: RichTextFieldProps) {
  const [textareaRef, setTextareaRef] = useState<HTMLTextAreaElement | null>(null);

  function insertMarkup(prefix: string, suffix = prefix) {
    const textarea = textareaRef;
    if (!textarea) {
      onChange(`${value}${value ? "\n" : ""}${prefix}texto${suffix}`);
      return;
    }
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = value.substring(start, end) || "texto";
    const newValue = value.substring(0, start) + prefix + selected + suffix + value.substring(end);
    onChange(newValue);
    requestAnimationFrame(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + selected.length);
    });
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Tab") {
      event.preventDefault();
      const textarea = event.currentTarget;
      const start = textarea.selectionStart;
      const newValue = value.substring(0, start) + "  " + value.substring(textarea.selectionEnd);
      onChange(newValue);
      requestAnimationFrame(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 2;
      });
    }
  }

  return (
    <div className="space-y-2">
      <label className="text-label-md font-bold uppercase tracking-wide text-on-surface-variant">{label}</label>
      <div className="overflow-hidden rounded-xl border border-outline-variant">
        <div className="flex flex-wrap gap-1 border-b border-outline-variant bg-surface-container-low px-3 py-2">
          <button type="button" onClick={() => insertMarkup("**")} className="rounded-lg px-3 py-1 text-label-md font-bold hover:bg-surface-container-high" title="Negrita">B</button>
          <button type="button" onClick={() => insertMarkup("_")} className="rounded-lg px-3 py-1 text-label-md italic hover:bg-surface-container-high" title="Cursiva">I</button>
          <button type="button" onClick={() => insertMarkup("<u>", "</u>")} className="rounded-lg px-3 py-1 text-label-md underline hover:bg-surface-container-high" title="Subrayado">U</button>
          <span className="mx-1 w-px bg-outline-variant" />
          <button type="button" onClick={() => insertMarkup("\n## ", "")} className="rounded-lg px-3 py-1 text-label-md font-bold hover:bg-surface-container-high" title="Encabezado H2">H2</button>
          <button type="button" onClick={() => insertMarkup("\n### ", "")} className="rounded-lg px-3 py-1 text-label-md font-bold hover:bg-surface-container-high" title="Encabezado H3">H3</button>
          <span className="mx-1 w-px bg-outline-variant" />
          <button type="button" onClick={() => insertMarkup("\n- ", "")} className="rounded-lg px-3 py-1 text-label-md hover:bg-surface-container-high" title="Lista">Lista</button>
          <button type="button" onClick={() => insertMarkup("\n1. ", "")} className="rounded-lg px-3 py-1 text-label-md hover:bg-surface-container-high" title="Lista numerada">1.</button>
          <span className="mx-1 w-px bg-outline-variant" />
          <button type="button" onClick={() => insertMarkup("[texto](", ")")} className="rounded-lg px-3 py-1 text-label-md hover:bg-surface-container-high" title="Enlace">Enlace</button>
        </div>
        <textarea
          ref={(el) => setTextareaRef(el)}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={handleKeyDown}
          className={`block w-full bg-surface-container-lowest px-4 py-3 text-body-md text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none ${className ?? ""}`}
          style={{ minHeight }}
          {...props}
        />
      </div>
    </div>
  );
}
