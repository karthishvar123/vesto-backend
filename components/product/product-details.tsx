"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProductMedia } from "./product-media";

interface ProductDetailsProps {
    formData: any;
    setFormData: (data: any) => void;
}

export function ProductDetails({ formData, setFormData }: ProductDetailsProps) {

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setFormData({ ...formData, [id]: value });
    };

    const setImages = (newImages: string[]) => {
        setFormData({ ...formData, images: newImages });
    };

    return (
        <div className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>Product Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="name">Product Name</Label>
                        <Input
                            id="name"
                            placeholder="e.g. Classic White T-Shirt"
                            value={formData.name}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="affiliateLink">Affiliate Link</Label>
                        <Input
                            id="affiliateLink"
                            placeholder="e.g. https://amazon.com/..."
                            value={formData.affiliateLink || ""}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <textarea
                            id="description"
                            className="flex min-h-[120px] w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            placeholder="Describe your product..."
                            value={formData.description}
                            onChange={handleChange}
                        />
                    </div>
                </CardContent>
            </Card>

            <ProductMedia images={formData.images || []} setImages={setImages} />

            <Card>
                <CardHeader>
                    <CardTitle>Pricing</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="price">Price (₹)</Label>
                            <Input
                                id="price"
                                type="number"
                                placeholder="0.00"
                                value={formData.price}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
