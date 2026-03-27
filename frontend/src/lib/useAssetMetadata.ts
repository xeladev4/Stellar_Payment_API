"use client";

import { useEffect, useState } from "react";
import type { AssetMetadata, AssetMetadataResponse } from "@/app/api/asset-metadata/route";

export type { AssetMetadata };

// Mirrors the route's static data so consumers have valid values immediately,
// with no loading gap and no fallback constant scattered across components.
const DEFAULT_ASSETS: AssetMetadata[] = [
  {
    code: "XLM",
    issuer: null,
    name: "Stellar Lumens",
    description: "The native asset of the Stellar network",
  },
  {
    code: "USDC",
    issuer:
      process.env.NEXT_PUBLIC_USDC_ISSUER ??
      "GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5",
    name: "USD Coin",
    description: "USD-backed stablecoin",
  },
];

/**
 * Returns asset metadata from the edge-cached `/api/asset-metadata` route.
 * Initialised with static defaults so consumers always have a valid value —
 * the background fetch updates state once the cached route responds.
 */
export function useAssetMetadata(): { assets: AssetMetadata[] } {
  const [assets, setAssets] = useState<AssetMetadata[]>(DEFAULT_ASSETS);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/asset-metadata")
      .then((res) => {
        if (!res.ok) return;
        return res.json() as Promise<AssetMetadataResponse>;
      })
      .then((data) => {
        if (!cancelled && data) setAssets(data.assets);
      })
      .catch(() => {
        // defaults remain in place
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { assets };
}
