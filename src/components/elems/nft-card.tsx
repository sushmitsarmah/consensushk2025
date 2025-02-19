import Link from "next/link"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { NFT } from "@/types/nft"

interface NFTCardProps {
  nft: NFT
}

export function NFTCard({ nft }: NFTCardProps) {
  return (
    <Link href={`/nft/${nft.id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
        <CardHeader className="p-0">
          <div className="aspect-square">
            <img
              src={nft.imageUrl}
              alt={nft.name}
              className="w-full h-full object-cover"
            />
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <h3 className="font-semibold text-lg text-slate-900">{nft.name}</h3>
          <p className="mt-1 text-sm text-slate-500 line-clamp-2">
            {nft.description}
          </p>
        </CardContent>
      </Card>
    </Link>
  )
}