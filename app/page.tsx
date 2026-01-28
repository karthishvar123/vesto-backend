"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Package, Loader2, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { db, storage } from "@/lib/firebase";
import { collection, getDocs, query, orderBy, deleteDoc, doc } from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";
import Image from "next/image";
import { toast } from "sonner";

interface Product {
  id: string;
  name: string;
  price: number;
  images: string[];
  createdAt: any;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalProducts, setTotalProducts] = useState(0);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const fetchedProducts: Product[] = [];
      querySnapshot.forEach((doc) => {
        fetchedProducts.push({ id: doc.id, ...doc.data() } as Product);
      });
      setProducts(fetchedProducts);
      setTotalProducts(fetchedProducts.length);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      // 1. Get the product to find its images
      const productToDelete = products.find(p => p.id === id);
      if (productToDelete && productToDelete.images) {
        // 2. Delete each image from Storage
        const deletePromises = productToDelete.images.map(imageUrl => {
          try {
            const imageRef = ref(storage, imageUrl);
            return deleteObject(imageRef);
          } catch (err) {
            console.error("Error creating ref for image:", imageUrl, err);
            return Promise.resolve();
          }
        });
        await Promise.allSettled(deletePromises);
      }

      // 3. Delete from Firestore
      await deleteDoc(doc(db, "products", id));

      toast.success("Product and images deleted successfully");
      fetchProducts(); // Refresh list
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product");
    }
  };

  return (
    <main className="min-h-screen p-8 bg-gray-50/50">
      <div className="mx-auto max-w-5xl space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard</h1>
          <Link href="/products/add">
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Product
            </Button>
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {/* Stats Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Products</CardTitle>
              <Package className="h-4 w-4 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? "..." : totalProducts}</div>
              <p className="text-xs text-gray-500">Active inventory items</p>
            </CardContent>
          </Card>
        </div>

        {/* Products List */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">Recent Products</h2>

          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          ) : products.length === 0 ? (
            <Card className="flex flex-col items-center justify-center p-12 text-center">
              <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <Package className="h-6 w-6 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">No products yet</h3>
              <p className="text-sm text-gray-500 max-w-sm mt-1 mb-6">
                Get started by adding your first product to the inventory.
              </p>
              <Link href="/products/add">
                <Button>Add Product</Button>
              </Link>
            </Card>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <Card key={product.id} className="overflow-hidden bg-white hover:shadow-md transition-shadow group relative">
                  <div className="aspect-video relative bg-gray-100">
                    {product.images && product.images[0] ? (
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-400">
                        <Package className="h-8 w-8" />
                      </div>
                    )}

                    {/* Overlay Actions */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <Link href={`/products/edit/${encodeURIComponent(product.id)}`}>
                        <Button size="icon" variant="secondary" className="h-9 w-9 bg-white/90 hover:bg-white text-gray-900 border-none">
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button
                        size="icon"
                        variant="destructive"
                        className="h-9 w-9 bg-red-500/90 hover:bg-red-600 border-none"
                        onClick={() => handleDelete(product.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium text-gray-900 truncate pr-2">{product.name}</h3>
                      <span className="text-sm font-semibold">₹{product.price}</span>
                    </div>
                    <p className="text-xs text-gray-500 font-mono">ID: {product.id.slice(0, 8)}...</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
