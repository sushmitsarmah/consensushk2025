import { CreateNFTForm } from "@/components/elems/create-nft-form"

export default function CreateNFTPage({ params }: { params: { collectionId: string } }) {
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-slate-900 mb-8">Create NFT</h1>
      <CreateNFTForm collectionId={params.collectionId} />
    </div>
  )
}