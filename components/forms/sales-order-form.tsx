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

interface SalesOrderFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  salesOrder?: any
  onSuccess: () => void
}

interface OrderItem {
  productId: string
  quantity: string
  unitPrice: string
  taxId: string
}

export function SalesOrderForm({ open, onOpenChange, salesOrder, onSuccess }: SalesOrderFormProps) {
  const [formData, setFormData] = useState({
    customerId: salesOrder?.customerId || "",
    soDate: salesOrder?.soDate?.split('T')[0] || new Date().toISOString().split('T')[0],
    soRef: salesOrder?.soRef || "",
  })
  const [items, setItems] = useState<OrderItem[]>([
    { productId: "", quantity: "", unitPrice: "", taxId: "" }
  ])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [customers, setCustomers] = useState<any[]>([])
  const [products, setProducts] = useState<any[]>([])
  const [taxes, setTaxes] = useState<any[]>([])

  useEffect(() => {
    if (open) {
      loadFormData()
    }
  }, [open])

  const loadFormData = async () => {
    try {
      const [customersRes, productsRes, taxesRes] = await Promise.all([
        apiClient.getContacts({ type: "CUSTOMER" }),
        apiClient.getProducts(),
        apiClient.getTaxes()
      ])
      setCustomers(customersRes.data || [])
      setProducts(productsRes.data || [])
      setTaxes(taxesRes.data || [])
    } catch (error) {
      console.error("Failed to load form data:", error)
      // Mock data for demo
      setCustomers([
        { id: "1", name: "Nimesh Pathak", email: "nimesh@example.com" },
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

      if (salesOrder) {
        await apiClient.updateSalesOrder(salesOrder.id, orderData)
      } else {
        await apiClient.createSalesOrder(orderData)
      }
      onSuccess()
      onOpenChange(false)
      resetForm()
    } catch (error: any) {
      setError(error.message || "Failed to save sales order")
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      customerId: "",
      soDate: new Date().toISOString().split('T')[0],
      soRef: "",
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
          <DialogTitle>{salesOrder ? "Edit Sales Order" : "New Sales Order"}</DialogTitle>
          <DialogDescription>
            {salesOrder ? "Update sales order information" : "Create a new sales order"}
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
                  <Label htmlFor="customerId">Customer *</Label>
                  <Select
                    value={formData.customerId}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, customerId: value }))}
                    disabled={loading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select customer" />
                    </SelectTrigger>
                    <SelectContent>
                      {customers.map((customer) => (
                        <SelectItem key={customer.id} value={customer.id}>
                          {customer.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="soDate">SO Date *</Label>
                  <Input
                    id="soDate"
                    type="date"
                    value={formData.soDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, soDate: e.target.value }))}
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="soRef">SO Reference</Label>
                <Input
                  id="soRef"
                  value={formData.soRef}
                  onChange={(e) => setFormData(prev => ({ ...prev, soRef: e.target.value }))}
                  placeholder="Enter SO reference"
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
              {salesOrder ? "Update Sales Order" : "Create Sales Order"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}