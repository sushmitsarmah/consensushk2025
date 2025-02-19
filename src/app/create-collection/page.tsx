import { CreateCollectionForm } from "@/components/elems/create-collection-form"

export default function CreateCollectionPage() {
    return (
        <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold text-slate-900 mb-8">
                Create NFT Collection
            </h1>
            <CreateCollectionForm />
        </div>
    )
}