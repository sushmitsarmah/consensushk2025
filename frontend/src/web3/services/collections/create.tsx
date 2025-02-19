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

const CreateNFTCollection = () => {
    const { sdk } = useSdkContext();
    const accountContext = useAccountsContext();
    const [maxSupply, setMaxSupply] = useState<number>(10); // Default value
    const [name, setName] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [image, setImage] = useState<string>("");
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false); // State to control modal visibility

    const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value);
    };

    const handleDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDescription(event.target.value);
    };

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setImage(event.target.value);
    };

    const handleMaxSupplyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setMaxSupply(Number(event.target.value));
    };

    const createNFTCollection = async (e: any) => {
        e.preventDefault();

        if (!sdk || !accountContext?.activeAccount) return;

        const account = accountContext?.activeAccount;
        const buildOptions = { signerAddress: account.address };
        const signerAccount = {
            signer: {
                sign: accountContext.activeAccount.signer.sign as any
            },
            address: account.address
        };
        const opts = {
            collectionConfig: { maxSupply }
        };
        const collectionResult = await sdk.nftsPallet.collection.create(opts, buildOptions, signerAccount);

        const collectionId = collectionResult.result.collectionId;
        console.log(`✅ Collection created! Collection ID: ${collectionId}`);

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
            <Button onClick={() => setIsModalOpen(true)}>Create new collection</Button>
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
                        <form onSubmit={createNFTCollection} className="flex flex-col gap-4">
                            <Label htmlFor="name">Name:</Label>
                            <Input
                                type="text"
                                id="name"
                                value={name}
                                onChange={handleNameChange}
                            />
                            <Label htmlFor="description">Description:</Label>
                            <Input
                                type="text"
                                id="description"
                                value={description}
                                onChange={handleDescriptionChange}
                            />
                            <Label htmlFor="image">Image URL:</Label>
                            <Input
                                type="text"
                                id="image"
                                value={image}
                                onChange={handleImageChange}
                            />
                            <Label htmlFor="maxSupply">Max Supply:</Label>
                            <Input
                                type="number"
                                id="maxSupply"
                                value={maxSupply}
                                onChange={handleMaxSupplyChange}
                                min="1"
                            />
                            <Button type="submit">Create NFT Collection</Button>
                        </form>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )

};

export default CreateNFTCollection;