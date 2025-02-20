"use client"

/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from "next/link"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { useSdkContext } from "@/web3/lib/sdk/UniqueSDKProvider"
import { useEffect, useState } from "react";

interface CardProps {
  itemId: number;
  collectionId: number;
}

export function ItemCard({ itemId, collectionId }: CardProps) {
  const { sdk } = useSdkContext()
  const [metadataLink, setMetadataLink] = useState<string>("");
  const [metadata, setMetadata] = useState<any>();

  const fetchItemMetadata = async () => {
    if (!sdk) return;

    const item = await sdk.nftsPallet.item.get({
      collectionId,
      itemId
    })
    if (item.metadata) {
      if (item.metadata.data.indexOf("token_metadata.json") === -1) {
        setMetadataLink(item.metadata?.data)
      }
    }
  };

  const fetchIpfsData = async (url: string) => {
    console.log(url)
    try {
      const response = await fetch(url);
      console.log(response)
      if (!response.ok) {
        throw new Error(`Error fetching IPFS data: ${response.statusText}`);
      }
      const ipfsData = await response.json();
      ipfsData.image = ipfsData.image.replace("ipfs://ipfs/", "https://gateway.pinata.cloud/ipfs/");
      setMetadata(ipfsData);
      console.log(ipfsData);
    } catch (error: any) {
      console.error(`Failed to fetch IPFS data: ${error.message}`);
    }
  };

  useEffect(() => {
    fetchItemMetadata();
  }, []);

  useEffect(() => {
    if (metadataLink) {
      const url = metadataLink.replace("ipfs://ipfs/", "https://gateway.pinata.cloud/ipfs/");
      fetchIpfsData(url);
    }
  }, [metadataLink]);

  return (
    <Link href={`/nft/${itemId}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
        <CardHeader className="p-0">
          <div className="aspect-square">
            {metadata ?
              <img src={metadata.image}
                alt={metadata.name}
                className="w-full h-full object-cover" />
              : <div className="p-2">Item: ${itemId}</div>}
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <h3 className="font-semibold text-lg text-slate-900">
            {metadata ? metadata.name : `Item: ${itemId}`}
          </h3>
          <p>
            {metadata ? metadata.description : ""}
          </p>
        </CardContent>
      </Card>
    </Link>
  )
}