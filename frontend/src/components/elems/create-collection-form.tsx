"use client"

import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

interface FormValues {
  name: string
  description: string
  imageUrl: string
}

export function CreateCollectionForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    defaultValues: {
      name: "",
      description: "",
      imageUrl: "",
    },
  })

  function onSubmit(values: FormValues) {
    console.log("Creating collection:", values)
    // Handle collection creation logic here
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <Label>Collection Name</Label>
        <Input {...register("name", { required: "Name is required" })} />
        {errors.name && <span>{errors.name.message}</span>}
      </div>

      <div>
        <Label>Description</Label>
        <Textarea {...register("description", { required: "Description is required" })} rows={4} />
        {errors.description && <span>{errors.description.message}</span>}
      </div>

      <div>
        <Label>Collection Image URL</Label>
        <Input {...register("imageUrl", { required: "Image URL is required", pattern: { value: /^(https?|chrome):\/\/[^\s$.?#].[^\s]*$/, message: "Must be a valid URL" } })} type="url" />
        {errors.imageUrl && <span>{errors.imageUrl.message}</span>}
      </div>

      <Button type="submit" className="w-full">
        Create Collection
      </Button>
    </form>
  )
}