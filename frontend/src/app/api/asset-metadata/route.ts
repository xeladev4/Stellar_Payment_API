import { NextResponse } from "next/server";

/**
 * ISR: revalidate this route at most once per hour.
 * Served from the CDN edge after the first request — no Horizon call on
 * every page load.
 */
export const revalidate = 3600;

const USDC_ISSUER =
  process.env.NEXT_PUBLIC_USDC_ISSUER ??
  "GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5";

export interface AssetMetadata {
  code: string;
  issuer: string | null;
  name: string;
  description: string;
}

export interface AssetMetadataResponse {
  assets: AssetMetadata[];
  cached_at: string;
}

export async function GET() {
  return NextResponse.json<AssetMetadataResponse>({
    assets: [
      {
        code: "XLM",
        issuer: null,
        name: "Stellar Lumens",
        description: "The native asset of the Stellar network",
      },
      {
        code: "USDC",
        issuer: USDC_ISSUER,
        name: "USD Coin",
        description: "USD-backed stablecoin",
      },
    ],
    cached_at: new Date().toISOString(),
  });
}
