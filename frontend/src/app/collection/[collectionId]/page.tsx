/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { use } from "react"
import CollectionNFTs from "@/web3/services/collections/nfts"

const CollectionPage = ({ params }: any) => {
    const { collectionId } = use<any>(params)

    return (
        <CollectionNFTs id={collectionId} />
    )
}

export default CollectionPage
