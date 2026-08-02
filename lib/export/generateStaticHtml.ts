import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import type { PageSchema } from "@/lib/schema/page";
import { PageRenderer } from "@/components/PageRenderer";

export function generateStaticHtml(schema: PageSchema): string {
  const { meta } = schema;

  // Render static HTML string for the page components
  const bodyMarkup = renderToStaticMarkup(
    React.createElement(PageRenderer, { schema, isEditable: false })
  );

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(meta.title || "Landing Page")}</title>
  <meta name="description" content="${escapeHtml(meta.description || "")}">
  
  <!-- OpenGraph -->
  <meta property="og:title" content="${escapeHtml(meta.title || "")}">
  <meta property="og:description" content="${escapeHtml(meta.description || "")}">
  ${meta.ogImageUrl ? `<meta property="og:image" content="${escapeHtml(meta.ogImageUrl)}">` : ""}

  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>

  <!-- Google Fonts Inter -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">

  <style>
    body {
      font-family: 'Inter', sans-serif;
      margin: 0;
      padding: 0;
      -webkit-font-smoothing: antialiased;
    }
  </style>
</head>
<body>
  ${bodyMarkup}
</body>
</html>`;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
