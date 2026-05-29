import {
  Check,
  Circle,
  CornerUpLeft,
  Copy,
  Download,
  Loader2,
  MoreHorizontal,
  Palette,
  RefreshCw,
  Search,
  SlidersHorizontal,
  Sparkles,
  ToggleLeft,
  X
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type CentralIcon = {
  id: string;
  name: string;
  category: string;
  aliases: string[];
  svg: string;
};

type IconsResponse = {
  icons: CentralIcon[];
  categories: string[];
  updatedAt: string;
  source: string;
};

type IconStyle = "line" | "fill";
type StrokeWidth = "1px" | "1.5px" | "2px";
type CornerStyle = "0px sharp" | "0px round" | "1px small" | "2px medium" | "3px large";
type ExportScale = 0.1 | 0.2 | 0.5 | 1;

type IconParams = {
  style: IconStyle;
  strokeWidth: StrokeWidth;
  corner: CornerStyle;
};

type ColorKit = {
  name: string;
  source: string;
  backgroundColor: string;
  background: string;
  icon: string;
};

const iconStyleOptions: Array<{ label: string; value: IconStyle }> = [
  { label: "line", value: "line" },
  { label: "fill", value: "fill" }
];

const strokeOptions: Array<{ label: string; value: StrokeWidth }> = [
  { label: "1px", value: "1px" },
  { label: "1.5px", value: "1.5px" },
  { label: "2px", value: "2px" }
];

const cornerOptions: Array<{ label: string; value: CornerStyle }> = [
  { label: "sharp", value: "0px sharp" },
  { label: "round", value: "0px round" },
  { label: "small", value: "1px small" },
  { label: "medium", value: "2px medium" },
  { label: "large", value: "3px large" }
];

const exportScaleOptions: Array<{ label: string; value: ExportScale }> = [
  { label: "0.1x", value: 0.1 },
  { label: "0.2x", value: 0.2 },
  { label: "0.5x", value: 0.5 },
  { label: "1.0x", value: 1 }
];

const backgroundSwatches = [
  "#ffffff",
  "#f7f7f5",
  "#efefec",
  "#f3ede3",
  "#e9f4ee",
  "#eaf0ff",
  "#fff2cc",
  "#ffe8e0",
  "#eef1f2"
];

const gradientPresets = [
  {
    name: "Paper",
    value: "linear-gradient(135deg, #ffffff 0%, #f4f1eb 100%)"
  },
  {
    name: "Mint",
    value: "linear-gradient(135deg, #eef8f1 0%, #dceee8 100%)"
  },
  {
    name: "Sky",
    value: "linear-gradient(135deg, #f5f8ff 0%, #dfe9ff 100%)"
  },
  {
    name: "Lemon",
    value: "linear-gradient(135deg, #fff9df 0%, #f5e8b8 100%)"
  },
  {
    name: "Peach",
    value: "linear-gradient(135deg, #fff1e9 0%, #f8d8ca 100%)"
  },
  {
    name: "Lavender",
    value: "linear-gradient(135deg, #f7f2ff 0%, #e7dcff 100%)"
  },
  {
    name: "Pearl",
    value: "linear-gradient(135deg, #ffffff 0%, #e8e8e4 100%)"
  },
  {
    name: "Slate",
    value: "linear-gradient(135deg, #eef1f2 0%, #d9dee1 100%)"
  }
];

const lightColorKits: ColorKit[] = [
  {
    name: "Paper",
    source: "Neutral",
    backgroundColor: "#ffffff",
    background: "linear-gradient(135deg, #ffffff 0%, #f1f0ec 100%)",
    icon: "#5f5e59"
  },
  {
    name: "Mist",
    source: "Neutral",
    backgroundColor: "#f7f7f5",
    background: "linear-gradient(135deg, #fbfbfa 0%, #e8e8e3 100%)",
    icon: "#686761"
  },
  {
    name: "Cloud",
    source: "Radix",
    backgroundColor: "#f0f2f1",
    background: "linear-gradient(135deg, #f8faf9 0%, #dfe4e1 100%)",
    icon: "#65736b"
  },
  {
    name: "Porcelain",
    source: "Tailwind",
    backgroundColor: "#f8fafc",
    background: "linear-gradient(135deg, #ffffff 0%, #e5e7eb 100%)",
    icon: "#64748b"
  },
  {
    name: "Stone",
    source: "Tailwind",
    backgroundColor: "#fafaf9",
    background: "linear-gradient(135deg, #fafaf9 0%, #e7e5e4 100%)",
    icon: "#78716c"
  },
  {
    name: "Linen",
    source: "Open Color",
    backgroundColor: "#fff9f0",
    background: "linear-gradient(135deg, #fffaf2 0%, #efe3d2 100%)",
    icon: "#8a7761"
  },
  {
    name: "Sage",
    source: "Open Color",
    backgroundColor: "#f3faf5",
    background: "linear-gradient(135deg, #f7fbf8 0%, #dfeee5 100%)",
    icon: "#5f776a"
  },
  {
    name: "Fog",
    source: "Open Color",
    backgroundColor: "#f5f8ff",
    background: "linear-gradient(135deg, #fbfdff 0%, #dde7f5 100%)",
    icon: "#617287"
  },
  {
    name: "XHS Red",
    source: "Xiaohongshu",
    backgroundColor: "#fff5f6",
    background: "linear-gradient(135deg, #fffafa 0%, #ffe5e9 100%)",
    icon: "#FF2442"
  },
  {
    name: "Dots Green",
    source: "Dots",
    backgroundColor: "#f4fffc",
    background: "linear-gradient(135deg, #fbfffd 0%, #dff8f2 100%)",
    icon: "#6FD2BD"
  }
];

const moreColorKits: ColorKit[] = [
  {
    name: "Coral Reef",
    source: "Color Hunt",
    backgroundColor: "#fff1ed",
    background: "linear-gradient(135deg, #fff7f3 0%, #ffd6cc 100%)",
    icon: "#e85d75"
  },
  {
    name: "Apricot Ink",
    source: "Coolors",
    backgroundColor: "#fff3e8",
    background: "linear-gradient(135deg, #fffaf4 0%, #ffd8b5 100%)",
    icon: "#d97706"
  },
  {
    name: "Butter Blue",
    source: "Tailwind",
    backgroundColor: "#fffbeb",
    background: "linear-gradient(135deg, #fffceb 0%, #fde68a 100%)",
    icon: "#2563eb"
  },
  {
    name: "Honey Sage",
    source: "Coolors",
    backgroundColor: "#fef7cd",
    background: "linear-gradient(135deg, #fff8db 0%, #e9edc9 100%)",
    icon: "#60794d"
  },
  {
    name: "Matcha Mint",
    source: "Open Color",
    backgroundColor: "#f1f8e9",
    background: "linear-gradient(135deg, #fbfff4 0%, #dbeec6 100%)",
    icon: "#4f772d"
  },
  {
    name: "Seafoam",
    source: "Radix",
    backgroundColor: "#ecfdf5",
    background: "linear-gradient(135deg, #f7fffb 0%, #ccfbf1 100%)",
    icon: "#0f766e"
  },
  {
    name: "Lagoon",
    source: "Tailwind",
    backgroundColor: "#ecfeff",
    background: "linear-gradient(135deg, #f5feff 0%, #cffafe 100%)",
    icon: "#0891b2"
  },
  {
    name: "Aqua Night",
    source: "Coolors",
    backgroundColor: "#effdff",
    background: "linear-gradient(135deg, #f8ffff 0%, #ccfbf1 100%)",
    icon: "#155e75"
  },
  {
    name: "Ice Blue",
    source: "Tailwind",
    backgroundColor: "#eff6ff",
    background: "linear-gradient(135deg, #fbfdff 0%, #dbeafe 100%)",
    icon: "#2563eb"
  },
  {
    name: "Periwinkle",
    source: "Color Hunt",
    backgroundColor: "#eef2ff",
    background: "linear-gradient(135deg, #f8faff 0%, #c7d2fe 100%)",
    icon: "#4f46e5"
  },
  {
    name: "Iris Fog",
    source: "Radix",
    backgroundColor: "#f5f3ff",
    background: "linear-gradient(135deg, #fbfaff 0%, #ddd6fe 100%)",
    icon: "#5b5bd6"
  },
  {
    name: "Lilac Ink",
    source: "Coolors",
    backgroundColor: "#faf5ff",
    background: "linear-gradient(135deg, #fdfaff 0%, #e9d5ff 100%)",
    icon: "#7e22ce"
  },
  {
    name: "Orchid",
    source: "Radix",
    backgroundColor: "#fdf4ff",
    background: "linear-gradient(135deg, #fff7ff 0%, #f5d0fe 100%)",
    icon: "#a21caf"
  },
  {
    name: "Rose Milk",
    source: "Tailwind",
    backgroundColor: "#fff1f2",
    background: "linear-gradient(135deg, #fffafa 0%, #ffe4e6 100%)",
    icon: "#e11d48"
  },
  {
    name: "Berry Cream",
    source: "Color Hunt",
    backgroundColor: "#fdf2f8",
    background: "linear-gradient(135deg, #fff7fb 0%, #fbcfe8 100%)",
    icon: "#be185d"
  },
  {
    name: "Cherry Soda",
    source: "Coolors",
    backgroundColor: "#fff1f2",
    background: "linear-gradient(135deg, #fff7f8 0%, #fecdd3 100%)",
    icon: "#dc2626"
  },
  {
    name: "Tomato Blush",
    source: "Radix",
    backgroundColor: "#fff4f0",
    background: "linear-gradient(135deg, #fff8f4 0%, #ffd8cc 100%)",
    icon: "#c2410c"
  },
  {
    name: "Sunset Peach",
    source: "Coolors",
    backgroundColor: "#fff7ed",
    background: "linear-gradient(135deg, #fffaf4 0%, #fed7aa 100%)",
    icon: "#ea580c"
  },
  {
    name: "Mango",
    source: "Color Hunt",
    backgroundColor: "#fffbeb",
    background: "linear-gradient(135deg, #fff8db 0%, #fef3c7 100%)",
    icon: "#d97706"
  },
  {
    name: "Amber Clay",
    source: "Radix",
    backgroundColor: "#fef3c7",
    background: "linear-gradient(135deg, #fff8e1 0%, #fde68a 100%)",
    icon: "#92400e"
  },
  {
    name: "Olive Grove",
    source: "Open Color",
    backgroundColor: "#f7f8ea",
    background: "linear-gradient(135deg, #fefff4 0%, #e9edc9 100%)",
    icon: "#556b2f"
  },
  {
    name: "Moss Linen",
    source: "Coolors",
    backgroundColor: "#f4f7ed",
    background: "linear-gradient(135deg, #fcfff6 0%, #dfe8cf 100%)",
    icon: "#4d6b4a"
  },
  {
    name: "Pine Mist",
    source: "Open Color",
    backgroundColor: "#edf7f2",
    background: "linear-gradient(135deg, #f8fffb 0%, #d8eee2 100%)",
    icon: "#166534"
  },
  {
    name: "Jade",
    source: "Radix",
    backgroundColor: "#ecfdf3",
    background: "linear-gradient(135deg, #fbfffd 0%, #bbf7d0 100%)",
    icon: "#15803d"
  },
  {
    name: "Emerald Frost",
    source: "Tailwind",
    backgroundColor: "#ecfdf5",
    background: "linear-gradient(135deg, #f8fffb 0%, #d1fae5 100%)",
    icon: "#047857"
  },
  {
    name: "Mint Chocolate",
    source: "Color Hunt",
    backgroundColor: "#f2fff8",
    background: "linear-gradient(135deg, #fbfffd 0%, #d9f99d 100%)",
    icon: "#3f6212"
  },
  {
    name: "Turquoise",
    source: "Coolors",
    backgroundColor: "#effdfb",
    background: "linear-gradient(135deg, #f8fffe 0%, #99f6e4 100%)",
    icon: "#0f766e"
  },
  {
    name: "Cyan Cloud",
    source: "Tailwind",
    backgroundColor: "#ecfeff",
    background: "linear-gradient(135deg, #f8ffff 0%, #bae6fd 100%)",
    icon: "#0284c7"
  },
  {
    name: "Denim",
    source: "Color Hunt",
    backgroundColor: "#eff6ff",
    background: "linear-gradient(135deg, #fbfdff 0%, #bfdbfe 100%)",
    icon: "#1d4ed8"
  },
  {
    name: "Navy Porcelain",
    source: "Tailwind",
    backgroundColor: "#f8fafc",
    background: "linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%)",
    icon: "#334155"
  },
  {
    name: "Slate Lavender",
    source: "Tailwind",
    backgroundColor: "#f8fafc",
    background: "linear-gradient(135deg, #ffffff 0%, #e0e7ff 100%)",
    icon: "#475569"
  },
  {
    name: "Grape Soda",
    source: "Color Hunt",
    backgroundColor: "#f5f3ff",
    background: "linear-gradient(135deg, #fbfaff 0%, #c4b5fd 100%)",
    icon: "#6d28d9"
  },
  {
    name: "Plum Silk",
    source: "Radix",
    backgroundColor: "#faf5ff",
    background: "linear-gradient(135deg, #fffaff 0%, #e9d5ff 100%)",
    icon: "#86198f"
  },
  {
    name: "Mauve",
    source: "Radix",
    backgroundColor: "#faf5f9",
    background: "linear-gradient(135deg, #fffafd 0%, #f3d9e7 100%)",
    icon: "#8b5f7b"
  },
  {
    name: "Dusty Rose",
    source: "Coolors",
    backgroundColor: "#fff1f2",
    background: "linear-gradient(135deg, #fff8f8 0%, #fecdd3 100%)",
    icon: "#9f6272"
  },
  {
    name: "Cocoa",
    source: "Coolors",
    backgroundColor: "#fdf8f2",
    background: "linear-gradient(135deg, #fffaf5 0%, #ead7c5 100%)",
    icon: "#7c5c4a"
  },
  {
    name: "Taupe",
    source: "Radix",
    backgroundColor: "#f7f3ef",
    background: "linear-gradient(135deg, #fffaf7 0%, #e8ded5 100%)",
    icon: "#70645c"
  },
  {
    name: "Sandstone",
    source: "Open Color",
    backgroundColor: "#fffbeb",
    background: "linear-gradient(135deg, #fffaf0 0%, #f3e6c2 100%)",
    icon: "#8a6f3d"
  },
  {
    name: "Clay",
    source: "Color Hunt",
    backgroundColor: "#fff4ed",
    background: "linear-gradient(135deg, #fff8f3 0%, #fed7aa 100%)",
    icon: "#9a5436"
  },
  {
    name: "Terracotta",
    source: "Coolors",
    backgroundColor: "#fff1ed",
    background: "linear-gradient(135deg, #fff7f3 0%, #fecaca 100%)",
    icon: "#b45309"
  },
  {
    name: "Copper",
    source: "Open Color",
    backgroundColor: "#fff7ed",
    background: "linear-gradient(135deg, #fffaf4 0%, #fdba74 100%)",
    icon: "#9a3412"
  },
  {
    name: "Marigold",
    source: "Color Hunt",
    backgroundColor: "#fffbeb",
    background: "linear-gradient(135deg, #fffbe8 0%, #fde68a 100%)",
    icon: "#b45309"
  },
  {
    name: "Lemon Lime",
    source: "Coolors",
    backgroundColor: "#fefce8",
    background: "linear-gradient(135deg, #fffff5 0%, #d9f99d 100%)",
    icon: "#65a30d"
  },
  {
    name: "Pistachio",
    source: "Coolors",
    backgroundColor: "#f7fee7",
    background: "linear-gradient(135deg, #fdfff2 0%, #d9f99d 100%)",
    icon: "#4d7c0f"
  },
  {
    name: "Kiwi",
    source: "Tailwind",
    backgroundColor: "#f0fdf4",
    background: "linear-gradient(135deg, #fbfff9 0%, #bbf7d0 100%)",
    icon: "#16a34a"
  },
  {
    name: "Forest",
    source: "Open Color",
    backgroundColor: "#f0fdf4",
    background: "linear-gradient(135deg, #fbfffb 0%, #dcfce7 100%)",
    icon: "#166534"
  },
  {
    name: "Arctic",
    source: "Radix",
    backgroundColor: "#f0fdfa",
    background: "linear-gradient(135deg, #fbfffe 0%, #ccfbf1 100%)",
    icon: "#0f766e"
  },
  {
    name: "Glacier",
    source: "Tailwind",
    backgroundColor: "#f0f9ff",
    background: "linear-gradient(135deg, #fbfdff 0%, #dbeafe 100%)",
    icon: "#0369a1"
  },
  {
    name: "Aurora",
    source: "Coolors",
    backgroundColor: "#f5f3ff",
    background: "linear-gradient(135deg, #fbfaff 0%, #ccfbf1 100%)",
    icon: "#0d9488"
  },
  {
    name: "Night Sky",
    source: "Color Hunt",
    backgroundColor: "#f8fafc",
    background: "linear-gradient(135deg, #ffffff 0%, #dbeafe 100%)",
    icon: "#1e3a8a"
  }
];

const moreColorKitOrder = [
  "Coral Reef",
  "Rose Milk",
  "Berry Cream",
  "Cherry Soda",
  "Dusty Rose",
  "Tomato Blush",
  "Sunset Peach",
  "Apricot Ink",
  "Terracotta",
  "Copper",
  "Clay",
  "Mango",
  "Amber Clay",
  "Marigold",
  "Butter Blue",
  "Sandstone",
  "Honey Sage",
  "Olive Grove",
  "Lemon Lime",
  "Pistachio",
  "Matcha Mint",
  "Mint Chocolate",
  "Moss Linen",
  "Pine Mist",
  "Jade",
  "Emerald Frost",
  "Kiwi",
  "Forest",
  "Seafoam",
  "Turquoise",
  "Arctic",
  "Aurora",
  "Lagoon",
  "Aqua Night",
  "Cyan Cloud",
  "Glacier",
  "Ice Blue",
  "Denim",
  "Night Sky",
  "Navy Porcelain",
  "Periwinkle",
  "Iris Fog",
  "Grape Soda",
  "Lilac Ink",
  "Orchid",
  "Plum Silk",
  "Slate Lavender",
  "Mauve",
  "Cocoa",
  "Taupe"
];

const moreColorKitsByName = new Map(moreColorKits.map((kit) => [kit.name, kit]));

const sortedMoreColorKits = moreColorKitOrder
  .map((name) => moreColorKitsByName.get(name))
  .filter((kit): kit is ColorKit => Boolean(kit));

const iconSwatches = [
  "#5f5e59",
  "#78716c",
  "#64748b",
  "#617287",
  "#5f776a",
  "#8a7761",
  "#8b6f76",
  "#746c86",
  "#FF2442",
  "#6FD2BD"
];

function getCornerAttributes(corner: CornerStyle) {
  if (corner === "0px sharp") {
    return {
      cap: "square",
      join: "miter"
    };
  }

  return {
    cap: "round",
    join: "round"
  };
}

function applyIconParams(svg: string, params: IconParams) {
  const strokeWidth = params.strokeWidth.replace("px", "");
  const corner = getCornerAttributes(params.corner);
  let nextSvg = svg
    .replace(/\sstroke-width="[^"]*"/gi, ` stroke-width="${strokeWidth}"`)
    .replace(/\sstroke-linecap="[^"]*"/gi, ` stroke-linecap="${corner.cap}"`)
    .replace(/\sstroke-linejoin="[^"]*"/gi, ` stroke-linejoin="${corner.join}"`);

  nextSvg = nextSvg.replace(/<(path|circle|rect|ellipse|line|polyline|polygon)\b([^>]*\sstroke="currentColor"[^>]*)\/>/gi, (match) => {
    let node = match;

    if (!/\sstroke-width="/i.test(node)) {
      node = node.replace(/\/>$/, ` stroke-width="${strokeWidth}"/>`);
    }
    if (!/\sstroke-linecap="/i.test(node)) {
      node = node.replace(/\/>$/, ` stroke-linecap="${corner.cap}"/>`);
    }
    if (!/\sstroke-linejoin="/i.test(node)) {
      node = node.replace(/\/>$/, ` stroke-linejoin="${corner.join}"/>`);
    }

    return node;
  });

  if (params.style === "fill") {
    nextSvg = nextSvg
      .replace(/\sstroke="currentColor"/gi, "")
      .replace(/\sstroke-width="[^"]*"/gi, "")
      .replace(/\sstroke-linecap="[^"]*"/gi, "")
      .replace(/\sstroke-linejoin="[^"]*"/gi, "")
      .replace(/\sfill="none"/gi, ' fill="currentColor"');

    nextSvg = nextSvg.replace(/<(path|circle|rect|ellipse|polygon)\b((?:(?!fill=)[^>])*)\/>/gi, "<$1$2 fill=\"currentColor\"/>");
  }

  return nextSvg;
}

function IconGlyph({
  icon,
  label,
  params
}: {
  icon: CentralIcon;
  label?: string;
  params?: IconParams;
}) {
  const svg = params ? applyIconParams(icon.svg, params) : icon.svg;

  return (
    <span
      aria-label={label ?? icon.name}
      className="icon-glyph"
      dangerouslySetInnerHTML={{ __html: svg }}
      role="img"
    />
  );
}

function normalize(value: string) {
  return value.trim().toLowerCase();
}

function drawRoundedRect(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  radius: number
) {
  const safeRadius = Math.min(radius, width / 2, height / 2);

  context.beginPath();
  context.moveTo(safeRadius, 0);
  context.lineTo(width - safeRadius, 0);
  context.quadraticCurveTo(width, 0, width, safeRadius);
  context.lineTo(width, height - safeRadius);
  context.quadraticCurveTo(width, height, width - safeRadius, height);
  context.lineTo(safeRadius, height);
  context.quadraticCurveTo(0, height, 0, height - safeRadius);
  context.lineTo(0, safeRadius);
  context.quadraticCurveTo(0, 0, safeRadius, 0);
  context.closePath();
}

function createBackgroundFill(
  context: CanvasRenderingContext2D,
  background: string,
  fallbackColor: string,
  width: number,
  height: number
) {
  const match = background.match(
    /linear-gradient\(\s*([0-9.]+)deg\s*,\s*(#[0-9a-f]{3,8})[^,]*,\s*(#[0-9a-f]{3,8})/i
  );

  if (!match) {
    return background.startsWith("#") ? background : fallbackColor;
  }

  const angle = Number(match[1]);
  const startColor = match[2];
  const endColor = match[3];
  const radians = (angle * Math.PI) / 180;
  const vectorX = Math.sin(radians);
  const vectorY = -Math.cos(radians);
  const length = Math.abs(width * vectorX) + Math.abs(height * vectorY);
  const centerX = width / 2;
  const centerY = height / 2;
  const gradient = context.createLinearGradient(
    centerX - (vectorX * length) / 2,
    centerY - (vectorY * length) / 2,
    centerX + (vectorX * length) / 2,
    centerY + (vectorY * length) / 2
  );

  gradient.addColorStop(0, startColor);
  gradient.addColorStop(1, endColor);
  return gradient;
}

function prepareSvgForExport(svg: string, size: number, color: string) {
  const escapedColor = color.replace(/&/g, "&amp;").replace(/"/g, "&quot;");

  return svg
    .replace(/\swidth="[^"]*"/i, "")
    .replace(/\sheight="[^"]*"/i, "")
    .replace(
      /<svg\b/i,
      `<svg width="${size}" height="${size}" color="${escapedColor}" style="color: ${escapedColor};"`
    );
}

function loadSvgImage(svg: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const image = new Image();

    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("SVG 渲染失败"));
    };
    image.src = url;
  });
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");

  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 500);
}

export function App() {
  const [icons, setIcons] = useState<CentralIcon[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [selectedName, setSelectedName] = useState("");
  const [backgroundColor, setBackgroundColor] = useState(lightColorKits[1].backgroundColor);
  const [backgroundStyle, setBackgroundStyle] = useState(lightColorKits[1].background);
  const [iconColor, setIconColor] = useState(lightColorKits[1].icon);
  const [iconStyle, setIconStyle] = useState<IconStyle>("line");
  const [strokeWidth, setStrokeWidth] = useState<StrokeWidth>("2px");
  const [corner, setCorner] = useState<CornerStyle>("2px medium");
  const [iconSize, setIconSize] = useState(136);
  const [padding, setPadding] = useState(42);
  const [radius, setRadius] = useState(50);
  const [exportScale, setExportScale] = useState<ExportScale>(0.2);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [palettePanelOpen, setPalettePanelOpen] = useState(false);

  async function loadIcons() {
    setStatus("loading");
    setError("");

    try {
      const response = await fetch("/api/central-icons");
      const payload = (await response.json()) as IconsResponse | { error?: string };

      if (!response.ok || !("icons" in payload)) {
        throw new Error("error" in payload && payload.error ? payload.error : "加载失败");
      }

      setIcons(payload.icons);
      setCategories(payload.categories);
      setSelectedName((current) => current || payload.icons[0]?.name || "");
      setStatus("ready");
    } catch (loadError) {
      setStatus("error");
      setError(loadError instanceof Error ? loadError.message : "加载失败");
    }
  }

  useEffect(() => {
    void loadIcons();
  }, []);

  useEffect(() => {
    if (!palettePanelOpen) {
      return;
    }

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setPalettePanelOpen(false);
      }
    }

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [palettePanelOpen]);

  const filteredIcons = useMemo(() => {
    const needle = normalize(query);

    return icons.filter((icon) => {
      const categoryMatch = category === "All" || icon.category === category;
      const searchMatch =
        !needle ||
        icon.name.toLowerCase().includes(needle) ||
        icon.category.toLowerCase().includes(needle) ||
        icon.aliases.some((alias) => alias.toLowerCase().includes(needle));

      return categoryMatch && searchMatch;
    });
  }, [category, icons, query]);

  const selectedIcon = useMemo(() => {
    return icons.find((icon) => icon.name === selectedName) ?? icons[0];
  }, [icons, selectedName]);
  const iconParams = useMemo(
    () => ({
      corner,
      strokeWidth,
      style: iconStyle
    }),
    [corner, iconStyle, strokeWidth]
  );
  const backgroundToken = useMemo(() => {
    if (backgroundStyle.startsWith("#")) {
      return backgroundColor;
    }

    return gradientPresets.find((preset) => preset.value === backgroundStyle)?.name ?? "gradient";
  }, [backgroundColor, backgroundStyle]);

  async function copyName() {
    if (!selectedIcon) {
      return;
    }

    await navigator.clipboard.writeText(selectedIcon.name);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  }

  function applyLightKit(kit: ColorKit) {
    setBackgroundColor(kit.backgroundColor);
    setBackgroundStyle(kit.background);
    setIconColor(kit.icon);
  }

  function renderColorKit(kit: ColorKit, extraClassName = "") {
    const isActive = kit.background === backgroundStyle && kit.icon === iconColor;
    const className = ["color-kit", isActive ? "active" : "", extraClassName]
      .filter(Boolean)
      .join(" ");

    return (
      <button
        aria-pressed={isActive}
        className={className}
        key={kit.name}
        onClick={() => applyLightKit(kit)}
        style={{ background: kit.background, color: kit.icon }}
        title={`${kit.name} (${kit.source})`}
        type="button"
      >
        <span className="kit-icon">
          {selectedIcon ? <IconGlyph icon={selectedIcon} params={iconParams} /> : null}
        </span>
        <span className="kit-meta">
          <strong>{kit.name}</strong>
          <small>{kit.source}</small>
        </span>
        {isActive ? (
          <span aria-hidden="true" className="kit-check">
            <Check size={12} strokeWidth={2.2} />
          </span>
        ) : null}
      </button>
    );
  }

  async function exportPng() {
    if (!selectedIcon || exporting) {
      return;
    }

    setExporting(true);

    try {
      const logicalSize = iconSize + padding * 2;
      const outputSize = Math.max(1, Math.round(logicalSize * exportScale));
      const pixelScale = outputSize / logicalSize;
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");

      if (!context) {
        throw new Error("Canvas 不可用");
      }

      canvas.width = outputSize;
      canvas.height = outputSize;
      context.scale(pixelScale, pixelScale);
      context.clearRect(0, 0, logicalSize, logicalSize);
      drawRoundedRect(context, logicalSize, logicalSize, radius);
      context.clip();
      context.fillStyle = createBackgroundFill(
        context,
        backgroundStyle,
        backgroundColor,
        logicalSize,
        logicalSize
      );
      context.fillRect(0, 0, logicalSize, logicalSize);

      const svg = prepareSvgForExport(applyIconParams(selectedIcon.svg, iconParams), iconSize, iconColor);
      const image = await loadSvgImage(svg);
      context.drawImage(image, padding, padding, iconSize, iconSize);

      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((pngBlob) => {
          if (pngBlob) {
            resolve(pngBlob);
          } else {
            reject(new Error("PNG 生成失败"));
          }
        }, "image/png");
      });

      downloadBlob(blob, `${selectedIcon.name}-${exportScale}x-${outputSize}px.png`);
    } finally {
      setExporting(false);
    }
  }

  return (
    <main className="app-shell">
      <section className="workspace">
        <aside className="sidebar">
          <div className="brand-row">
            <div className="brand-mark">
              <Sparkles size={17} strokeWidth={1.8} />
            </div>
            <div>
              <h1>Icon Maker</h1>
              <p>{status === "ready" ? `${icons.length} 个图标可用` : "图标制作器"}</p>
            </div>
          </div>

          <div className="sidebar-controls">
            <label className="search-field">
              <Search size={16} strokeWidth={1.8} />
              <input
                autoComplete="off"
                onChange={(event) => setQuery(event.target.value)}
                placeholder="搜索图标、别名或分类"
                value={query}
              />
            </label>

            <div className="filter-row">
              <select onChange={(event) => setCategory(event.target.value)} value={category}>
                <option value="All">全部分类</option>
                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
              <button aria-label="刷新图标" className="icon-button" onClick={loadIcons} type="button">
                {status === "loading" ? (
                  <Loader2 className="spin" size={16} strokeWidth={1.8} />
                ) : (
                  <RefreshCw size={16} strokeWidth={1.8} />
                )}
              </button>
            </div>
          </div>

          <div className="icon-grid" data-state={status}>
            {status === "error" ? (
              <div className="empty-state">
                <p>无法读取图标库。</p>
                <span>{error}</span>
              </div>
            ) : null}

            {status === "loading" ? (
              <div className="empty-state">
                <Loader2 className="spin" size={18} strokeWidth={1.8} />
                <span>正在同步图标清单</span>
              </div>
            ) : null}

            {status === "ready" && filteredIcons.length === 0 ? (
              <div className="empty-state">
                <p>没有匹配结果。</p>
                <span>换一个关键词或分类。</span>
              </div>
            ) : null}

            {status === "ready"
              ? filteredIcons.map((icon) => (
                  <button
                    aria-pressed={icon.name === selectedName}
                    className={icon.name === selectedName ? "icon-tile selected" : "icon-tile"}
                    key={icon.id}
                    onClick={() => setSelectedName(icon.name)}
                    title={`${icon.name} (${icon.category})`}
                    type="button"
                  >
                    <IconGlyph icon={icon} params={iconParams} />
                    <span>{icon.name}</span>
                  </button>
                ))
              : null}
          </div>
        </aside>

        <section className="preview-panel">
          <div className="preview-topbar">
            <div>
              <p className="eyebrow">{selectedIcon?.category ?? "图标"}</p>
              <h2>{selectedIcon?.name ?? "加载中"}</h2>
            </div>
            <div className="preview-actions">
              <button
                className="copy-button"
                disabled={!selectedIcon}
                onClick={copyName}
                type="button"
              >
                {copied ? (
                  <Check size={16} strokeWidth={1.8} />
                ) : (
                  <Copy size={16} strokeWidth={1.8} />
                )}
                {copied ? "已复制" : "复制名称"}
              </button>
              <button
                className="copy-button primary-action"
                disabled={!selectedIcon || exporting}
                onClick={exportPng}
                type="button"
              >
                {exporting ? (
                  <Loader2 className="spin" size={16} strokeWidth={1.8} />
                ) : (
                  <Download size={16} strokeWidth={1.8} />
                )}
                {exporting ? "导出中" : "导出 PNG"}
              </button>
            </div>
          </div>

          <div className="preview-stage-wrap">
            <div
              className="preview-stage"
              style={{
                background: backgroundStyle,
                borderRadius: `${radius}px`,
                padding: `${padding}px`
              }}
            >
              {selectedIcon ? (
                <div
                  className="preview-icon"
                  style={{
                    color: iconColor,
                    height: `${iconSize}px`,
                    width: `${iconSize}px`
                  }}
                >
                  <IconGlyph
                    icon={selectedIcon}
                    label={`${selectedIcon.name} 预览`}
                    params={iconParams}
                  />
                </div>
              ) : null}
            </div>
          </div>

          <div className="control-grid">
            <section className="control-section color-section">
              <div className="section-header">
                <div className="section-title">
                  <Palette size={16} strokeWidth={1.8} />
                  <span>颜色</span>
                </div>
                <button
                  className="more-button"
                  onClick={() => setPalettePanelOpen(true)}
                  type="button"
                >
                  <MoreHorizontal size={15} strokeWidth={1.9} />
                  更多
                </button>
              </div>

              <div className="kit-grid">
                {lightColorKits.map((kit) => renderColorKit(kit))}
              </div>

              <div className="tone-editor">
                <div className="tone-block">
                  <div className="tone-header">
                    <span>背景</span>
                    <label className="color-field">
                      <input
                        aria-label="自定义背景色"
                        onChange={(event) => {
                          setBackgroundColor(event.target.value);
                          setBackgroundStyle(event.target.value);
                        }}
                        type="color"
                        value={backgroundColor}
                      />
                      <span
                        aria-hidden="true"
                        className="color-field-preview"
                        style={{ background: backgroundStyle.startsWith("#") ? backgroundColor : backgroundStyle }}
                      />
                      <code>{backgroundToken}</code>
                    </label>
                  </div>

                  <div aria-label="背景色" className="swatches background-swatches">
                    {backgroundSwatches.map((color) => {
                      const isActive = color === backgroundStyle;

                      return (
                        <button
                          aria-label={`背景 ${color}`}
                          aria-pressed={isActive}
                          className={isActive ? "swatch active" : "swatch"}
                          key={color}
                          onClick={() => {
                            setBackgroundColor(color);
                            setBackgroundStyle(color);
                          }}
                          style={{ backgroundColor: color }}
                          type="button"
                        >
                          {isActive ? (
                            <span aria-hidden="true" className="swatch-check">
                              <Check size={12} strokeWidth={2.2} />
                            </span>
                          ) : null}
                        </button>
                      );
                    })}
                  </div>

                  <div className="preset-grid">
                    {gradientPresets.map((preset) => {
                      const isActive = preset.value === backgroundStyle;

                      return (
                        <button
                          aria-pressed={isActive}
                          className={isActive ? "gradient-preset active" : "gradient-preset"}
                          key={preset.name}
                          onClick={() => setBackgroundStyle(preset.value)}
                          style={{ background: preset.value }}
                          type="button"
                        >
                          <span className="gradient-label">{preset.name}</span>
                          {isActive ? (
                            <span aria-hidden="true" className="gradient-check">
                              <Check size={11} strokeWidth={2.2} />
                            </span>
                          ) : null}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="tone-block icon-tone">
                  <div className="tone-header">
                    <span>图标</span>
                    <label className="color-field">
                      <input
                        aria-label="自定义图标色"
                        onChange={(event) => setIconColor(event.target.value)}
                        type="color"
                        value={iconColor}
                      />
                      <span
                        aria-hidden="true"
                        className="color-field-preview"
                        style={{ backgroundColor: iconColor }}
                      />
                      <code>{iconColor}</code>
                    </label>
                  </div>

                  <div aria-label="图标色" className="swatches icon-swatches">
                    {iconSwatches.map((color) => {
                      const isActive = color === iconColor;

                      return (
                        <button
                          aria-label={`图标 ${color}`}
                          aria-pressed={isActive}
                          className={isActive ? "swatch active" : "swatch"}
                          key={color}
                          onClick={() => setIconColor(color)}
                          style={{ backgroundColor: color }}
                          type="button"
                        >
                          {isActive ? (
                            <span aria-hidden="true" className="swatch-check">
                              <Check size={12} strokeWidth={2.2} />
                            </span>
                          ) : null}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </section>

            <section className="control-section canvas-section">
              <div className="section-title">
                <SlidersHorizontal size={16} strokeWidth={1.8} />
                <span>画布</span>
              </div>

              <div className="param-grid">
                <label className="param-control">
                  <span>Style</span>
                  <div className="param-select">
                    <ToggleLeft size={17} strokeWidth={1.8} />
                    <select
                      aria-label="Style"
                      onChange={(event) => setIconStyle(event.target.value as IconStyle)}
                      value={iconStyle}
                    >
                      {iconStyleOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </label>

                <label className="param-control">
                  <span>Stroke</span>
                  <div className="param-select">
                    <Circle size={17} strokeWidth={1.8} />
                    <select
                      aria-label="Stroke"
                      onChange={(event) => setStrokeWidth(event.target.value as StrokeWidth)}
                      value={strokeWidth}
                    >
                      {strokeOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </label>

                <label className="param-control">
                  <span>Corner</span>
                  <div className="param-select">
                    <CornerUpLeft size={17} strokeWidth={1.8} />
                    <select
                      aria-label="Corner"
                      onChange={(event) => setCorner(event.target.value as CornerStyle)}
                      value={corner}
                    >
                      {cornerOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </label>
              </div>

              <div className="export-scale-group">
                <span>导出倍率</span>
                <div className="segmented-control" role="radiogroup" aria-label="导出倍率">
                  {exportScaleOptions.map((option) => (
                    <button
                      aria-checked={exportScale === option.value}
                      className={exportScale === option.value ? "segment active" : "segment"}
                      key={option.value}
                      onClick={() => setExportScale(option.value)}
                      role="radio"
                      type="button"
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
                <code>{Math.round((iconSize + padding * 2) * exportScale)}px</code>
              </div>

              <label className="range-row">
                <span>大小</span>
                <input
                  max="220"
                  min="48"
                  onChange={(event) => setIconSize(Number(event.target.value))}
                  type="range"
                  value={iconSize}
                />
                <code>{iconSize}px</code>
              </label>

              <label className="range-row">
                <span>留白</span>
                <input
                  max="90"
                  min="12"
                  onChange={(event) => setPadding(Number(event.target.value))}
                  type="range"
                  value={padding}
                />
                <code>{padding}px</code>
              </label>

              <label className="range-row">
                <span>圆角</span>
                <input
                  max="96"
                  min="0"
                  onChange={(event) => setRadius(Number(event.target.value))}
                  type="range"
                  value={radius}
                />
                <code>{radius}px</code>
              </label>
            </section>
          </div>
        </section>
      </section>

      {palettePanelOpen ? (
        <div
          className="palette-dialog-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setPalettePanelOpen(false);
            }
          }}
        >
          <section
            aria-labelledby="palette-dialog-title"
            aria-modal="true"
            className="palette-dialog"
            role="dialog"
          >
            <div className="palette-dialog-header">
              <div>
                <p className="eyebrow">Icon Maker 调色板</p>
                <h3 id="palette-dialog-title">更多颜色搭配</h3>
              </div>
              <button
                aria-label="关闭颜色面板"
                className="icon-button"
                onClick={() => setPalettePanelOpen(false)}
                type="button"
              >
                <X size={16} strokeWidth={1.9} />
              </button>
            </div>

            <div className="palette-dialog-body">
              <div className="palette-dialog-grid">
                {sortedMoreColorKits.map((kit) => renderColorKit(kit, "palette-dialog-kit"))}
              </div>
            </div>
          </section>
        </div>
      ) : null}
    </main>
  );
}
