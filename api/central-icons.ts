import { fetchCentralIcons, type CentralIconPayload } from "../src/centralIcons";

type ApiResponse = {
  setHeader(name: string, value: string): void;
  status(statusCode: number): ApiResponse;
  json(data: unknown): void;
};

let cached: CentralIconPayload | null = null;

export default async function handler(_request: unknown, response: ApiResponse) {
  response.setHeader("cache-control", "s-maxage=3600, stale-while-revalidate=86400");

  try {
    cached ??= await fetchCentralIcons();
    response.status(200).json(cached);
  } catch (error) {
    response.status(502).json({
      error: error instanceof Error ? error.message : "Failed to load icons"
    });
  }
}
