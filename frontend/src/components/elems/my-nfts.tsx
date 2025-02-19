"use client"

import { useState } from "react"
import { NFTCard } from "@/components/elems/nft-card"
import { NFT } from "@/types/nft"
import ImageUploader from "@/web3/services/ipfs/uploadImage"
import ViewFile from "@/web3/services/ipfs/viewFile"
import MetaDataUploader from "@/web3/services/ipfs/uploadMetadata"

const imagesIpfsHash = "bafybeicy4hn57pnk2y5z7ql6bqwn3iq5qkwigrmb7ehxotjruvy6aaljkq";
const collectionMetadata = {
    name: "My NFT",
    description: "This is a unique NFT",
    image: `ipfs://ipfs/${imagesIpfsHash}/cover.png`,
};

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
            <ImageUploader />
            <MetaDataUploader metaData={collectionMetadata} />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {nfts.map((nft) => (
                    <NFTCard key={nft.id} nft={nft} />
                ))}
            </div>

            <ViewFile />
        </div>
    )
}