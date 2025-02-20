/* eslint-disable react-hooks/exhaustive-deps */
"use client"

import { CollectionCard } from "@/components/elems/collection-card";
import { useSdkContext } from "@/web3/lib/sdk/UniqueSDKProvider";
import { useAccountsContext } from "@/web3/lib/wallets/AccountsProvider";
import CreateNFTCollection from '@/web3/services/collections/create';
import { useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";

interface NFTCollections {
    account: string;
    collections: number[];
}

const ShowCollections = () => {
    const { sdk } = useSdkContext();
    const accountContext = useAccountsContext();
    const [collections, setCollections] = useState<NFTCollections>();

    const fetchCollections = async () => {
        if (!sdk || !accountContext?.activeAccount) return;

        const accountAddress = accountContext?.activeAccount?.address;

        const colls: NFTCollections = await sdk.nftsPallet.account.getCollections({
            account: accountAddress
        });
        setCollections(colls);
    };

    useEffect(() => {
        fetchCollections();
    }, [accountContext]);

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-row justify-between">
                <h1 className="text-3xl font-bold text-slate-100 mb-8">My Collections</h1>
                <div className="flex flex-row gap-4">
                    <RefreshCw onClick={fetchCollections} />
                    <CreateNFTCollection />
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {collections && collections.collections.map((id) => (
                    <CollectionCard key={id} id={id} />
                ))}
            </div>
        </div>
    )

};

export default ShowCollections;