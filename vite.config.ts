import type { IncomingMessage, ServerResponse } from "node:http";
import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import { fetchCentralIcons, type CentralIconPayload } from "./src/centralIcons";

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
        cached = await fetchCentralIcons();
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
