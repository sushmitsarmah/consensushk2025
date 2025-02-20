/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */

"use client"

import { useEffect, useState } from "react"
import { useSdkContext } from "@/web3/lib/sdk/UniqueSDKProvider"
import { ItemCard } from "@/components/elems/item-card";
import CreateNFT from "./create-nft";
import { RefreshCw } from "lucide-react";
import Image from "next/image";

interface CollectionPageProps {
    id: string;
}

const CollectionNFTs = ({ id }: CollectionPageProps) => {
    const { sdk } = useSdkContext()
    const [collection, setCollection] = useState<any>()
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)
    const [metadataLink, setMetadataLink] = useState<string>("");
    const [metadata, setMetadata] = useState<any>();

    const fetchCollection = async () => {
        if (!sdk) return;

        try {
            console.log('fetching collection', id)
            const collectionData = await sdk.nftsPallet.collection.get({
                collectionId: parseInt(id, 10)
            })
            setCollection(collectionData)

            if (collectionData.metadata) {
                if (collectionData.metadata.data.indexOf("collection_metadata.json") === -1) {
                    setMetadataLink(collectionData.metadata?.data)
                }
            }

        } catch (err: any) {
            setError(`Failed to fetch collection: ${err.message}`)
        } finally {
            setLoading(false)
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
        fetchCollection()
    }, [])

    useEffect(() => {
        if (metadataLink) {
            const url = metadataLink.replace("ipfs://ipfs/", "https://gateway.pinata.cloud/ipfs/");
            fetchIpfsData(url);
        }
    }, [metadataLink]);

    const showItems = (items: number) => {
        const arr = [];
        for (let i = 1; i <= items; i++) {
            arr.push(
                <ItemCard key={i} itemId={i} collectionId={+id} />
            )
        }
        return arr;
    };

    if (loading) {
        return <div>Loading...</div>
    }

    if (error) {
        return <div>Error: {error}</div>
    }

    if (!collection) {
        return <div>No collection found</div>
    }

    return (
        <div className="flex flex-col gap-4">
            <h1 className="text-3xl font-bold text-slate-100 mb-8">
                Collection {metadata ? metadata.name : `Collection ${id}`}
            </h1>
            <div className="flex flex-row gap-4">
                {metadata && <Image width="200" height="200" alt="collection image" src={metadata.image} />}
                {collection && <div className="flex flex-col gap-2">
                    <div className="p-4 shadow-sm border border-gray-300 flex flex-col items-center rounded">
                        <h2 className="font-bold text-gray-100 text-sm">Collection Max Supply</h2>
                        <p className="font-bold text-gray-100 text-2xl">{collection.config.maxSupply}</p>
                    </div>
                    <div className="p-4 shadow-sm border border-gray-300 flex flex-col items-center rounded">
                        <h2 className="font-bold text-gray-100 text-sm">Collection Items Count</h2>
                        <p className="font-bold text-gray-100 text-2xl">{collection.items}</p>
                    </div>
                </div>}
            </div>
            <hr />
            <div className="flex flex-row justify-between items-center">
                <h1 className="text-3xl font-bold text-slate-100 mb-8">My NFTs</h1>
                <div className="flex flex-row gap-4 items-center">
                    <RefreshCw className="text-white" onClick={fetchCollection} />
                    <CreateNFT collectionId={+id} items={collection.items} />
                </div>
            </div>
            {collection.items && <div className="grid grid-cols-4 gap-4">
                {showItems(collection.items)}
            </div>}
        </div>
    )
}

export default CollectionNFTs
