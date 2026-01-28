"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, X, GripVertical, Loader2 } from "lucide-react";
import { useState, useRef } from "react";
import Image from "next/image";
import { storage } from "@/lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ProductMediaProps {
    images: string[];
    setImages: (images: string[]) => void;
}

export function ProductMedia({ images, setImages }: ProductMediaProps) {
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setUploading(true);
        const newImages: string[] = [];

        try {
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const storageRef = ref(storage, `products/${Date.now()}-${file.name}`);
                const snapshot = await uploadBytes(storageRef, file);
                const url = await getDownloadURL(snapshot.ref);
                newImages.push(url);
            }
            setImages([...images, ...newImages]);
            toast.success("Images uploaded successfully");
        } catch (error) {
            console.error(error);
            toast.error("Failed to upload images");
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    const removeImage = (index: number) => {
        const newImages = [...images];
        newImages.splice(index, 1);
        setImages(newImages);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Media</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Upload Zone */}
                <div
                    onClick={() => fileInputRef.current?.click()}
                    className={cn(
                        "border-2 border-dashed border-gray-200 rounded-lg p-10 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition-colors cursor-pointer",
                        uploading && "opacity-50 pointer-events-none"
                    )}
                >
                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        multiple
                        accept="image/*"
                        onChange={handleUpload}
                    />
                    <div className="p-3 bg-gray-100 rounded-full mb-3">
                        {uploading ? <Loader2 className="h-6 w-6 animate-spin text-gray-500" /> : <Upload className="h-6 w-6 text-gray-500" />}
                    </div>
                    <p className="text-sm font-medium text-gray-900">
                        {uploading ? "Uploading..." : "Click to upload or drag and drop"}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">SVG, PNG, JPG or GIF (max. 800x400px)</p>
                </div>

                {/* Image Grid */}
                {images.length > 0 && (
                    <div className="space-y-2">
                        <h4 className="text-sm font-medium text-gray-700">Images</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {images.map((img, idx) => (
                                <div key={idx} className="group relative aspect-square rounded-lg border border-gray-200 bg-gray-50 overflow-hidden">
                                    <Image
                                        src={img}
                                        alt="Product"
                                        fill
                                        className="object-cover"
                                    />
                                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            type="button"
                                            onClick={() => removeImage(idx)}
                                            className="p-1 bg-white/90 rounded-md shadow-sm border border-gray-200 hover:bg-red-50 hover:text-red-500"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </div>
                                    <div className="absolute bottom-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <div className="p-1 bg-white/90 rounded-md shadow-sm border border-gray-200 cursor-move">
                                            <GripVertical className="h-3 w-3 text-gray-500" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
