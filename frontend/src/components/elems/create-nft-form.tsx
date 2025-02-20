"use client"

import { useForm } from "react-hook-form"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label" // Assuming you have a Label component

interface Attribute {
  trait_type: string
  value: string
}

interface FormValues {
  name: string
  description: string
  imageUrl: string
  attributes: Attribute[]
}

export function CreateNFTForm({ collectionId }: { collectionId: string }) {
  const { register, handleSubmit, watch, setValue, getValues, formState: { errors } } = useForm<FormValues>({
    defaultValues: {
      name: "",
      description: "",
      imageUrl: "",
      attributes: [{ trait_type: "", value: "" }],
    },
  })

  function onSubmit(values: FormValues) {
    console.log("Creating NFT:", { ...values, collectionId })
    // Handle NFT creation logic here
  }

  const addAttribute = () => {
    const currentAttributes = getValues("attributes")
    setValue("attributes", [
      ...currentAttributes,
      { trait_type: "", value: "" },
    ])
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <Label>NFT Name</Label>
        <Input {...register("name", { required: "Name is required" })} />
        {errors.name && <span>{errors.name.message}</span>}
      </div>

      <div>
        <Label>Description</Label>
        <Textarea {...register("description", { required: "Description is required" })} rows={4} />
        {errors.description && <span>{errors.description.message}</span>}
      </div>

      <div>
        <Label>NFT Image URL</Label>
        <Input {...register("imageUrl", { required: "Image URL is required", pattern: { value: /^(https?|chrome):\/\/[^\s$.?#].[^\s]*$/, message: "Must be a valid URL" } })} type="url" />
        {errors.imageUrl && <span>{errors.imageUrl.message}</span>}
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-medium text-slate-700">Attributes</h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addAttribute}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Attribute
          </Button>
        </div>
        <div className="space-y-4">
          {watch("attributes").map((_, index) => (
            <div key={index} className="grid grid-cols-2 gap-4">
              <div>
                <Label>Trait Type</Label>
                <Input {...register(`attributes.${index}.trait_type`, { required: "Trait type is required" })} placeholder="Trait Type" />
                {errors.attributes?.[index]?.trait_type && <span>{errors.attributes[index].trait_type.message}</span>}
              </div>
              <div>
                <Label>Value</Label>
                <Input {...register(`attributes.${index}.value`, { required: "Value is required" })} placeholder="Value" />
                {errors.attributes?.[index]?.value && <span>{errors.attributes[index].value.message}</span>}
              </div>
            </div>
          ))}
        </div>
      </div>

      <Button type="submit" className="w-full">
        Create NFT
      </Button>
    </form>
  )
}