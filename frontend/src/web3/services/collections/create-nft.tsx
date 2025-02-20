"use client"
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
import ImageUploader from "@/web3/services/ipfs/uploadImage"
import { useState } from "react";
import Image from "next/image";
import { uploadMetadata } from "@/web3/services/ipfs/pinata"
import AudioUploader from "../ipfs/uploadAudio";

interface CreateNFTProps {
    collectionId: number;
    items: number;
};

const CreateNFT = ({ collectionId, items }: CreateNFTProps) => {
    const { sdk } = useSdkContext();
    const accountContext = useAccountsContext();
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false); // State to control modal visibility
    const [imageUrl, setImageUrl] = useState<string>("");
    const [audioUrl, setAudioUrl] = useState<string>(""); // State to store audio file URL
    const [audioDesc, setAudioDesc] = useState<string>(""); // State to store audio file URL

    const [nftData, setNftData] = useState({
        name: '',
        description: '',
        external_url: '',
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
        setIsModalOpen(false);

        if (!sdk || !accountContext?.activeAccount) return;

        // OPENSEA STANDARD
        // https://docs.opensea.io/docs/metadata-standards
        const formParameters = {
            name: nftData.name,
            description: nftData.description,
            image: `ipfs://ipfs/${imageUrl}`, // Ensure image is set correctly
            external_url: nftData.external_url, // Optional field
            attributes: [
                ...nftData.attributes,
                { trait_type: 'audio', value: `ipfs://ipfs/${audioUrl}` }, // Custom attribute for audio file
                { trait_type: 'audio_description', value: audioDesc } // Custom attribute for audio file description
            ]
        };
        console.log("Form Parameters:", formParameters);

        const metadataIpfsHash = await uploadMetadata(formParameters);
        console.log(metadataIpfsHash)

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

        console.log(`🚀 Minting a new NFT in collection #${collectionId}...`);

        const itemId = items + 1;
        const { result } = await sdk.nftsPallet.item.mint({
            collectionId,
            itemId, // manually specifying itemId, though it could also be auto-generated
            mintTo: account.address,
        }, buildOptions, signerAccount);
        console.log(`✅ NFT minted! Item ID: ${result.itemId}`);

        // 🐣 Step 4: Set the metadata URI for the newly created collection
        console.log("📝 Setting item metadata URI...");
        await sdk.nftsPallet.item.setMetadata({
            collectionId,
            data: metadataIpfsHash as string,
            itemId: result.itemId
        }, buildOptions, signerAccount);
        console.log(`🔗 Item metadata URI: ${metadataIpfsHash}`);
    };

    const getAudioType = (url: string) => {
        const extension = url.split('.').pop();
        return `audio/${extension}`;
    };

    return (
        <div>
            <Button onClick={() => setIsModalOpen(true)}>Create new NFT</Button>
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
                        <form onSubmit={(e) => { e.preventDefault(); createCollectionItem() }} className="flex flex-col gap-4">
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
                            <ImageUploader setImageUrl={setImageUrl} />
                            <input type="hidden" name="image" value={imageUrl} />
                            {imageUrl && <Image width={100} height={100} src={`https://gateway.pinata.cloud/ipfs/${imageUrl}`} alt="Uploaded Image" />}

                            <Label htmlFor="external_url">External URL:</Label>
                            <Input
                                type="text"
                                id="external_url"
                                name="external_url"
                                value={nftData.external_url}
                                onChange={handleInputChange}
                            />

                            <Label htmlFor="audio">Audio URL:</Label>
                            <Input
                                type="text"
                                id="audio"
                                name="audio"
                                value={audioUrl}
                                onChange={(e) => setAudioUrl(e.target.value)}
                            />
                            <AudioUploader setAudioUrl={setAudioUrl} />
                            {audioUrl && (
                                <audio controls>
                                    <source src={`https://gateway.pinata.cloud/ipfs/${audioUrl}`} type={getAudioType(audioUrl)} />
                                    Your browser does not support the audio element.
                                </audio>
                            )}
                            <Label htmlFor="audio_description">Audio Description:</Label>
                            <Input
                                type="text"
                                name="audio_description"
                                value={audioDesc}
                                onChange={(e) => setAudioDesc(e.target.value)}
                            />

                            <Label htmlFor="external_url">Attributes:</Label>
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