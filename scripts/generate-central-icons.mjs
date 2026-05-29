import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

const CENTRAL_SOURCE = "https://centralicons.com/";
const OUTPUT_FILE = resolve("public/central-icons.json");

function decodeHtml(value) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&#x27;/g, "'")
    .replace(/&quot;/g, "\"")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ");
}

function sanitizeSvg(svg) {
  return svg
    .replace(/<script\b[\s\S]*?<\/script>/gi, "")
    .replace(/\s+on[a-z]+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, "")
    .replace(/javascript:/gi, "")
    .replace(/\s(width|height)="[^"]*"/gi, "")
    .replace("<svg", '<svg width="100%" height="100%"');
}

function parseCentralIcons(html) {
  const iconPattern =
    /(<button\b(?:(?!<\/button>)[\s\S])*<\/button>)\s*<div id="tooltip:[\s\S]*?<div[^>]*role="tooltip"[^>]*>([^<]+)<\/div>\s*<\/div>/g;
  const icons = new Map();
  let match;

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

async function fetchCentralIcons() {
  const upstream = await fetch(CENTRAL_SOURCE, {
    headers: {
      "user-agent": "icon-maker-build/0.1"
    }
  });

  if (!upstream.ok) {
    throw new Error(`图标源返回 ${upstream.status}`);
  }

  return parseCentralIcons(await upstream.text());
}

async function generate() {
  try {
    const payload = await fetchCentralIcons();
    await mkdir(dirname(OUTPUT_FILE), { recursive: true });
    await writeFile(OUTPUT_FILE, `${JSON.stringify(payload)}\n`, "utf8");
    console.log(
      `Generated ${OUTPUT_FILE} with ${payload.icons.length} icons and ${payload.categories.length} categories.`
    );
  } catch (error) {
    try {
      await readFile(OUTPUT_FILE, "utf8");
      console.warn(
        `Unable to refresh ${OUTPUT_FILE}; keeping the existing file. ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    } catch {
      throw error;
    }
  }
}

await generate();
