export type CentralIconPayload = {
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

export const CENTRAL_SOURCE = "https://centralicons.com/";

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

export function parseCentralIcons(html: string): CentralIconPayload {
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

export async function fetchCentralIcons(): Promise<CentralIconPayload> {
  const upstream = await fetch(CENTRAL_SOURCE, {
    headers: {
      "user-agent": "icon-maker/0.1"
    }
  });

  if (!upstream.ok) {
    throw new Error(`图标源返回 ${upstream.status}`);
  }

  return parseCentralIcons(await upstream.text());
}
