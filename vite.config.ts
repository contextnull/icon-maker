import type { IncomingMessage, ServerResponse } from "node:http";
import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";

type CentralIconPayload = {
  icons: Array<{
    id: string;
    name: string;
    category: string;
    aliases: string[];
    svg: string;
  }>;
  categories: string[];
  updatedAt: string;
  source: string;
};

const CENTRAL_SOURCE = "https://centralicons.com/";

function decodeHtml(value: string) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&#x27;/g, "'")
    .replace(/&quot;/g, "\"")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ");
}

function sanitizeSvg(svg: string) {
  return svg
    .replace(/<script\b[\s\S]*?<\/script>/gi, "")
    .replace(/\s+on[a-z]+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, "")
    .replace(/javascript:/gi, "")
    .replace(/\s(width|height)="[^"]*"/gi, "")
    .replace("<svg", '<svg width="100%" height="100%"');
}

function parseCentralIcons(html: string): CentralIconPayload {
  const iconPattern =
    /(<button\b(?:(?!<\/button>)[\s\S])*<\/button>)\s*<div id="tooltip:[\s\S]*?<div[^>]*role="tooltip"[^>]*>([^<]+)<\/div>\s*<\/div>/g;
  const icons = new Map<string, CentralIconPayload["icons"][number]>();
  let match: RegExpExecArray | null;

  while ((match = iconPattern.exec(html))) {
    const buttonHtml = match[1];
    const tooltip = decodeHtml(match[2]).trim();
    const category = tooltip.match(/\(([^()]*)\)\s*$/)?.[1]?.trim() ?? "Other";
    const label = tooltip.replace(/\s*\([^()]*\)\s*$/, "");
    const [rawName, ...rawAliases] = label.split(",");
    const name = rawName.trim();
    const svg = buttonHtml.match(/<svg\b[\s\S]*<\/svg>/)?.[0];

    if (!name || !svg || icons.has(name)) {
      continue;
    }

    icons.set(name, {
      id: `${category}:${name}`,
      name,
      category,
      aliases: rawAliases.map((alias) => alias.trim()).filter(Boolean),
      svg: sanitizeSvg(svg)
    });
  }

  const iconList = [...icons.values()];
  const categories = [...new Set(iconList.map((icon) => icon.category))].sort((a, b) =>
    a.localeCompare(b)
  );

  return {
    icons: iconList,
    categories,
    updatedAt: new Date().toISOString(),
    source: CENTRAL_SOURCE
  };
}

function sendJson(response: ServerResponse<IncomingMessage>, status: number, data: unknown) {
  response.statusCode = status;
  response.setHeader("content-type", "application/json; charset=utf-8");
  response.end(JSON.stringify(data));
}

function centralIconsPlugin(): Plugin {
  let cached: CentralIconPayload | null = null;

  async function handleCentralIcons(
    _request: IncomingMessage,
    response: ServerResponse<IncomingMessage>
  ) {
    try {
      if (!cached) {
        const upstream = await fetch(CENTRAL_SOURCE, {
          headers: {
            "user-agent": "icon-maker-local/0.1"
          }
        });

        if (!upstream.ok) {
          throw new Error(`图标源返回 ${upstream.status}`);
        }

        cached = parseCentralIcons(await upstream.text());
      }

      sendJson(response, 200, cached);
    } catch (error) {
      sendJson(response, 502, {
        error: error instanceof Error ? error.message : "Failed to load icons"
      });
    }
  }

  return {
    name: "central-icons-api",
    configureServer(server) {
      server.middlewares.use("/api/central-icons", handleCentralIcons);
    },
    configurePreviewServer(server) {
      server.middlewares.use("/api/central-icons", handleCentralIcons);
    }
  };
}

export default defineConfig({
  plugins: [react(), centralIconsPlugin()],
  server: {
    port: 5173,
    host: "127.0.0.1"
  }
});
