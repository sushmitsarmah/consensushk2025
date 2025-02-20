/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useEffect, useState } from "react"
import { useSdkContext } from "@/web3/lib/sdk/UniqueSDKProvider"
import { Card, CardContent } from "@/components/ui/card"
import TradeNFT from "@/web3/services/collections/nft_trade";

interface NFTDetailProps {
    itemId: number;
    collectionId: number;
}

export function NFTDetail({ itemId, collectionId }: NFTDetailProps) {
    const { sdk } = useSdkContext()
    const [metadataLink, setMetadataLink] = useState<string>("");
    const [metadata, setMetadata] = useState<any>();

    const fetchItemMetadata = async () => {
        if (!sdk) return;

        const item = await sdk.nftsPallet.item.get({
            collectionId,
            itemId
        })
        if (item.metadata) {
            if (item.metadata.data.indexOf("token_metadata.json") === -1) {
                setMetadataLink(item.metadata?.data)
            }
        }
    };

    const fetchIpfsData = async (url: string) => {
        console.log(url)
        try {
            const response = await fetch(url);
            console.log(response)
            if (!response.ok) {
                throw new Error(`Error fetching IPFS data: ${response.statusText}`);
            }
            const ipfsData = await response.json();
            ipfsData.image = ipfsData.image.replace("ipfs://ipfs/", "https://gateway.pinata.cloud/ipfs/");
            setMetadata(ipfsData);
            console.log(ipfsData);
        } catch (error: any) {
            console.error(`Failed to fetch IPFS data: ${error.message}`);
        }
    };

    useEffect(() => {
        fetchItemMetadata();
    }, []);

    useEffect(() => {
        if (metadataLink) {
            const url = metadataLink.replace("ipfs://ipfs/", "https://gateway.pinata.cloud/ipfs/");
            fetchIpfsData(url);
        }
    }, [metadataLink]);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="rounded-lg overflow-hidden shadow-lg">
                {metadata ?
                    <img src={metadata.image}
                        alt={metadata.name}
                        className="w-full h-full object-cover" />
                    : <div className="p-2">Item: ${itemId}</div>}
            </div>
            <div>
                {metadata ?
                    <>
                        <h1 className="text-3xl font-bold text-slate-900 mb-4">{metadata.name}</h1>
                        <p className="text-slate-600 mb-6">{metadata.description}</p>
                    </> : ""}

                <Card>
                    <CardContent className="p-6">
                        <h2 className="text-xl font-semibold mb-4">Attributes</h2>
                        <div className="grid grid-cols-2 gap-4">
                            {((metadata && metadata.attributes) || []).map((attr: any, index: number) => (
                                <div
                                    key={index}
                                    className="bg-slate-50 rounded-lg p-4"
                                >
                                    <p className="text-sm text-slate-500">{attr.trait_type}</p>
                                    <p className="font-medium text-slate-900">{attr.value}</p>
                                </div>
                            ))}
                        </div>
                        <TradeNFT collectionId={collectionId} itemId={itemId} />
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}