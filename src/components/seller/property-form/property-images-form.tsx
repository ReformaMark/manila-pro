import { Button } from "@/components/ui/button"
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Loader2Icon, Upload, X } from "lucide-react"
import { useEffect, useState } from "react"
import { UseFormReturn } from "react-hook-form"
import { ReviewStepDialog } from "./review-step"
import { api } from "../../../../convex/_generated/api"
import { useMutation } from "convex/react"
import { toast } from "sonner"
import { z } from "zod"
import { PropertyFormSchema } from "@/lib/validations/property"

interface PropertyImagesFormProps {
    form: UseFormReturn<z.infer<typeof PropertyFormSchema>>
    displayImagePreview: string | null
    setDisplayImagePreview: React.Dispatch<React.SetStateAction<string | null>>
    otherImagePreviews: string[]
    setOtherImagePreviews: React.Dispatch<React.SetStateAction<string[]>>
}

export const PropertyImagesForm = ({
    form,
    displayImagePreview,
    otherImagePreviews,
    setDisplayImagePreview,
    setOtherImagePreviews,
}: PropertyImagesFormProps) => {
    const [isOpen, setIsOpen] = useState(false)
    const [isSingleImageUploading, setIsSingleImageUploading] = useState(false)
    const [isMultipleImagesUploading, setIsMultipleImagesUploading] = useState(false)
    const generateUploadUrl = useMutation(api.files.generateUploadUrl)

    const handleDisplayImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            toast.error("Please select an image file")
            return
        }

        if (file.size > 5 * 1024 * 1024) {
            toast.error("Image must be less than 5MB")
            return
        }

        setIsSingleImageUploading(true)
        try {
            const postUrl = await generateUploadUrl()

            const result = await fetch(postUrl, {
                method: "POST",
                headers: { "Content-Type": file.type },
                body: file,
            })

            const { storageId } = await result.json()
            form.setValue("displayImage", storageId)
        } catch (error) {
            console.error("Upload error:", error)
        } finally {
            setIsSingleImageUploading(false)
        }

        if (file) {
            const previewUrl = URL.createObjectURL(file)
            setDisplayImagePreview(previewUrl)
        }
    }

    const handleOtherImagesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (!files || files.length === 0) return

        setIsMultipleImagesUploading(true)
        try {
            const uploadPromises = Array.from(files).map(async (file) => {
                const postUrl = await generateUploadUrl()

                const result = await fetch(postUrl, {
                    method: "POST",
                    headers: { "Content-Type": file.type },
                    body: file,
                });

                const { storageId } = await result.json();
                const previewUrl = URL.createObjectURL(file);

                return { storageId, previewUrl };
            })

            const uploadResults = await Promise.all(uploadPromises)

            const newPreviews = uploadResults.map(result => result.previewUrl)
            const newStorageIds = uploadResults.map(result => result.storageId)

            const existingImages = form.getValues("otherImage") || [];

            setOtherImagePreviews(prev => [...prev, ...newPreviews]);
            form.setValue("otherImage", [...existingImages, ...newStorageIds])

        } catch (error) {
            console.error("Upload error:", error);
            toast.error("Failed to upload images");
        } finally {
            setIsMultipleImagesUploading(false)
        }
    }

    const removeOtherImage = (index: number) => {
        const updatedPreviews = [...otherImagePreviews]
        updatedPreviews.splice(index, 1)
        setOtherImagePreviews(updatedPreviews)

        const updatedUrls = [...(form.getValues("otherImage") ?? [])]
        updatedUrls.splice(index, 1)
        form.setValue("otherImage", updatedUrls)
    }

    const removeDisplayImage = () => {
        setDisplayImagePreview(null)
        form.setValue("displayImage", "")
    }

    // useEffect(() => {
    //     return () => {
    //         otherImagePreviews.forEach(URL.revokeObjectURL);
    //         if (displayImagePreview) {
    //             URL.revokeObjectURL(displayImagePreview);
    //         }
    //     };
    // }, [otherImagePreviews, displayImagePreview]);

    return (
        <>
            <div className="space-y-6">
                <div>
                    <div className="flex justify-between">
                        <h2 className="text-xl font-semibold text-orange-800 mb-4">Property Images</h2>
                        <Button
                            type="button"
                            variant="outline"
                            className="text-orange-800 border-orange-200"
                            onClick={() => setIsOpen(true)}
                        >
                            Review
                        </Button>
                    </div>
                    <p className="text-muted-foreground mb-6">
                        Upload high-quality images of your property to attract potential buyers.
                    </p>
                </div>

                <FormField
                    control={form.control}
                    name="displayImage"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Main Display Image</FormLabel>
                            <FormControl>
                                <div className="space-y-4">
                                    {!displayImagePreview ? (
                                        <>
                                            {isSingleImageUploading ? (
                                                <div className="flex flex-col items-center justify-center">
                                                    <Loader2Icon className="animate-spin w-6 h-6" />
                                                    <p className="text-muted-foreground">Please wait while we are uploading your image!</p>
                                                </div>
                                            ) : (
                                                <div className="flex items-center justify-center w-full">
                                                    <label
                                                        htmlFor="display-image-upload"
                                                        className="flex flex-col items-center justify-center w-full h-64 border-2 border-orange-200 border-dashed rounded-lg cursor-pointer bg-orange-50 hover:bg-orange-100 transition-colors"
                                                    >
                                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                            <Upload className="w-10 h-10 mb-3 text-orange-500" />
                                                            <p className="mb-2 text-sm text-orange-700">
                                                                <span className="font-semibold">Click to upload</span> or drag and drop
                                                            </p>
                                                            <p className="text-xs text-muted-foreground">PNG, JPG or WEBP (MAX. 5MB)</p>
                                                        </div>
                                                        <input
                                                            id="display-image-upload"
                                                            type="file"
                                                            accept="image/*"
                                                            className="hidden"
                                                            onChange={handleDisplayImageUpload}
                                                        />
                                                    </label>
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <div className="relative">
                                            <img
                                                src={displayImagePreview || "/placeholder.svg"}
                                                alt="Property display"
                                                className="w-full h-64 object-cover rounded-lg"
                                            />
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                size="icon"
                                                className="absolute top-2 right-2"
                                                onClick={removeDisplayImage}
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </FormControl>
                            <FormDescription>
                                {!isSingleImageUploading && "This will be the main image shown in property listings."}
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="otherImage"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Additional Images</FormLabel>
                            <FormControl>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-center w-full">
                                        <label
                                            htmlFor="other-images-upload"
                                            className="flex flex-col items-center justify-center w-full h-32 border-2 border-orange-200 border-dashed rounded-lg cursor-pointer bg-orange-50 hover:bg-orange-100 transition-colors"
                                        >
                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                {isMultipleImagesUploading ? (
                                                    <div className="flex flex-col items-center justify-center">
                                                        <Loader2Icon className="animate-spin w-6 h-6" />
                                                        <p className="text-muted-foreground">Uploading images...</p>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <Upload className="w-8 h-8 mb-2 text-orange-500" />
                                                        <p className="text-sm text-orange-700">Upload additional images</p>
                                                    </>
                                                )}
                                            </div>
                                            <input
                                                id="other-images-upload"
                                                type="file"
                                                accept="image/*"
                                                multiple
                                                className="hidden"
                                                disabled={isMultipleImagesUploading}
                                                onChange={handleOtherImagesUpload}
                                            />
                                        </label>
                                    </div>

                                    {otherImagePreviews.length > 0 && (
                                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
                                            {otherImagePreviews.map((preview, index) => (
                                                <div key={index} className="relative group">
                                                    <img
                                                        src={preview || "/placeholder.svg"}
                                                        alt={`Property image ${index + 1}`}
                                                        className="w-full h-24 object-cover rounded-lg"
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant="destructive"
                                                        size="icon"
                                                        className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                                        onClick={() => removeOtherImage(index)}
                                                    >
                                                        <X className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </FormControl>
                            <FormDescription>Upload additional images to showcase different areas of your property.</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </div>

            <ReviewStepDialog
                form={form}
                isOpen={isOpen}
                onChange={setIsOpen}
            />
        </>
    )
}