/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { CreateNFTForm } from "@/components/elems/create-nft-form"
import { use } from "react"

export default function CreateNFTPage({ params }: any) {
  const { collectionId } = use<any>(params)

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-slate-900 mb-8">Create NFT</h1>
      <CreateNFTForm collectionId={collectionId} />
    </div>
  )
}