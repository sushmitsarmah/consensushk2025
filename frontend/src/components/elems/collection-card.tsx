import Link from "next/link"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

interface CardProps {
  id: number
}

export function CollectionCard({ id }: CardProps) {
  return (
    <Link href={`/collection/${id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
        <CardHeader className="p-0">
          <div className="aspect-square">
            Collection: {id}
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <h3 className="font-semibold text-lg text-slate-900">Collection: {id}</h3>
        </CardContent>
      </Card>
    </Link>
  )
}