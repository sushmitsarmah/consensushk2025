"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { NFT } from "@/types/nft"

export function NFTDetail({ id }: { id: string }) {
    const [nft, setNft] = useState<NFT | null>(null)

    useEffect(() => {
        // Simulate fetching NFT data
        setNft({
            id: "1",
            name: "Cool NFT #1",
            description: "A very cool NFT with amazing attributes",
            imageUrl: "https://via.placeholder.com/500",
            collectionId: "1",
            attributes: [
                { trait_type: "Background", value: "Blue" },
                { trait_type: "Eyes", value: "Green" },
            ],
        })
    }, [id])

    if (!nft) {
        return <div>Loading...</div>
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="rounded-lg overflow-hidden shadow-lg">
                <img
                    src={nft.imageUrl}
                    alt={nft.name}
                    className="w-full h-full object-cover"
                />
            </div>
            <div>
                <h1 className="text-3xl font-bold text-slate-900 mb-4">{nft.name}</h1>
                <p className="text-slate-600 mb-6">{nft.description}</p>

                <Card>
                    <CardContent className="p-6">
                        <h2 className="text-xl font-semibold mb-4">Attributes</h2>
                        <div className="grid grid-cols-2 gap-4">
                            {nft.attributes.map((attr, index) => (
                                <div
                                    key={index}
                                    className="bg-slate-50 rounded-lg p-4"
                                >
                                    <p className="text-sm text-slate-500">{attr.trait_type}</p>
                                    <p className="font-medium text-slate-900">{attr.value}</p>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}