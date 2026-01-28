"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { ProductDetails } from "@/components/product/product-details";
import { ProductOrganization } from "@/components/product/product-organization";
import { toast } from "sonner";
import { useState } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function AddProductPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        images: [] as string[],
        active: true,
        productType: "",
        productStyle: "",
        activityType: "",
        baseColor: "",
        colorFamily: ""
    });

    const handleSave = async () => {
        if (!formData.name || !formData.price) {
            toast.error("Please fill in required fields (Name, Price)");
            return;
        }

        setLoading(true);
        try {
            await addDoc(collection(db, "products"), {
                ...formData,
                price: parseFloat(formData.price),
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            });
            toast.success("Product saved successfully!");
            // Optional: Redirect or reset
            // router.push("/products"); 
        } catch (error) {
            console.error(error);
            toast.error("Failed to save product");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="mb-8 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link
                        href="/"
                        className="rounded-full border border-gray-200 bg-white p-2 text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                    <h1 className="text-xl font-semibold text-gray-900">Add Product</h1>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" onClick={() => toast.info("Changes discarded")}>Discard</Button>
                    <Button onClick={handleSave} disabled={loading}>
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save Product
                    </Button>
                </div>
            </div>

            {/* Main Layout */}
            <div className="grid gap-8 lg:grid-cols-3">
                {/* Left Column - Product Details (2/3 width) */}
                <div className="lg:col-span-2 space-y-8">
                    <ProductDetails formData={formData} setFormData={setFormData} />
                </div>

                {/* Right Column - Organization (1/3 width) */}
                <div className="space-y-8">
                    <ProductOrganization formData={formData} setFormData={setFormData} />
                </div>
            </div>
        </div>
    );
}
