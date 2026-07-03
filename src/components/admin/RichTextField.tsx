"use client";

import { useState, type TextareaHTMLAttributes } from "react";

type RichTextControl = "bold" | "italic" | "underline" | "h2" | "h3" | "ul" | "ol" | "link";

interface RichTextFieldProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "onChange" | "value"> {
  label: string;
  value: string;
  onChange: (value: string) => void;
  minHeight?: string;
  controls?: RichTextControl[];
}

const defaultControls: RichTextControl[] = ["bold", "italic", "underline", "h2", "h3", "ul", "ol", "link"];

export default function RichTextField({
  label,
  value,
  onChange,
  minHeight = "190px",
  className,
  controls = defaultControls,
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

  function hasControl(control: RichTextControl) {
    return controls.includes(control);
  }

  function showSeparator(before: RichTextControl, after: RichTextControl) {
    return hasControl(before) && hasControl(after);
  }

  return (
    <div className="rich-text-field space-y-2">
      <label className="rich-text-field__label text-label-md font-bold uppercase tracking-wide text-on-surface-variant">{label}</label>
      <div className="rich-text-field__box overflow-hidden rounded-xl border border-outline-variant">
        <div className="rich-text-field__toolbar flex flex-wrap gap-1 border-b border-outline-variant bg-surface-container-low px-3 py-2">
          {hasControl("bold") ? <button type="button" onClick={() => insertMarkup("**")} className="rich-text-field__tool rounded-lg px-3 py-1 text-label-md font-bold hover:bg-surface-container-high" title="Negrita">B</button> : null}
          {hasControl("italic") ? <button type="button" onClick={() => insertMarkup("_")} className="rich-text-field__tool rounded-lg px-3 py-1 text-label-md italic hover:bg-surface-container-high" title="Cursiva">I</button> : null}
          {hasControl("underline") ? <button type="button" onClick={() => insertMarkup("<u>", "</u>")} className="rich-text-field__tool rounded-lg px-3 py-1 text-label-md underline hover:bg-surface-container-high" title="Subrayado">U</button> : null}
          {showSeparator("underline", "h2") || showSeparator("italic", "h2") ? <span className="rich-text-field__separator mx-1 w-px bg-outline-variant" /> : null}
          {hasControl("h2") ? <button type="button" onClick={() => insertMarkup("\n## ", "")} className="rich-text-field__tool rounded-lg px-3 py-1 text-label-md font-bold hover:bg-surface-container-high" title="Encabezado H2">H2</button> : null}
          {hasControl("h3") ? <button type="button" onClick={() => insertMarkup("\n### ", "")} className="rich-text-field__tool rounded-lg px-3 py-1 text-label-md font-bold hover:bg-surface-container-high" title="Encabezado H3">H3</button> : null}
          {showSeparator("h3", "ul") || showSeparator("italic", "ul") ? <span className="rich-text-field__separator mx-1 w-px bg-outline-variant" /> : null}
          {hasControl("ul") ? <button type="button" onClick={() => insertMarkup("\n- ", "")} className="rich-text-field__tool rounded-lg px-3 py-1 text-label-md hover:bg-surface-container-high" title="Lista">Lista</button> : null}
          {hasControl("ol") ? <button type="button" onClick={() => insertMarkup("\n1. ", "")} className="rich-text-field__tool rounded-lg px-3 py-1 text-label-md hover:bg-surface-container-high" title="Lista numerada">1.</button> : null}
          {showSeparator("ol", "link") || showSeparator("ul", "link") ? <span className="rich-text-field__separator mx-1 w-px bg-outline-variant" /> : null}
          {hasControl("link") ? <button type="button" onClick={() => insertMarkup("[texto](", ")")} className="rich-text-field__tool rounded-lg px-3 py-1 text-label-md hover:bg-surface-container-high" title="Enlace">Enlace</button> : null}
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
