"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { RichSelect } from "@/components/ui/rich-select";

interface ProductOrganizationProps {
    formData: any;
    setFormData: (data: any) => void;
}

export function ProductOrganization({ formData, setFormData }: ProductOrganizationProps) {

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { id, value } = e.target;
        setFormData({ ...formData, [id]: value });
    };

    const handleSwitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, active: e.target.checked });
    };

    return (
        <div className="space-y-8">
            {/* Status */}
            <Card>
                <CardHeader>
                    <CardTitle>Status</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label className="text-base">Active</Label>
                            <p className="text-sm text-gray-500">Product will be available for purchase.</p>
                        </div>
                        <Switch
                            checked={formData.active}
                            onChange={handleSwitchChange}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Organization */}
            <Card>
                <CardHeader>
                    <CardTitle>Organization</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label>Product Type</Label>
                        <Select id="productType" value={formData.productType} onChange={handleChange}>
                            <option value="">Select Type</option>
                            <option value="topwear">Topwear</option>
                            <option value="bottomwear">Bottomwear</option>
                            <option value="footwear">Footwear</option>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Product Style</Label>
                        <Select
                            id="productStyle"
                            value={formData.productStyle}
                            onChange={handleChange}
                            disabled={!formData.productType}
                        >
                            <option value="">Select Style</option>
                            {formData.productType === 'topwear' && (
                                <>
                                    <option value="t-shirt">T-Shirt</option>
                                    <option value="sweatshirt">Sweatshirt</option>
                                    <option value="jacket">Jacket</option>
                                    <option value="formal-shirt">Formal Shirt</option>
                                    <option value="casual-shirt">Casual Shirt</option>
                                    <option value="active-t-shirt">Active T-Shirt</option>
                                </>
                            )}
                            {formData.productType === 'bottomwear' && (
                                <>
                                    <option value="jeans">Jeans</option>
                                    <option value="trouser">Trouser</option>
                                    <option value="cotton-pant">Cotton Pant</option>
                                    <option value="track-pant">Track Pant</option>
                                    <option value="joggers">Joggers</option>
                                    <option value="shorts">Shorts</option>
                                </>
                            )}
                            {formData.productType === 'footwear' && (
                                <>
                                    <option value="casual-shoe">Casual Shoe</option>
                                    <option value="sneakers">Sneakers</option>
                                    <option value="formal-shoe">Formal Shoe</option>
                                    <option value="loafer">Loafer</option>
                                    <option value="sports-shoe">Sports Shoe</option>
                                </>
                            )}
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Activity Type</Label>
                        <Select id="activityType" value={formData.activityType} onChange={handleChange}>
                            <option value="">Select Activity</option>
                            <option value="casual">Casual</option>
                            <option value="formal">Formal</option>
                            <option value="sports">Sports</option>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Base Color</Label>
                        <Select id="baseColor" value={formData.baseColor} onChange={handleChange}>
                            <option value="">Select Category</option>
                            <option value="neutral">Neutral</option>
                            <option value="earthy">Earthy</option>
                            <option value="cool">Cool</option>
                            <option value="warm">Warm</option>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Color Family</Label>
                        <RichSelect
                            id="colorFamily"
                            value={formData.colorFamily}
                            onChange={(val) => setFormData({ ...formData, colorFamily: val })}
                            disabled={!formData.baseColor}
                            placeholder="Select Color"
                            options={[
                                // Neutral
                                { value: "black", label: "Black", color: "#000000" },
                                { value: "white", label: "White", color: "#FFFFFF" },
                                { value: "off-white", label: "Off-White", color: "#F8F8F8" },
                                { value: "ivory", label: "Ivory", color: "#FFFFF0" },
                                { value: "grey", label: "Grey", color: "#808080" },
                                { value: "charcoal", label: "Charcoal", color: "#36454F" },
                                { value: "stone", label: "Stone", color: "#888C8D" },
                                { value: "ash", label: "Ash", color: "#B2BEB5" },
                                { value: "cream", label: "Cream", color: "#FFFDD0" },
                                { value: "ecru", label: "Ecru", color: "#C2B280" },
                                { value: "taupe", label: "Taupe", color: "#483C32" },
                                { value: "mushroom", label: "Mushroom", color: "#BE9E8B" },
                                { value: "sand", label: "Sand", color: "#C2B280" },
                                { value: "pebble", label: "Pebble", color: "#C0C0C0" },
                                { value: "smoke", label: "Smoke", color: "#848884" },
                                { value: "silver", label: "Silver", color: "#C0C0C0" },
                                // Earthy
                                { value: "olive", label: "Olive", color: "#808000" },
                                { value: "khaki", label: "Khaki", color: "#F0E68C" },
                                { value: "beige", label: "Beige", color: "#F5F5DC" },
                                { value: "tan", label: "Tan", color: "#D2B48C" },
                                { value: "camel", label: "Camel", color: "#C19A6B" },
                                { value: "brown", label: "Brown", color: "#A52A2A" },
                                { value: "mocha", label: "Mocha", color: "#967969" },
                                { value: "coffee", label: "Coffee", color: "#6F4E37" },
                                { value: "chocolate", label: "Chocolate", color: "#D2691E" },
                                { value: "bark", label: "Bark", color: "#3C2825" },
                                { value: "clay", label: "Clay", color: "#B66A50" },
                                { value: "soil", label: "Soil", color: "#4E342E" },
                                { value: "walnut", label: "Walnut", color: "#773F1A" },
                                { value: "cork", label: "Cork", color: "#987654" },
                                { value: "latte", label: "Latte", color: "#C5A582" },
                                // Cool
                                { value: "navy", label: "Navy", color: "#000080" },
                                { value: "midnight-blue", label: "Midnight Blue", color: "#191970" },
                                { value: "indigo", label: "Indigo", color: "#4B0082" },
                                { value: "blue", label: "Blue", color: "#0000FF" },
                                { value: "light-blue", label: "Light Blue", color: "#ADD8E6" },
                                { value: "teal", label: "Teal", color: "#008080" },
                                { value: "steel-blue", label: "Steel Blue", color: "#4682B4" },
                                { value: "slate-blue", label: "Slate Blue", color: "#6A5ACD" },
                                { value: "denim", label: "Denim", color: "#1560BD" },
                                { value: "ice-blue", label: "Ice Blue", color: "#AFDBF5" },
                                { value: "sky-blue", label: "Sky Blue", color: "#87CEEB" },
                                { value: "cyan", label: "Cyan", color: "#00FFFF" },
                                // Warm
                                { value: "maroon", label: "Maroon", color: "#800000" },
                                { value: "burgundy", label: "Burgundy", color: "#800020" },
                                { value: "rust", label: "Rust", color: "#B7410E" },
                                { value: "terracotta", label: "Terracotta", color: "#E2725B" },
                                { value: "mustard", label: "Mustard", color: "#FFDB58" },
                                { value: "brick", label: "Brick", color: "#CB4154" },
                                { value: "wine", label: "Wine", color: "#722F37" },
                                { value: "copper", label: "Copper", color: "#B87333" },
                                { value: "paprika", label: "Paprika", color: "#8D021F" },
                                { value: "saffron", label: "Saffron", color: "#F4C430" },
                                { value: "ochre", label: "Ochre", color: "#CC7722" },
                                { value: "amber", label: "Amber", color: "#FFBF00" },
                            ].filter(opt => {
                                if (formData.baseColor === 'neutral') return ["black", "white", "off-white", "ivory", "grey", "charcoal", "stone", "ash", "cream", "ecru", "taupe", "mushroom", "sand", "pebble", "smoke", "silver"].includes(opt.value);
                                if (formData.baseColor === 'earthy') return ["olive", "khaki", "beige", "tan", "camel", "brown", "mocha", "coffee", "chocolate", "bark", "clay", "soil", "walnut", "cork", "latte"].includes(opt.value);
                                if (formData.baseColor === 'cool') return ["navy", "midnight-blue", "indigo", "blue", "light-blue", "teal", "steel-blue", "slate-blue", "denim", "ice-blue", "sky-blue", "cyan"].includes(opt.value);
                                if (formData.baseColor === 'warm') return ["maroon", "burgundy", "rust", "terracotta", "mustard", "brick", "wine", "copper", "paprika", "saffron", "ochre", "amber"].includes(opt.value);
                                return false;
                            })}
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
