/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { use } from "react"
import CollectionNFTs from "@/web3/services/collections/nfts"

const CollectionPage = ({ params }: any) => {
    const { collectionId } = use<any>(params)

    return (
        <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold text-slate-900 mb-8">Collection: {collectionId}</h1>
            <CollectionNFTs id={collectionId} />
        </div>
    )
}

export default CollectionPage
