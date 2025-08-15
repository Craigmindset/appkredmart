"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"

export function ProductUpload() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await new Promise((r) => setTimeout(r, 900))
    setLoading(false)
    toast({ title: "Product uploaded", description: "Your product has been submitted for review." })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Product</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="grid gap-3 md:grid-cols-2">
          <div className="md:col-span-1">
            <Label>Title</Label>
            <Input required placeholder="e.g., Wireless Earbuds Pro" />
          </div>
          <div className="md:col-span-1">
            <Label>Price (₦)</Label>
            <Input required inputMode="numeric" placeholder="e.g., 49999" />
          </div>
          <div className="md:col-span-1">
            <Label>Brand</Label>
            <Input placeholder="e.g., AcmeAudio" />
          </div>
          <div className="md:col-span-1">
            <Label>Category</Label>
            <Input placeholder="e.g., Audio" />
          </div>
          <div className="md:col-span-2">
            <Label>Description</Label>
            <Textarea placeholder="Write a concise product description..." />
          </div>
          <div className="md:col-span-2">
            <Label>Images</Label>
            <Input type="file" accept="image/*" multiple />
          </div>
          <div className="md:col-span-2 flex justify-end">
            <Button type="submit" disabled={loading}>
              {loading ? "Uploading..." : "Upload"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
