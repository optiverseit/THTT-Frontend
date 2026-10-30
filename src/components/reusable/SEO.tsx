import React, { useEffect } from "react";

export interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  canonicalPath?: string;
  image?: string;
  type?: "website" | "article";
  schema?: Record<string, any>;
}

const SITE_URL = "https://triphimalaya.com.np";
const DEFAULT_IMAGE = "https://triphimalaya.com.np/Logo.png";

/**
 * Reusable SEO Component for Mid-Level & High-Intent Search Ranking.
 * Synchronizes document.title, standard meta tags, OpenGraph, Twitter Cards,
 * canonical links, and page-specific Schema.org JSON-LD structured data.
 */
const SEO: React.FC<SEOProps> = ({
  title,
  description,
  keywords,
  canonicalPath = "",
  image = DEFAULT_IMAGE,
  type = "website",
  schema,
}) => {
  const fullCanonicalUrl = canonicalPath
    ? `${SITE_URL}${canonicalPath.startsWith("/") ? canonicalPath : `/${canonicalPath}`}`
    : SITE_URL;

  const fullImageUrl = image.startsWith("http")
    ? image
    : `${SITE_URL}${image.startsWith("/") ? image : `/${image}`}`;

  useEffect(() => {
    // 1. Update Document Title
    document.title = title;

    // Helper: update or create meta tag
    const setMeta = (attrName: "name" | "property", attrVal: string, content: string) => {
      if (!content) return;
      let el = document.querySelector(`meta[${attrName}="${attrVal}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attrName, attrVal);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    // 2. Standard Search Meta Tags
    setMeta("name", "description", description);
    if (keywords) {
      setMeta("name", "keywords", keywords);
    }

    // 3. Open Graph (Facebook, WhatsApp, LinkedIn, etc.)
    setMeta("property", "og:title", title);
    setMeta("property", "og:description", description);
    setMeta("property", "og:image", fullImageUrl);
    setMeta("property", "og:url", fullCanonicalUrl);
    setMeta("property", "og:type", type);
    setMeta("property", "og:site_name", "Trip Himalaya");

    // 4. Twitter / X Cards
    setMeta("name", "twitter:title", title);
    setMeta("name", "twitter:description", description);
    setMeta("name", "twitter:image", fullImageUrl);

    // 5. Canonical Link Tag
    let canonicalTag = document.querySelector('link[rel="canonical"]');
    if (!canonicalTag) {
      canonicalTag = document.createElement("link");
      canonicalTag.setAttribute("rel", "canonical");
      document.head.appendChild(canonicalTag);
    }
    canonicalTag.setAttribute("href", fullCanonicalUrl);

    // 6. Page-Specific Schema.org JSON-LD
    const schemaScriptId = "page-specific-jsonld";
    let scriptTag = document.getElementById(schemaScriptId) as HTMLScriptElement | null;
    if (schema) {
      if (!scriptTag) {
        scriptTag = document.createElement("script");
        scriptTag.id = schemaScriptId;
        scriptTag.type = "application/ld+json";
        document.head.appendChild(scriptTag);
      }
      scriptTag.textContent = JSON.stringify(schema);
    } else if (scriptTag) {
      scriptTag.remove();
    }
  }, [title, description, keywords, fullCanonicalUrl, fullImageUrl, type, schema]);

  // React 19 native head element hoisting support
  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={fullCanonicalUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImageUrl} />
      <meta property="og:url" content={fullCanonicalUrl} />
      <meta property="og:type" content={type} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImageUrl} />
      {schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      )}
    </>
  );
};

export default SEO;
