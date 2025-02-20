interface CollectionConfig {
    maxSupply: number | null;
    settings?: {
        lockedTransferItems: boolean;
        lockedMetadata: boolean;
        lockedAttributes: boolean;
        lockedMaxSupply: boolean;
    };
    mintSettings?: {
        mintType?: "Issuer" | "Public" | "HolderOf";
        price?: string | number | null;
        startBlock?: number | null;
        endBlock?: number | null;
        defaultItemSettings?: {
            lockedTransfers?: boolean;
            lockedMetadata?: boolean;
            lockedAttributes?: boolean;
        };
    };
}

interface CollectionDetails {
    owner: string;
    attributes: number;
    ownerDeposit: number;
    items: number;
    itemMetadatas: number;
    itemConfigs: number;
}

interface CollectionMetadata {
    data: string;
    deposit: string;
}

export interface Collection {
    config: CollectionConfig;
    collectionId: number;
    details: CollectionDetails;
    metadata: CollectionMetadata | null;
}