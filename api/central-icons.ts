import centralIcons from "../public/central-icons.json";

type ApiResponse = {
  setHeader(name: string, value: string): void;
  status(statusCode: number): ApiResponse;
  json(data: unknown): void;
};

export default async function handler(_request: unknown, response: ApiResponse) {
  response.setHeader("cache-control", "s-maxage=3600, stale-while-revalidate=86400");
  response.status(200).json(centralIcons);
}
