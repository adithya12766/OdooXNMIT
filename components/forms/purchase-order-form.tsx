"use client"

import React from "react"
import { useState, useEffect } from "react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog"
import { Alert, AlertDescription } from "../ui/alert"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Loader2, Plus, Trash2 } from "lucide-react"
import { apiClient } from "../../lib/api"

interface PurchaseOrderFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  purchaseOrder?: any
  onSuccess: () => void
}

interface OrderItem {
  productId: string
  quantity: string
  unitPrice: string
  taxId: string
}

export function PurchaseOrderForm({ open, onOpenChange, purchaseOrder, onSuccess }: PurchaseOrderFormProps) {
  const [formData, setFormData] = useState({
    vendorId: purchaseOrder?.vendorId || "",
    poDate: purchaseOrder?.poDate?.split('T')[0] || new Date().toISOString().split('T')[0],
    vendorRef: purchaseOrder?.vendorRef || "",
  })
  const [items, setItems] = useState<OrderItem[]>([
    { productId: "", quantity: "", unitPrice: "", taxId: "" }
  ])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [vendors, setVendors] = useState<any[]>([])
  const [products, setProducts] = useState<any[]>([])
  const [taxes, setTaxes] = useState<any[]>([])

  useEffect(() => {
    if (open) {
      loadFormData()
    }
  }, [open])

  const loadFormData = async () => {
    try {
      const [vendorsRes, productsRes, taxesRes] = await Promise.all([
        apiClient.getContacts({ type: "VENDOR" }),
        apiClient.getProducts(),
        apiClient.getTaxes()
      ])
      setVendors(vendorsRes.data || [])
      setProducts(productsRes.data || [])
      setTaxes(taxesRes.data || [])
    } catch (error) {
      console.error("Failed to load form data:", error)
      // Mock data for demo
      setVendors([
        { id: "1", name: "Azure Furniture", email: "contact@azure.com" },
        { id: "2", name: "Global Suppliers", email: "info@global.com" }
      ])
      setProducts([
        { id: "1", name: "Office Chair", salesPrice: 15000 },
        { id: "2", name: "Wooden Table", salesPrice: 25000 }
      ])
      setTaxes([
        { id: "1", name: "GST 18%", rate: 18 },
        { id: "2", name: "GST 12%", rate: 12 }
      ])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const orderData = {
        ...formData,
        items: items.filter(item => item.productId && item.quantity && item.unitPrice).map(item => ({
          productId: item.productId,
          quantity: parseFloat(item.quantity),
          unitPrice: parseFloat(item.unitPrice),
          taxId: item.taxId || null
        }))
      }

      if (orderData.items.length === 0) {
        setError("Please add at least one item")
        return
      }

      if (purchaseOrder) {
        await apiClient.updatePurchaseOrder(purchaseOrder.id, orderData)
      } else {
        await apiClient.createPurchaseOrder(orderData)
      }
      onSuccess()
      onOpenChange(false)
      resetForm()
    } catch (error: any) {
      setError(error.message || "Failed to save purchase order")
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      vendorId: "",
      poDate: new Date().toISOString().split('T')[0],
      vendorRef: "",
    })
    setItems([{ productId: "", quantity: "", unitPrice: "", taxId: "" }])
  }

  const addItem = () => {
    setItems([...items, { productId: "", quantity: "", unitPrice: "", taxId: "" }])
  }

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index))
  }

  const updateItem = (index: number, field: keyof OrderItem, value: string) => {
    const updatedItems = [...items]
    updatedItems[index] = { ...updatedItems[index], [field]: value }
    setItems(updatedItems)
  }

  const calculateItemTotal = (item: OrderItem) => {
    const quantity = parseFloat(item.quantity) || 0
    const unitPrice = parseFloat(item.unitPrice) || 0
    const subtotal = quantity * unitPrice
    
    const tax = taxes.find(t => t.id === item.taxId)
    const taxAmount = tax ? (subtotal * tax.rate) / 100 : 0
    
    return subtotal + taxAmount
  }

  const calculateTotal = () => {
    return items.reduce((total, item) => total + calculateItemTotal(item), 0)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{purchaseOrder ? "Edit Purchase Order" : "New Purchase Order"}</DialogTitle>
          <DialogDescription>
            {purchaseOrder ? "Update purchase order information" : "Create a new purchase order"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Header Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Order Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="vendorId">Vendor *</Label>
                  <Select
                    value={formData.vendorId}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, vendorId: value }))}
                    disabled={loading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select vendor" />
                    </SelectTrigger>
                    <SelectContent>
                      {vendors.map((vendor) => (
                        <SelectItem key={vendor.id} value={vendor.id}>
                          {vendor.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="poDate">PO Date *</Label>
                  <Input
                    id="poDate"
                    type="date"
                    value={formData.poDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, poDate: e.target.value }))}
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="vendorRef">Vendor Reference</Label>
                <Input
                  id="vendorRef"
                  value={formData.vendorRef}
                  onChange={(e) => setFormData(prev => ({ ...prev, vendorRef: e.target.value }))}
                  placeholder="Enter vendor reference"
                  disabled={loading}
                />
              </div>
            </CardContent>
          </Card>

          {/* Items */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Order Items</CardTitle>
                <Button type="button" onClick={addItem} size="sm" disabled={loading}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Item
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {items.map((item, index) => (
                <div key={index} className="grid grid-cols-12 gap-2 items-end">
                  <div className="col-span-4 space-y-2">
                    <Label>Product</Label>
                    <Select
                      value={item.productId}
                      onValueChange={(value) => updateItem(index, "productId", value)}
                      disabled={loading}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select product" />
                      </SelectTrigger>
                      <SelectContent>
                        {products.map((product) => (
                          <SelectItem key={product.id} value={product.id}>
                            {product.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="col-span-2 space-y-2">
                    <Label>Quantity</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={item.quantity}
                      onChange={(e) => updateItem(index, "quantity", e.target.value)}
                      placeholder="0"
                      disabled={loading}
                    />
                  </div>

                  <div className="col-span-2 space-y-2">
                    <Label>Unit Price</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={item.unitPrice}
                      onChange={(e) => updateItem(index, "unitPrice", e.target.value)}
                      placeholder="0.00"
                      disabled={loading}
                    />
                  </div>

                  <div className="col-span-2 space-y-2">
                    <Label>Tax</Label>
                    <Select
                      value={item.taxId}
                      onValueChange={(value) => updateItem(index, "taxId", value)}
                      disabled={loading}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select tax" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">No Tax</SelectItem>
                        {taxes.map((tax) => (
                          <SelectItem key={tax.id} value={tax.id}>
                            {tax.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="col-span-1 space-y-2">
                    <Label>Total</Label>
                    <div className="h-9 flex items-center text-sm font-medium">
                      ₹{calculateItemTotal(item).toFixed(2)}
                    </div>
                  </div>

                  <div className="col-span-1">
                    {items.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeItem(index)}
                        disabled={loading}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}

              <div className="flex justify-end pt-4 border-t">
                <div className="text-right">
                  <p className="text-lg font-semibold">
                    Total: ₹{calculateTotal().toFixed(2)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {purchaseOrder ? "Update Purchase Order" : "Create Purchase Order"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}