
/* eslint-disable @typescript-eslint/no-explicit-any */

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSdkContext } from "@/web3/lib/sdk/UniqueSDKProvider";
import { useAccountsContext } from "@/web3/lib/wallets/AccountsProvider";
import { useState } from "react";
// import { Sr25519Account } from "@unique-nft/sr25519";

interface CreateNFTProps {
    collectionId: number;
    items: number;
};

const CreateNFT = ({ collectionId, items }: CreateNFTProps) => {
    const { sdk } = useSdkContext();
    const accountContext = useAccountsContext();
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false); // State to control modal visibility

    const [nftData, setNftData] = useState({
        name: '',
        description: '',
        image: '',
        type: '',
        attributes: [{ trait_type: '', value: '' }]
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNftData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleAttributeChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const newAttributes = [...nftData.attributes];
        newAttributes[index] = { ...newAttributes[index], [name]: value };
        setNftData(prevState => ({
            ...prevState,
            attributes: newAttributes
        }));
    };

    const addAttribute = () => {
        setNftData(prevState => ({
            ...prevState,
            attributes: [...prevState.attributes, { trait_type: '', value: '' }]
        }));
    };

    const createCollectionItem = async () => {
        if (!sdk || !accountContext?.activeAccount) return;

        console.log('!!!!!!!!')
        const account = accountContext?.activeAccount;

        // 🐣 Step 3: Create a new collection on AssetHub
        // console.log("🚀 Creating a new NFT collection on AssetHub...");
        const buildOptions = { signerAddress: account.address };
        const signerAccount = {
            signer: {
                sign : accountContext.activeAccount.signer.sign as any
            },
            address: account.address
        };

        console.log(`🚀 Minting a new NFT in collection #${collectionId}...`);

        const itemId = items + 1;
        const { result } = await sdk.nftsPallet.item.mint({
            collectionId,
            itemId, // manually specifying itemId, though it could also be auto-generated
            mintTo: account.address,
        }, buildOptions, signerAccount);
        console.log(`✅ NFT minted! Item ID: ${result.itemId}`);

        const metadataIpfsHash = "https://gateway.pinata.cloud/ipfs/bafybeifjmxn2o2pvhkuoop44llwfipu2a5hhar24dshl753kwaslfp7wmq/";

        // 🐣 Step 4: Set the metadata URI for the newly created collection
        console.log("📝 Setting item metadata URI...");
        const itemMetadataUri = `ipfs://ipfs/${metadataIpfsHash}/token_metadata.json`;
        await sdk.nftsPallet.item.setMetadata({
            collectionId,
            data: itemMetadataUri,
            itemId: result.itemId
        }, buildOptions, signerAccount);
        console.log(`🔗 Item metadata URI: ${itemMetadataUri}`);
    };

    return (
        <div>
            <Button onClick={createCollectionItem}>Create new NFT</Button>
            {/* <Button onClick={() => setIsModalOpen(true)}>Create new NFT</Button> */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            <div>
                                <h1>Create NFT Collection</h1>
                            </div>
                        </DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <form onSubmit={createCollectionItem} className="flex flex-col gap-4">
                            <Label htmlFor="name">NFT Name:</Label>
                            <Input
                                type="text"
                                id="name"
                                name="name"
                                value={nftData.name}
                                onChange={handleInputChange}
                            />
                            <Label htmlFor="description">Description:</Label>
                            <Input
                                type="text"
                                id="description"
                                name="description"
                                value={nftData.description}
                                onChange={handleInputChange}
                            />
                            <Label htmlFor="image">Image URL:</Label>
                            <Input
                                type="text"
                                id="image"
                                name="image"
                                value={nftData.image}
                                onChange={handleInputChange}
                            />
                            <Label htmlFor="type">Type:</Label>
                            <Input
                                type="text"
                                id="type"
                                name="type"
                                value={nftData.type}
                                onChange={handleInputChange}
                            />
                            {nftData.attributes.map((attribute, index) => (
                                <div key={index} className="flex gap-2">
                                    <Input
                                        type="text"
                                        name="trait_type"
                                        placeholder="Trait Type"
                                        value={attribute.trait_type}
                                        onChange={(e) => handleAttributeChange(index, e)}
                                    />
                                    <Input
                                        type="text"
                                        name="value"
                                        placeholder="Value"
                                        value={attribute.value}
                                        onChange={(e) => handleAttributeChange(index, e)}
                                    />
                                </div>
                            ))}
                            <Button type="button" onClick={addAttribute}>Add Attribute</Button>
                            <Button type="submit">Create NFT Collection</Button>
                        </form>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )

};

export default CreateNFT;