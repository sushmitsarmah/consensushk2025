/* eslint-disable @typescript-eslint/no-explicit-any */

import { Button } from "@/components/ui/button";
import { useSdkContext } from "@/web3/lib/sdk/UniqueSDKProvider";
import { useAccountsContext } from "@/web3/lib/wallets/AccountsProvider";
// import { Sr25519Account } from "@unique-nft/sr25519";

const CreateNFTCollection = () => {
    const { sdk } = useSdkContext();
    const accountContext = useAccountsContext();

    const createNFT = async () => {
        if (!sdk || !accountContext?.activeAccount) return;

        // sdk.options.account = accountContext.activeAccount.signer;

        const account = accountContext?.activeAccount;
        const balance = await sdk.balance.get(account);
        console.log(`💰 Account balance: ${balance.available}`);

        console.log(account.address)

        // 🐣 Step 3: Create a new collection on AssetHub
        // console.log("🚀 Creating a new NFT collection on AssetHub...");
        const buildOptions = { signerAddress: account.address };
        const signerAccount = {
            signer: {
                sign : accountContext.activeAccount.signer.sign as any
            },
            address: account.address
        };
        const opts = {
            collectionConfig:{ maxSupply: 21 }
        };
        const collectionResult = await sdk.nftsPallet.collection.create(opts, buildOptions, signerAccount);

        const collectionId = collectionResult.result.collectionId;
        console.log(`✅ Collection created! Collection ID: ${collectionId}`);

        console.log(`🚀 Minting a new NFT in collection #${collectionId}...`);
        const { result } = await sdk.nftsPallet.item.mint({
            collectionId,
            itemId: 1, // manually specifying itemId, though it could also be auto-generated
            mintTo: account.address,
        }, buildOptions, signerAccount);
        console.log(`✅ NFT minted! Item ID: ${result.itemId}`);

        const metadataIpfsHash = "https://gateway.pinata.cloud/ipfs/bafybeifjmxn2o2pvhkuoop44llwfipu2a5hhar24dshl753kwaslfp7wmq/";

        // 🐣 Step 4: Set the metadata URI for the newly created collection
        console.log("📝 Setting collection metadata URI...");
        const collectionMetadataUri = `ipfs://ipfs/${metadataIpfsHash}/collection_metadata.json`;
        await sdk.nftsPallet.collection.setMetadata({
            collectionId,
            data: collectionMetadataUri,
        }, buildOptions, signerAccount);
        console.log(`🔗 Collection metadata URI: ${collectionMetadataUri}`);

    };

    return (
        <div>
            <Button onClick={createNFT}>Create NFT Collection</Button>
        </div>
    )

};

export default CreateNFTCollection;