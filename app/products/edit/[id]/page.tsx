"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { ProductDetails } from "@/components/product/product-details";
import { ProductOrganization } from "@/components/product/product-organization";
import { toast } from "sonner";
import { useEffect, useState, use } from "react";
import { db, storage } from "@/lib/firebase";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";
import { useRouter } from "next/navigation";

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [productId, setProductId] = useState<string>("");
    const [initialImages, setInitialImages] = useState<string[]>([]);
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

    // Unwrap params using React 19's use() hook for Next.js 15+
    const resolvedParams = use(params);

    useEffect(() => {
        setProductId(decodeURIComponent(resolvedParams.id));
    }, [resolvedParams]);

    useEffect(() => {
        if (!productId) return;

        const fetchProduct = async () => {
            try {
                const docRef = doc(db, "products", productId);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();
                    const imgs = data.images || [];
                    setInitialImages(imgs);
                    setFormData({
                        name: data.name || "",
                        description: data.description || "",
                        price: data.price || "",
                        images: imgs,
                        active: data.active ?? true,
                        productType: data.productType || "",
                        productStyle: data.productStyle || "",
                        activityType: data.activityType || "",
                        baseColor: data.baseColor || "",
                        colorFamily: data.colorFamily || ""
                    });
                } else {
                    toast.error("Product not found");
                    router.push("/");
                }
            } catch (error) {
                console.error("Error fetching product:", error);
                toast.error("Failed to load product");
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [productId, router]);

    const handleUpdate = async () => {
        setSaving(true);
        try {
            // 1. Identify removed images
            const removedImages = initialImages.filter(img => !formData.images.includes(img));

            // 2. Delete from Storage
            const deletePromises = removedImages.map(async (imageUrl) => {
                try {
                    // Extract path from URL or Create Ref from URL
                    // Ref from URL is safer for firebase storage URLs
                    const imageRef = ref(storage, imageUrl);
                    await deleteObject(imageRef);
                } catch (err) {
                    console.error("Failed to delete image from storage:", imageUrl, err);
                    // We continue even if storage delete fails, to ensure DB update happens
                    // or we could throw. Ideally logging is enough here.
                }
            });

            await Promise.all(deletePromises);

            // 3. Update Firestore
            const docRef = doc(db, "products", productId);
            await updateDoc(docRef, {
                ...formData,
                price: parseFloat(formData.price),
                updatedAt: serverTimestamp()
            });

            // Update initial images to current state after successful save
            setInitialImages(formData.images);

            toast.success("Product updated successfully!");
        } catch (error) {
            console.error(error);
            toast.error("Failed to update product");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
            </div>
        );
    }

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
                    <h1 className="text-xl font-semibold text-gray-900">Edit Product</h1>
                </div>
                <div className="flex items-center gap-3">
                    <Link href="/">
                        <Button variant="outline">Cancel</Button>
                    </Link>
                    <Button onClick={handleUpdate} disabled={saving}>
                        {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Update Product
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
