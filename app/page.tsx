"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Package, Loader2, Pencil, Trash2, CheckSquare, Square, ToggleLeft, ToggleRight, ShirtIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, useMemo } from "react";
import { db, storage } from "@/lib/firebase";
import { collection, getDocs, query, orderBy, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";
import Image from "next/image";
import { toast } from "sonner";

interface Product {
  id: string;
  name: string;
  price: number;
  images: string[];
  createdAt: any;
  productType?: string;
  productStyle?: string;
  baseColor?: string;
  brand?: string;
  active?: boolean;
}

const BASE_COLOR_DOTS: Record<string, string> = {
  neutral: "#9CA3AF",
  cool:    "#60A5FA",
  warm:    "#F59E0B",
  earthy:  "#92400E",
  multicolour: "#C084FC",
};

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulkLoading, setBulkLoading] = useState(false);

  // Filter state
  const [filterType, setFilterType] = useState<string>("");
  const [filterColor, setFilterColor] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("");

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      setProducts(snap.docs.map(d => ({ id: d.id, ...d.data() } as Product)));
    } catch (e) {
      console.error("Error fetching products:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  // Computed stats
  const stats = useMemo(() => ({
    total: products.length,
    active: products.filter(p => p.active).length,
    topwear: products.filter(p => p.productType === "topwear").length,
    bottomwear: products.filter(p => p.productType === "bottomwear").length,
    footwear: products.filter(p => p.productType === "footwear").length,
  }), [products]);

  // Filtered products
  const filtered = useMemo(() => products.filter(p => {
    if (filterType && p.productType !== filterType) return false;
    if (filterColor && p.baseColor !== filterColor) return false;
    if (filterStatus === "active" && !p.active) return false;
    if (filterStatus === "draft" && p.active) return false;
    return true;
  }), [products, filterType, filterColor, filterStatus]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      const productToDelete = products.find(p => p.id === id);
      if (productToDelete?.images) {
        const deletePromises = productToDelete.images.map(url => {
          try { return deleteObject(ref(storage, url)); } catch { return Promise.resolve(); }
        });
        await Promise.allSettled(deletePromises);
      }
      await deleteDoc(doc(db, "products", id));
      toast.success("Product deleted");
      fetchProducts();
    } catch (e) {
      console.error(e);
      toast.error("Failed to delete product");
    }
  };

  const toggleSelect = (id: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selected.size === filtered.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(filtered.map(p => p.id)));
    }
  };

  const handleBulkStatus = async (active: boolean) => {
    if (selected.size === 0) return;
    setBulkLoading(true);
    try {
      await Promise.all([...selected].map(id => updateDoc(doc(db, "products", id), { active })));
      toast.success(`${selected.size} product(s) ${active ? "activated" : "deactivated"}`);
      setSelected(new Set());
      fetchProducts();
    } catch (e) {
      toast.error("Bulk update failed");
    } finally {
      setBulkLoading(false);
    }
  };

  const handleBulkDelete = async () => {
    if (selected.size === 0) return;
    if (!confirm(`Delete ${selected.size} selected product(s)? This cannot be undone.`)) return;
    setBulkLoading(true);
    try {
      await Promise.all([...selected].map(id => deleteDoc(doc(db, "products", id))));
      toast.success(`${selected.size} product(s) deleted`);
      setSelected(new Set());
      fetchProducts();
    } catch (e) {
      toast.error("Bulk delete failed");
    } finally {
      setBulkLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-6 bg-gray-50/50">
      <div className="mx-auto max-w-7xl space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard</h1>
          <Link href="/products/add">
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Product
            </Button>
          </Link>
        </div>

        {/* Stat Cards */}
        <div className="grid gap-4 md:grid-cols-5">
          {[
            { label: "Total Products", value: stats.total, icon: <Package className="h-4 w-4 text-gray-500" />, color: "" },
            { label: "Active", value: stats.active, icon: <ToggleRight className="h-4 w-4 text-green-500" />, color: "text-green-600" },
            { label: "Topwear", value: stats.topwear, icon: <ShirtIcon className="h-4 w-4 text-blue-500" />, color: "" },
            { label: "Bottomwear", value: stats.bottomwear, icon: <ShirtIcon className="h-4 w-4 text-purple-500" />, color: "" },
            { label: "Footwear", value: stats.footwear, icon: <Package className="h-4 w-4 text-orange-500" />, color: "" },
          ].map(card => (
            <Card key={card.label}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">{card.label}</CardTitle>
                {card.icon}
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${card.color}`}>{loading ? "—" : card.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 items-center bg-white border border-gray-200 rounded-xl p-4">
          <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Filter:</span>
          
          <select
            value={filterType}
            onChange={e => setFilterType(e.target.value)}
            className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Types</option>
            <option value="topwear">Topwear</option>
            <option value="bottomwear">Bottomwear</option>
            <option value="footwear">Footwear</option>
          </select>

          <select
            value={filterColor}
            onChange={e => setFilterColor(e.target.value)}
            className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Colors</option>
            {Object.entries(BASE_COLOR_DOTS).map(([key, dot]) => (
              <option key={key} value={key} style={{ paddingLeft: "8px" }}>
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </option>
            ))}
          </select>

          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="draft">Draft</option>
          </select>

          {(filterType || filterColor || filterStatus) && (
            <button
              onClick={() => { setFilterType(""); setFilterColor(""); setFilterStatus(""); }}
              className="text-xs text-gray-400 hover:text-gray-700 underline"
            >
              Clear filters
            </button>
          )}

          <span className="ml-auto text-sm text-gray-400">{filtered.length} product{filtered.length !== 1 ? "s" : ""}</span>
        </div>

        {/* Bulk Actions Bar */}
        {selected.size > 0 && (
          <div className="flex items-center gap-3 bg-blue-50 border border-blue-200 rounded-xl px-4 py-3">
            <span className="text-sm font-semibold text-blue-700">{selected.size} selected</span>
            <Button size="sm" variant="outline" className="text-green-700 border-green-300 hover:bg-green-50" disabled={bulkLoading} onClick={() => handleBulkStatus(true)}>
              <ToggleRight className="h-4 w-4 mr-1" /> Activate
            </Button>
            <Button size="sm" variant="outline" className="text-gray-600 border-gray-300 hover:bg-gray-50" disabled={bulkLoading} onClick={() => handleBulkStatus(false)}>
              <ToggleLeft className="h-4 w-4 mr-1" /> Deactivate
            </Button>
            <Button size="sm" variant="destructive" className="bg-red-500 hover:bg-red-600" disabled={bulkLoading} onClick={handleBulkDelete}>
              <Trash2 className="h-4 w-4 mr-1" /> Delete
            </Button>
            <button onClick={() => setSelected(new Set())} className="ml-auto text-xs text-blue-400 hover:text-blue-700">
              Cancel
            </button>
          </div>
        )}

        {/* Products Grid */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Products</h2>
            {!loading && filtered.length > 0 && (
              <button
                onClick={toggleSelectAll}
                className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800"
              >
                {selected.size === filtered.length ? <CheckSquare className="h-4 w-4" /> : <Square className="h-4 w-4" />}
                {selected.size === filtered.length ? "Deselect all" : "Select all"}
              </button>
            )}
          </div>

          {loading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          ) : filtered.length === 0 ? (
            <Card className="flex flex-col items-center justify-center p-12 text-center">
              <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <Package className="h-6 w-6 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">No products found</h3>
              <p className="text-sm text-gray-500 mt-1 mb-6">
                {(filterType || filterColor || filterStatus) ? "Try clearing your filters." : "Add your first product to get started."}
              </p>
              <Link href="/products/add">
                <Button>Add Product</Button>
              </Link>
            </Card>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filtered.map((product) => {
                const isSelected = selected.has(product.id);
                return (
                  <Card
                    key={product.id}
                    className={`overflow-hidden bg-white hover:shadow-md transition-all group relative cursor-pointer ${isSelected ? "ring-2 ring-blue-500 shadow-md" : ""}`}
                  >
                    {/* Select checkbox */}
                    <button
                      onClick={() => toggleSelect(product.id)}
                      className="absolute top-2 left-2 z-10 w-7 h-7 rounded-md bg-white/90 backdrop-blur-sm border border-gray-200 flex items-center justify-center shadow-sm hover:bg-white transition-colors"
                    >
                      {isSelected ? (
                        <CheckSquare className="h-4 w-4 text-blue-600" />
                      ) : (
                        <Square className="h-4 w-4 text-gray-400" />
                      )}
                    </button>

                    {/* Active/Draft badge */}
                    <div className="absolute top-2 right-2 z-10">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${product.active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                        {product.active ? "Active" : "Draft"}
                      </span>
                    </div>

                    {/* Square image */}
                    <div className="aspect-square relative bg-gray-100">
                      {product.images?.[0] ? (
                        <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
                      ) : (
                        <div className="flex items-center justify-center h-full text-gray-400">
                          <Package className="h-8 w-8" />
                        </div>
                      )}

                      {/* Hover overlay */}
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

                    <CardContent className="p-3">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-semibold text-gray-900 text-sm truncate pr-2">{product.name}</h3>
                        <span className="text-sm font-bold text-gray-900 shrink-0">₹{product.price}</span>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        {product.productType && (
                          <span className="text-[10px] font-medium bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded capitalize">{product.productType}</span>
                        )}
                        {product.baseColor && (
                          <span className="flex items-center gap-1 text-[10px] font-medium text-gray-500">
                            <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: BASE_COLOR_DOTS[product.baseColor] || "#ccc" }} />
                            {product.baseColor}
                          </span>
                        )}
                        {product.brand && (
                          <span className="text-[10px] text-gray-400">{product.brand}</span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
