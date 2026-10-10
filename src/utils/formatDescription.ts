/**
 * formatDescription
 *
 * Converts a structured description (as stored in the database / cPanel)
 * into properly formatted HTML with clear visual hierarchy:
 *
 *   A. / B. / C. ...      -> Main section heading (bold, primary deep purple)
 *   i. / ii. / iii. ...   -> Sub-section heading (medium bold, indented, purple accent)
 *   1. / 2. / 3. ...      -> Numbered list items (indented, bold title before dash/colon)
 *   a. / b. / c. ...      -> Lowercase lettered list items (indented, lower-alpha)
 *   • / - / *             -> Bullet points (indented, disc)
 *   Short Title:          -> Inline title heading (bold, dark purple)
 *   Regular text          -> Clean readable paragraphs
 *
 * Handles both plain text (with newlines) and HTML with basic <p>/<br> tags.
 */

const ROMAN_RE = /^(i{1,3}|iv|vi{0,3}|ix|xi{0,3}|xiv|xv|xvi{0,3}|xix|xx)[\.\)]\s+/;
const ALPHA_SECTION_RE = /^[A-Z][\.\)]\s+/;
const NUMBERED_RE = /^\d+[\.\)]\s+/;
const LOWER_ALPHA_RE = /^[a-z][\.\)]\s+/;
const BULLET_RE = /^[\u2022\u25cf\u25cb\-\*]\s+/;

// If content contains advanced HTML elements (tables, iframes, styles), leave intact
const COMPLEX_HTML_RE = /<(table|thead|tbody|tr|td|th|iframe|svg|video|audio)[\s>]/i;

type ListType = "decimal" | "alpha" | "bullet" | null;

export function formatDescription(raw: string | null | undefined): string {
  if (!raw) return "";

  // If already complex rich-text from a WYSIWYG editor, return unchanged
  if (COMPLEX_HTML_RE.test(raw)) {
    return raw;
  }

  // Normalize incoming text (handle both plain text and basic <p>/<br>/&nbsp; tags)
  const normalized = raw
    .replace(/&nbsp;/g, " ")
    .replace(/\u00a0/g, " ")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|div|li|h[1-6])>/gi, "\n")
    .replace(/<[^>]+>/g, ""); // Strip any remaining basic HTML tags

  const lines = normalized.split(/\r?\n/);
  const parts: string[] = [];
  let currentList: ListType = null;

  const closeList = () => {
    if (currentList === "decimal" || currentList === "alpha") {
      parts.push("</ol>");
    } else if (currentList === "bullet") {
      parts.push("</ul>");
    }
    currentList = null;
  };

  for (const line of lines) {
    const trimmed = line.trim();

    // Empty line -> small spacer
    if (!trimmed) {
      closeList();
      parts.push('<div style="height:6px"></div>');
      continue;
    }

    // ── 1. A. / B. / C. -- Main Section Heading ──
    if (ALPHA_SECTION_RE.test(trimmed)) {
      const isFirst = parts.length === 0;
      closeList();
      parts.push(
        `<p style="font-weight:800;color:#200B3B;margin:${isFirst ? "0" : "16px"} 0 5px 0;font-size:0.95em;letter-spacing:0.01em;">${escapeHtml(
          trimmed
        )}</p>`
      );
      continue;
    }

    // ── 2. i. / ii. / iii. / iv. -- Sub-section Heading ──
    if (ROMAN_RE.test(trimmed)) {
      const isFirst = parts.length === 0;
      closeList();
      parts.push(
        `<p style="font-weight:700;color:#4B1E7A;margin:${isFirst ? "0" : "10px"} 0 4px 14px;font-size:0.89em;">${escapeHtml(
          trimmed
        )}</p>`
      );
      continue;
    }

    // ── 3. 1. / 2. / 3. -- Numbered List Item ──
    if (NUMBERED_RE.test(trimmed)) {
      if (currentList !== "decimal") {
        closeList();
        parts.push(
          `<ol style="margin:3px 0 5px 28px;padding-left:14px;list-style-type:decimal;">`
        );
        currentList = "decimal";
      }
      const itemContent = trimmed.replace(NUMBERED_RE, "");
      parts.push(
        `<li style="color:#374151;font-size:0.85em;line-height:1.65;margin-bottom:3px;">${formatItemContent(
          itemContent
        )}</li>`
      );
      continue;
    }

    // ── 4. a. / b. / c. -- Lettered Sub-list Item ──
    if (LOWER_ALPHA_RE.test(trimmed)) {
      if (currentList !== "alpha") {
        closeList();
        parts.push(
          `<ol style="margin:3px 0 5px 42px;padding-left:14px;list-style-type:lower-alpha;">`
        );
        currentList = "alpha";
      }
      const itemContent = trimmed.replace(LOWER_ALPHA_RE, "");
      parts.push(
        `<li style="color:#4B5563;font-size:0.84em;line-height:1.65;margin-bottom:3px;">${formatItemContent(
          itemContent
        )}</li>`
      );
      continue;
    }

    // ── 5. Bullet points (•, -, *) ──
    if (BULLET_RE.test(trimmed)) {
      if (currentList !== "bullet") {
        closeList();
        parts.push(
          `<ul style="margin:3px 0 5px 28px;padding-left:14px;list-style-type:disc;">`
        );
        currentList = "bullet";
      }
      const itemContent = trimmed.replace(BULLET_RE, "");
      parts.push(
        `<li style="color:#374151;font-size:0.85em;line-height:1.65;margin-bottom:3px;">${formatItemContent(
          itemContent
        )}</li>`
      );
      continue;
    }

    // ── 6. Short Title: -- Inline Section Title ──
    const beforeColon = trimmed.slice(0, -1);
    const isUrl = /^https?:\/\//i.test(trimmed);
    const hasSentencePunctuation = /[.!?,]/.test(beforeColon);

    if (
      trimmed.endsWith(":") &&
      trimmed.length <= 80 &&
      !hasSentencePunctuation &&
      !isUrl
    ) {
      const isFirst = parts.length === 0;
      closeList();
      parts.push(
        `<p style="font-weight:800;color:#2D1347;margin:${isFirst ? "0" : "14px"} 0 3px 0;font-size:0.9em;letter-spacing:0.01em;">${escapeHtml(
          trimmed
        )}</p>`
      );
      continue;
    }

    // ── 7. Regular paragraph text ──
    const isFirst = parts.length === 0;
    closeList();
    parts.push(
      `<p style="color:#4B5563;margin:${isFirst ? "0" : "5px"} 0 5px 0;font-size:0.875em;line-height:1.75;">${escapeHtml(
        trimmed
      )}</p>`
    );
  }

  closeList();
  return parts.join("");
}

/** Formats list item content, highlighting label before '–', '-', or ':' */
function formatItemContent(content: string): string {
  const sepMatch = content.match(/^([^–—\-\:]{2,50})\s*([–—\-]|:)\s+(.*)$/);
  if (sepMatch) {
    const [, label, sep, rest] = sepMatch;
    const sepDisplay = sep === ":" ? ": " : " – ";
    return `<strong style="font-weight:700;color:#1F2937;">${escapeHtml(
      label.trim()
    )}</strong>${sepDisplay}${escapeHtml(rest.trim())}`;
  }
  return escapeHtml(content);
}

/** Minimal HTML escaping for plain-text paths */
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
