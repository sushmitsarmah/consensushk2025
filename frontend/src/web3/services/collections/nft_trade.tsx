"use client"
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSdkContext } from "@/web3/lib/sdk/UniqueSDKProvider";
import { useAccountsContext } from "@/web3/lib/wallets/AccountsProvider";
import { useState } from "react";

interface TradeNFTProps {
    collectionId: number;
    itemId: number;
};

const TradeNFT = ({ collectionId, itemId }: TradeNFTProps) => {
    const { sdk } = useSdkContext();
    const accountContext = useAccountsContext();
    const [price, setPrice] = useState(0);
    const [bidPrice, setBidPrice] = useState(0);
    const [buyer, setBuyer] = useState("");

    const tradeNFT = async (tradeType: string) => {
        if (!sdk || !accountContext?.activeAccount) return;

        const account = accountContext?.activeAccount;

        // 🐣 Step 3: Create a new collection on AssetHub
        // console.log("🚀 Creating a new NFT collection on AssetHub...");
        const buildOptions = { signerAddress: account.address };
        const signerAccount = {
            signer: {
                sign: accountContext.activeAccount.signer.sign as any
            },
            address: account.address
        };

        console.log(`🚀 ${tradeType} NFT in collection #${collectionId}...`);

        try {
            if (tradeType === "setPrice") {
                const { result } = await sdk.nftsPallet.trade.setPrice({
                    collectionId: +collectionId,
                    itemId: +itemId, // manually specifying itemId, though it could also be auto-generated
                    price,
                    buyer,
                }, buildOptions, signerAccount);
                console.log(result)
                console.log(`✅ NFT ${tradeType}! Item ID: ${result.itemId}`);
            }

            if (tradeType === "buy") {
                const { result } = await sdk.nftsPallet.trade.buy({
                    collectionId: +collectionId,
                    itemId: +itemId, // manually specifying itemId, though it could also be auto-generated
                    bidPrice,
                }, buildOptions, signerAccount);
                console.log(result)
                console.log(`✅ NFT ${tradeType}! Item ID: ${result.itemId}`);
            }
        } catch (error: any) {
            console.error(error);
        }

    };

    return (
        <div className="flex flex-row gap-4 items-center justify-between">
            <div className="flex flex-col gap-4">
                <div className="flex flex-row gap-4">
                    <Input type="number" placeholder="Price" onChange={(e) => setPrice(parseInt(e.target.value))} />
                    <Input type="text" placeholder="Buyer" onChange={(e) => setBuyer(e.target.value)} />
                </div>
                <Button className="bg-yellow-600" onClick={() => tradeNFT("setPrice")}>Set NFT Price</Button>
            </div>
            <div className="flex flex-col gap-4">
                <Input type="number" placeholder="Bid Price" onChange={(e) => setBidPrice(parseInt(e.target.value))} />
                <Button className="bg-green-500" onClick={() => tradeNFT("buy")}>Buy NFT</Button>
            </div>
        </div>
    )

};

export default TradeNFT;