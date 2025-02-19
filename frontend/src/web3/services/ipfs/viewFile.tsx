/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import pinata from '@/web3/services/ipfs/pinata'; // Adjust the path as necessary

const ViewFile: React.FC = () => {
    const [imageSrc, setImageSrc] = React.useState<string | null>(null);

    const fetchFile = async () => {
        try {
            const response = await pinata.gateways.get("bafkreifonicu4kyvtae57pll6cjjdmpo6v4by6wabcrtmr2nr4sjkfycoa");
            const blob = response.data;
            const url = URL.createObjectURL(blob as Blob);
            setImageSrc(url);
        } catch (err: any) {
            console.log(err)
        } finally {
        }
    };

    return (
        <div>
            <button onClick={fetchFile}>
                Fetch
            </button>
            {imageSrc && <img src={imageSrc} alt="Fetched from IPFS" />}
        </div>
    );
};

export default ViewFile;