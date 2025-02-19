/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */

"use client"

import { useEffect, useState } from "react"
import { useSdkContext } from "@/web3/lib/sdk/UniqueSDKProvider"
import { ItemCard } from "@/components/elems/item-card";
import CreateNFT from "./create-nft";
// import { CollectionCard } from "@/components/elems/collection-card"

interface CollectionPageProps {
    id: string;
}

const CollectionNFTs = ({ id }: CollectionPageProps) => {
    const { sdk } = useSdkContext()
    const [collection, setCollection] = useState<any>()
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)

    const fetchCollection = async () => {
        if (!sdk) return;

        try {
            console.log('fetching collection', id)
            const collectionData = await sdk.nftsPallet.collection.get({
                collectionId: parseInt(id, 10)
            })
            console.log(collectionData)
            setCollection(collectionData)

        } catch (err: any) {
            setError(`Failed to fetch collection: ${err.message}`)
        } finally {
            setLoading(false)
        }
    };

    const fetchItems = async () => {
        if (!sdk || !collection || +collection.items === 0) return;

        const test = await sdk.nftsPallet.item.get({
            collectionId: parseInt(id, 10),
            itemId: 1
        })
        console.log(test)
    };


    useEffect(() => {
        fetchCollection()
    }, [])

    useEffect(() => {
        fetchItems()
    }, [collection])

    const showItems = (items: number) => {
        const arr = [];
        for (let i = 1; i <= items; i++) {
            arr.push(
                <ItemCard key={i} id={i} />
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
        <div className="max-w-3xl mx-auto">
            {collection && <div className="flex flex-col gap-2">
                Collection Max Supply: {collection.config.maxSupply}
                Collection Items: {collection.items}
            </div>}
            <CreateNFT collectionId={+id} items={collection.items} />
            {collection.items && <div className="grid grid-cols-4 gap-4">
                {showItems(collection.items)}
            </div>}
        </div>
    )
}

export default CollectionNFTs
