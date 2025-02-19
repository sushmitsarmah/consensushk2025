"use client"

import { useState } from "react"
import { NFTCard } from "@/components/elems/nft-card"
import { NFT } from "@/types/nft"
import FileUploader from "@/web3/services/ipfs/uploadFile"
import ViewFile from "@/web3/services/ipfs/viewFile"

export function MyNFTs() {
    const [nfts] = useState<NFT[]>([
        {
            id: "1",
            name: "Cool NFT #1",
            description: "A very cool NFT",
            imageUrl: "https://via.placeholder.com/500",
            collectionId: "1",
            attributes: [
                { trait_type: "Background", value: "Blue" },
                { trait_type: "Eyes", value: "Green" },
            ],
        },
    ])

    return (
        <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-8">My NFTs</h1>
            <FileUploader />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {nfts.map((nft) => (
                    <NFTCard key={nft.id} nft={nft} />
                ))}
            </div>

            <ViewFile />
        </div>
    )
}