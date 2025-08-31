"use client";

import type React from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useMerchantCreateProduct } from "@/lib/services/products/use-merchant-create-product";
import { uploadMedia } from "@/lib/services/upload/useUploadMedia";
import { Eye, FileText, ImageIcon, Plus, Save, Upload, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const categories = [
  "Phones and Tablets",
  "Computing",
  "Electronics",
  "Generators",
  "Accessories",
  "Home & Kitchen",
  "Lifestyle",
  "Watches",
  "Premium Devices",
];

const brands = [
  "Apple",
  "Samsung",
  "Google",
  "OnePlus",
  "Xiaomi",
  "Huawei",
  "Dell",
  "HP",
  "Lenovo",
  "Asus",
  "Acer",
  "Microsoft",
  "Sony",
  "LG",
  "Panasonic",
  "Philips",
  "Bosch",
  "Nike",
  "Adidas",
  "Puma",
  "Under Armour",
  "Generic",
  "Other",
];

export default function ProductUploadAdminPage() {
  const [activeTab, setActiveTab] = useState("form");
  const [isLoading, setIsLoading] = useState(false);
  const [mainImage, setMainImage] = useState<File | null>(null);
  const [galleryImages, setGalleryImages] = useState<File[]>([]);
  const [csvFile, setCsvFile] = useState<File | null>(null);

  const {
    mutateAsync,
    loading: productCreating,
    error,
  } = useMerchantCreateProduct();

  // Color options and their hex codes
  const colorOptions = [
    { name: "Black", hex: "#000000" },
    { name: "White", hex: "#FFFFFF" },
    { name: "Grey", hex: "#808080" },
    { name: "Red", hex: "#FF0000" },
    { name: "Silver", hex: "#C0C0C0" },
    { name: "Gold", hex: "#FFD700" },
  ];

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    color: "",
    brand: "",
    description: "",
    price: "",
    discountPrice: "",
    isDeal: false,
  });

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "main" | "gallery"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (type === "main") {
      setMainImage(file);
    } else {
      setGalleryImages((prev) => [...prev, file]);
    }
    // if (file) {
    //   const reader = new FileReader();
    //   reader.onload = (e) => {
    //     const result = e.target?.result as string;
    //     if (type === "main") {
    //       setMainImage(result);
    //     } else {
    //       setGalleryImages((prev) => [...prev, result]);
    //     }
    //   };
    //   reader.readAsDataURL(file);
    // }
  };

  const removeGalleryImage = (index: number) => {
    setGalleryImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCsvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "text/csv") {
      setCsvFile(file);
    } else {
      toast.error("Please select a valid CSV file");
    }
  };

  const handleFormSubmit = async (action: "draft" | "publish") => {
    if (!formData.name || !formData.category || !formData.price) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      let image: string | undefined;
      let images: string[] = [];
      setIsLoading(true);

      if (mainImage) {
        image = (await uploadMedia(mainImage))?.original;
      }

      if (galleryImages.length > 0) {
        images = await Promise.all(
          galleryImages.map(async (file) => {
            const res = await uploadMedia(file);
            return res.original;
          })
        );
      }

      await mutateAsync({
        name: formData.name,
        brand: formData.name,
        category: [formData.category],
        color: formData.color,
        description: formData.description,
        image: image || "",
        images,
        discountPrice: Number(formData.discountPrice),
        price: Number(formData.price),
        status: action,
      }).then((response) => {
        toast.success(
          `Product ${
            action === "draft" ? "saved as draft" : "published"
          } successfully!`
        );

        // Reset form
        setFormData({
          name: "",
          category: "",
          color: "",
          brand: "",
          description: "",
          price: "",
          discountPrice: "",
          isDeal: false,
        });
        setMainImage(null);
        setGalleryImages([]);
      });

      // // Simulate API call
      // await new Promise((resolve) => setTimeout(resolve, 2000));

      // toast.success(
      //   `Product ${
      //     action === "save" ? "saved as draft" : "published"
      //   } successfully!`
      // );

      // // Reset form
      // setFormData({
      //   name: "",
      //   category: "",
      //   color: "",
      //   brand: "",
      //   description: "",
      //   price: "",
      //   discountPrice: "",
      //   isDeal: false,
      // });
      // setMainImage(null);
      // setGalleryImages([]);
    } catch {
    } finally {
      setIsLoading(false);
    }
  };

  const handleCsvSubmit = async () => {
    if (!csvFile) {
      toast.error("Please select a CSV file");
      return;
    }

    setIsLoading(true);

    // Simulate CSV processing
    await new Promise((resolve) => setTimeout(resolve, 3000));

    toast.success("CSV file processed successfully! 25 products uploaded.");
    setCsvFile(null);
    setIsLoading(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Product Upload</h1>
          <p className="text-gray-600 mt-1">
            Add new products to your inventory
          </p>
        </div>
        <div className="flex gap-2">
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            <FileText className="h-3 w-3 mr-1" />
            Draft: 12
          </Badge>
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            <Eye className="h-3 w-3 mr-1" />
            Published: 1,247
          </Badge>
        </div>
      </div>

      {/* Upload Methods */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="form" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Manual Form
          </TabsTrigger>
          <TabsTrigger value="csv" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            CSV Upload
          </TabsTrigger>
        </TabsList>

        {/* Manual Form Upload */}
        <TabsContent value="form" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ImageIcon className="h-5 w-5" />
                    Product Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Product Name *</Label>
                      <Input
                        id="name"
                        placeholder="Enter product name"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="brand">Brand</Label>
                      <Select
                        value={formData.brand}
                        onValueChange={(value) =>
                          setFormData((prev) => ({ ...prev, brand: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select brand" />
                        </SelectTrigger>
                        <SelectContent>
                          {brands.map((brand) => (
                            <SelectItem key={brand} value={brand}>
                              {brand}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, category: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Color Dropdown */}
                  <div className="space-y-2">
                    <Label htmlFor="color">Color</Label>
                    <Select
                      value={formData.color}
                      onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, color: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select color" />
                      </SelectTrigger>
                      <SelectContent>
                        {colorOptions.map((color) => (
                          <SelectItem key={color.name} value={color.name}>
                            <span className="flex items-center gap-2">
                              <span
                                className="inline-block w-4 h-4 rounded-full border"
                                style={{
                                  backgroundColor: color.hex,
                                  borderColor:
                                    color.name === "White" ? "#ccc" : color.hex,
                                }}
                              />
                              {color.name}
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Product Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Enter detailed product description"
                      rows={4}
                      value={formData.description}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          description: e.target.value,
                        }))
                      }
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="price">Product Price (₦) *</Label>
                      <Input
                        id="price"
                        type="number"
                        placeholder="0.00"
                        value={formData.price}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            price: e.target.value,
                          }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="discountPrice">Discount Price (₦)</Label>
                      <Input
                        id="discountPrice"
                        type="number"
                        placeholder="0.00"
                        value={formData.discountPrice}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            discountPrice: e.target.value,
                          }))
                        }
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="isDeal"
                      checked={formData.isDeal}
                      onCheckedChange={(checked) =>
                        setFormData((prev) => ({
                          ...prev,
                          isDeal: checked as boolean,
                        }))
                      }
                    />
                    <Label htmlFor="isDeal" className="text-sm font-medium">
                      Mark as Kredmart Deal
                    </Label>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Image Upload */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Product Images</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Main Image */}
                  <div className="space-y-2">
                    <Label>Main Image *</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                      {mainImage ? (
                        <div className="relative">
                          <img
                            src={
                              URL.createObjectURL(mainImage) ||
                              "/placeholder.svg"
                            }
                            alt="Main product"
                            className="w-full h-32 object-cover rounded"
                          />
                          <Button
                            variant="destructive"
                            size="sm"
                            className="absolute top-1 right-1"
                            onClick={() => setMainImage(null)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ) : (
                        <div>
                          <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                          <p className="text-sm text-gray-600">
                            Upload main image
                          </p>
                          <Input
                            type="file"
                            accept="image/*"
                            className="mt-2"
                            onChange={(e) => handleImageUpload(e, "main")}
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Gallery Images */}
                  <div className="space-y-2">
                    <Label>Gallery Images</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {galleryImages.map((image, index) => (
                        <div key={index} className="relative">
                          <img
                            src={
                              URL.createObjectURL(image) || "/placeholder.svg"
                            }
                            alt={`Gallery ${index + 1}`}
                            className="w-full h-20 object-cover rounded"
                          />
                          <Button
                            variant="destructive"
                            size="sm"
                            className="absolute top-1 right-1"
                            onClick={() => removeGalleryImage(index)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                      {galleryImages.length < 4 && (
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-2 text-center">
                          <Plus className="h-6 w-6 mx-auto text-gray-400 mb-1" />
                          <Input
                            type="file"
                            accept="image/*"
                            className="text-xs"
                            onChange={(e) => handleImageUpload(e, "gallery")}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="space-y-2">
                <Button
                  onClick={() => handleFormSubmit("publish")}
                  disabled={isLoading || productCreating}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  {isLoading ? "Publishing..." : "Save & Publish"}
                  <Eye className="h-4 w-4 ml-2" />
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleFormSubmit("draft")}
                  disabled={isLoading || productCreating}
                  className="w-full"
                >
                  Save as Draft
                  <Save className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* CSV Upload */}
        <TabsContent value="csv" className="space-y-6">
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Bulk Upload via CSV
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-medium text-blue-900 mb-2">
                    CSV Format Requirements:
                  </h3>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Product Name, Category, Brand, Description</li>
                    <li>• Price, Discount Price, Main Image URL</li>
                    <li>• Gallery Images (comma-separated URLs)</li>
                    <li>• Is Deal (true/false)</li>
                  </ul>
                  <Button variant="link" className="text-blue-600 p-0 mt-2">
                    Download Sample CSV Template
                  </Button>
                </div>

                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  {csvFile ? (
                    <div className="space-y-4">
                      <FileText className="h-12 w-12 mx-auto text-green-600" />
                      <div>
                        <p className="font-medium">{csvFile.name}</p>
                        <p className="text-sm text-gray-600">Ready to upload</p>
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => setCsvFile(null)}
                      >
                        Remove File
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <Upload className="h-12 w-12 mx-auto text-gray-400" />
                      <div>
                        <p className="text-lg font-medium">Upload CSV File</p>
                        <p className="text-gray-600">
                          Drag and drop or click to select
                        </p>
                      </div>
                      <Input
                        type="file"
                        accept=".csv"
                        onChange={handleCsvUpload}
                        className="max-w-xs mx-auto"
                      />
                    </div>
                  )}
                </div>

                <Button
                  onClick={handleCsvSubmit}
                  disabled={!csvFile || isLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  {isLoading ? "Processing CSV..." : "Upload Products"}
                  <Upload className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
