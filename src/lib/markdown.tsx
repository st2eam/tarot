import React from "react";

function parseInline(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  const regex = /\*\*(.+?)\*\*/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    parts.push(
      <strong key={match.index} className="text-purple-200 font-semibold">
        {match[1]}
      </strong>
    );
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }
  return parts;
}

export function renderMarkdown(md: string): React.ReactNode[] {
  const lines = md.split("\n");
  const elements: React.ReactNode[] = [];
  let i = 0;
  let key = 0;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    // Empty line
    if (!trimmed) {
      elements.push(<div key={key++} className="h-2" />);
      i++;
      continue;
    }

    // Heading — accept #, ##, ### with or without trailing space
    if (trimmed.startsWith("### ") || trimmed === "###") {
      const text = trimmed.startsWith("### ") ? trimmed.slice(4) : "";
      elements.push(
        <h4 key={key++} className="text-sm font-semibold text-purple-300 mt-3 mb-1">
          {text ? parseInline(text) : " "}
        </h4>
      );
      i++;
      continue;
    }
    if (trimmed.startsWith("## ") || trimmed === "##") {
      const text = trimmed.startsWith("## ") ? trimmed.slice(3) : "";
      elements.push(
        <h3 key={key++} className="text-sm font-semibold text-purple-200 mt-4 mb-1.5">
          {text ? parseInline(text) : " "}
        </h3>
      );
      i++;
      continue;
    }
    if (trimmed.startsWith("# ") || trimmed === "#") {
      const text = trimmed.startsWith("# ") ? trimmed.slice(2) : "";
      elements.push(
        <h2 key={key++} className="text-base font-bold text-purple-100 mt-5 mb-2 pb-1.5 border-b border-purple-800/30">
          {text ? parseInline(text) : " "}
        </h2>
      );
      i++;
      continue;
    }

    // Blockquote
    if (trimmed.startsWith("> ")) {
      const quoteLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith("> ")) {
        quoteLines.push(lines[i].trim().slice(2));
        i++;
      }
      elements.push(
        <blockquote
          key={key++}
          className="border-l-2 border-purple-600/40 pl-3 my-2 text-zinc-400 italic text-xs"
        >
          {quoteLines.map((ql, qi) => (
            <p key={qi}>{parseInline(ql)}</p>
          ))}
        </blockquote>
      );
      continue;
    }

    // Unordered list
    if (/^[\s]*[-*]\s/.test(trimmed)) {
      const listItems: string[] = [];
      while (i < lines.length && /^[\s]*[-*]\s/.test(lines[i].trim())) {
        listItems.push(lines[i].trim().replace(/^[\s]*[-*]\s/, ""));
        i++;
      }
      elements.push(
        <ul key={key++} className="space-y-1 my-2">
          {listItems.map((item, li) => (
            <li key={li} className="flex items-start gap-2 text-zinc-200 text-sm">
              <span className="text-purple-500 mt-0.5 shrink-0">•</span>
              <span>{parseInline(item)}</span>
            </li>
          ))}
        </ul>
      );
      continue;
    }

    // Numbered list
    if (/^\d+\.\s/.test(trimmed)) {
      const listItems: string[] = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i].trim())) {
        listItems.push(lines[i].trim().replace(/^\d+\.\s/, ""));
        i++;
      }
      elements.push(
        <ol key={key++} className="space-y-1 my-2 list-decimal list-inside">
          {listItems.map((item, li) => (
            <li key={li} className="text-zinc-200 text-sm marker:text-purple-400">
              {parseInline(item)}
            </li>
          ))}
        </ol>
      );
      continue;
    }

    // Horizontal rule
    if (/^[-*_]{3,}$/.test(trimmed)) {
      elements.push(
        <hr key={key++} className="border-purple-800/30 my-3" />
      );
      i++;
      continue;
    }

    // Regular paragraph — collect consecutive non-special lines
    const paraLines: string[] = [];
    while (i < lines.length) {
      const t = lines[i].trim();
      if (
        !t ||
        t.startsWith("#") ||
        t.startsWith("> ") ||
        /^[\s]*[-*]\s/.test(t) ||
        /^\d+\.\s/.test(t) ||
        /^[-*_]{3,}$/.test(t)
      ) {
        break;
      }
      paraLines.push(lines[i]);
      i++;
    }

    if (paraLines.length > 0) {
      elements.push(
        <p key={key++} className="text-zinc-200 text-sm leading-relaxed">
          {parseInline(paraLines.join(" "))}
        </p>
      );
    } else {
      // Safety: unrecognized line — render as-is and advance
      elements.push(
        <p key={key++} className="text-zinc-200 text-sm leading-relaxed">
          {parseInline(trimmed)}
        </p>
      );
      i++;
    }
  }

  return elements;
}
