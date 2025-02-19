"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

const attributeSchema = z.object({
    trait_type: z.string().min(1, "Trait type is required"),
    value: z.string().min(1, "Value is required"),
})

const formSchema = z.object({
    name: z.string().min(1, "Name is required"),
    description: z.string().min(1, "Description is required"),
    imageUrl: z.string().url("Must be a valid URL"),
    attributes: z.array(attributeSchema),
})

export function CreateNFTForm({ collectionId }: { collectionId: string }) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            description: "",
            imageUrl: "",
            attributes: [{ trait_type: "", value: "" }],
        },
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log("Creating NFT:", { ...values, collectionId })
        // Handle NFT creation logic here
    }

    const addAttribute = () => {
        const currentAttributes = form.getValues("attributes")
        form.setValue("attributes", [
            ...currentAttributes,
            { trait_type: "", value: "" },
        ])
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>NFT Name</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Textarea {...field} rows={4} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="imageUrl"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>NFT Image URL</FormLabel>
                            <FormControl>
                                <Input {...field} type="url" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

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
                        {form.watch("attributes").map((_, index) => (
                            <div key={index} className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name={`attributes.${index}.trait_type`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Input {...field} placeholder="Trait Type" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name={`attributes.${index}.value`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Input {...field} placeholder="Value" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                <Button type="submit" className="w-full">
                    Create NFT
                </Button>
            </form>
        </Form>
    )
}