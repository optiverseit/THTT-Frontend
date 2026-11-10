/**
 * formatDescription
 *
 * Converts a structured description (as stored in the database / cPanel)
 * into properly formatted HTML with clear visual hierarchy:
 *
 *   # / <h1>              -> Heading 1 (24px, 800 bold, deep purple #200B3B)
 *   ## / <h2>             -> Heading 2 (20px, 700 bold, deep purple #2D1347)
 *   ### / <h3>            -> Heading 3 (18px, 700 bold, dark purple #3B1A66)
 *   #### / <h4>           -> Heading 4 (16px, 700 bold, medium purple #4B1E7A)
 *   ##### / <h5>          -> Heading 5 (14.5px, 600 semi-bold, violet #5B21B6)
 *   ###### / <h6>         -> Heading 6 (13px, 600 uppercase, tracking wide #6B7280)
 *   A. / B. / C. ...      -> Main section heading (bold, primary deep purple)
 *   i. / ii. / iii. ...   -> Sub-section heading (medium bold, indented, purple accent)
 *   1. / 2. / 3. ...      -> Numbered list items (indented, bold title before dash/colon)
 *   a. / b. / c. ...      -> Lowercase lettered list items (indented, lower-alpha)
 *   • / - / *             -> Bullet points (indented, disc)
 *   Short Title:          -> Inline title heading (bold, dark purple)
 *   Regular text          -> Clean readable paragraphs
 *
 * Handles Markdown (# to ######), HTML tags (<h1> to <h6>, <p>, <br>), and plain text.
 */

const ROMAN_RE = /^(i{1,3}|iv|vi{0,3}|ix|xi{0,3}|xiv|xv|xvi{0,3}|xix|xx)[\.\)]\s+/i;
const ALPHA_SECTION_RE = /^[A-Z][\.\)](\s+|(?=[A-Za-z]))/;
const NUMBERED_RE = /^\d+[\.\)](\s+|(?=[A-Za-z]))/;
const LOWER_ALPHA_RE = /^[a-z][\.\)](\s+|(?=[A-Za-z]))/;
const BULLET_RE = /^([\u2022\u25cf\u25cb\+]|-|\*(?!\*))\s*/;

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
    .replace(/<h1[^>]*>(.*?)<\/h1>/gi, "\n# $1\n")
    .replace(/<h2[^>]*>(.*?)<\/h2>/gi, "\n## $1\n")
    .replace(/<h3[^>]*>(.*?)<\/h3>/gi, "\n### $1\n")
    .replace(/<h4[^>]*>(.*?)<\/h4>/gi, "\n#### $1\n")
    .replace(/<h5[^>]*>(.*?)<\/h5>/gi, "\n##### $1\n")
    .replace(/<h6[^>]*>(.*?)<\/h6>/gi, "\n###### $1\n")
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

    // ── Headings: # (h1), ## (h2), ### (h3), #### (h4), ##### (h5), ###### (h6) ──
    // Supports markdown with space ('### Title') and without space ('###Title' / '######About Qatar Permit:')
    const hMatch = trimmed.match(/^(#{1,})\s*(.+)$/);
    if (hMatch) {
      const level = Math.min(6, hMatch[1].length);
      // Avoid false positive on "#1 ..." when there is no space and it is a rank/number (e.g. "#1 Tour Operator")
      if (!(level === 1 && !/^\s/.test(trimmed.slice(1)) && /^\d/.test(hMatch[2]))) {
        const headingText = hMatch[2].trim();
        const isFirst = parts.length === 0;
        closeList();

        const headingConfigs: Record<number, { tag: string; style: string }> = {
          1: {
            tag: "h1",
            style: `font-weight:800;color:#200B3B;margin:${isFirst ? "0" : "18px"} 0 8px 0;font-size:1.35em;line-height:1.3;letter-spacing:-0.01em;`,
          },
          2: {
            tag: "h2",
            style: `font-weight:700;color:#2D1347;margin:${isFirst ? "0" : "16px"} 0 6px 0;font-size:1.2em;line-height:1.35;`,
          },
          3: {
            tag: "h3",
            style: `font-weight:700;color:#3B1A66;margin:${isFirst ? "0" : "14px"} 0 5px 0;font-size:1.08em;line-height:1.4;`,
          },
          4: {
            tag: "h4",
            style: `font-weight:700;color:#4B1E7A;margin:${isFirst ? "0" : "12px"} 0 4px 0;font-size:0.98em;line-height:1.45;`,
          },
          5: {
            tag: "h5",
            style: `font-weight:600;color:#5B21B6;margin:${isFirst ? "0" : "10px"} 0 3px 0;font-size:0.9em;line-height:1.45;`,
          },
          6: {
            tag: "h6",
            style: `font-weight:600;color:#6B7280;margin:${isFirst ? "0" : "8px"} 0 2px 0;font-size:0.82em;text-transform:uppercase;letter-spacing:0.05em;line-height:1.4;`,
          },
        };

        const hConf = headingConfigs[level] || headingConfigs[2];
        parts.push(
          `<${hConf.tag} style="${hConf.style}">${parseInlineFormatting(
            headingText
          )}</${hConf.tag}>`
        );
        continue;
      }
    }

    // ── 1. A. / B. / C. -- Main Section Heading ──
    if (ALPHA_SECTION_RE.test(trimmed)) {
      const isFirst = parts.length === 0;
      closeList();
      parts.push(
        `<p style="font-weight:800;color:#200B3B;margin:${isFirst ? "0" : "16px"} 0 5px 0;font-size:0.95em;letter-spacing:0.01em;">${parseInlineFormatting(
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
        `<p style="font-weight:700;color:#4B1E7A;margin:${isFirst ? "0" : "10px"} 0 4px 14px;font-size:0.89em;">${parseInlineFormatting(
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
      trimmed.length <= 130 &&
      !hasSentencePunctuation &&
      !isUrl
    ) {
      const isFirst = parts.length === 0;
      closeList();
      parts.push(
        `<p style="font-weight:800;color:#2D1347;margin:${isFirst ? "0" : "14px"} 0 3px 0;font-size:0.9em;letter-spacing:0.01em;">${parseInlineFormatting(
          trimmed
        )}</p>`
      );
      continue;
    }

    // ── 7. Regular paragraph text ──

    const isFirst = parts.length === 0;

    closeList();
    parts.push(
      `<p style="color:#4B5563;margin:${isFirst ? "0" : "5px"} 0 5px 0;font-size:0.875em;line-height:1.75;">${parseInlineFormatting(
        trimmed
      )}</p>`
    );
  }

  closeList();
  return parts.join("");
}

/** Formats list item content, highlighting label before '–', '-', or ':' and supporting **bold** */
function formatItemContent(content: string): string {
  const sepMatch = content.match(/^([^–—\-\:]{2,50})\s*([–—\-]|:)\s+(.*)$/);
  if (sepMatch) {
    const [, label, sep, rest] = sepMatch;
    const sepDisplay = sep === ":" ? ": " : " – ";
    return `<strong style="font-weight:700;color:#1F2937;">${escapeHtml(
      label.trim()
    )}</strong>${sepDisplay}${parseInlineFormatting(rest.trim())}`;
  }
  return parseInlineFormatting(content);
}

/** Parses inline styling such as **bold** and escapes HTML safely */
function parseInlineFormatting(str: string): string {
  const escaped = escapeHtml(str);
  // Support **bold** and __bold__ syntax anywhere in text
  return escaped
    .replace(/\*\*(.+?)\*\*/g, '<strong style="font-weight:700;color:#1F2937;">$1</strong>')
    .replace(/__(.+?)__/g, '<strong style="font-weight:700;color:#1F2937;">$1</strong>');
}

/** Minimal HTML escaping for plain-text paths */
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}


export const hasCustomBullet = (text: string | null | undefined): boolean => {
  if (!text) return false;
  const clean = text.replace(/<[^>]+>/g, "").trim();
  return /^(\p{Extended_Pictographic}|\p{Emoji}|[•\-\*\u2700-\u27BF\uE000-\uF8FF])/u.test(clean);
};

export const splitInclusions = (text?: string | null): string[] => {
  if (!text) return [];
  const normalized = text
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|div|li)>/gi, "\n")
    .replace(/<[^>]+>/g, "");
  return normalized
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean);
};

/**
 * stripDescription
 * Converts rich description text into clean, unformatted plain text
 * suitable for preview cards with line-clamp, removing markdown artifacts,
 * HTML tags, and optionally redundant leading titles.
 */
export function stripDescription(raw?: string | null, titleToRemove?: string): string {
  if (!raw) return "";
  let clean = raw
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\u00a0/g, " ")
    .replace(/^[A-Z][\.\)]\s*/gm, "")
    .replace(/^[iIvVxX]+[\.\)]\s*/gm, "")
    .replace(/^#+\s*/gm, "")
    .replace(/\*\*/g, "")
    .replace(/[\r\n]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (titleToRemove) {
    const t = titleToRemove.trim().toLowerCase();
    if (clean.toLowerCase().startsWith(t)) {
      clean = clean.slice(titleToRemove.trim().length).replace(/^[:\-\s]+/, "").trim();
    }
  }

  return clean;
}
