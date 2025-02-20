/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { NFTDetail } from "@/components/elems/nft-detail"
import { use } from "react"

export default function NFTDetailPage({ params }: any) {
  const { itemId, collectionId } = use<any>(params)

  return <NFTDetail itemId={itemId} collectionId={collectionId} />
}