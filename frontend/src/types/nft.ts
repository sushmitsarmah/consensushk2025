export interface NFT {
    id: string
    name: string
    description: string
    imageUrl: string
    collectionId: string
    attributes: {
        trait_type: string
        value: string
    }[]
}

export interface NFTCollection {
    id: string
    name: string
    description: string
    imageUrl: string
    nfts: NFT[]
}