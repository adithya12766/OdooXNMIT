"use client"

import React from "react"
import { useState } from "react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Switch } from "../ui/switch"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog"
import { Alert, AlertDescription } from "../ui/alert"
import { Loader2 } from "lucide-react"
import { apiClient } from "../../lib/api"

interface TaxFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  tax?: any
  onSuccess: () => void
}

export function TaxForm({ open, onOpenChange, tax, onSuccess }: TaxFormProps) {
  const [formData, setFormData] = useState({
    name: tax?.name || "",
    computationMethod: tax?.computationMethod || "PERCENTAGE",
    rate: tax?.rate || "",
    applicableOnSales: tax?.applicableOnSales ?? true,
    applicableOnPurchase: tax?.applicableOnPurchase ?? true,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const taxData = {
        ...formData,
        rate: parseFloat(formData.rate) || 0,
      }

      if (tax) {
        await apiClient.updateTax(tax.id, taxData)
      } else {
        await apiClient.createTax(taxData)
      }
      onSuccess()
      onOpenChange(false)
      setFormData({
        name: "",
        computationMethod: "PERCENTAGE",
        rate: "",
        applicableOnSales: true,
        applicableOnPurchase: true,
      })
    } catch (error: any) {
      setError(error.message || "Failed to save tax")
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{tax ? "Edit Tax" : "New Tax"}</DialogTitle>
          <DialogDescription>
            {tax ? "Update tax information" : "Add a new tax to your system"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="name">Tax Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="Enter tax name (e.g., GST 18%)"
              required
              disabled={loading}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="computationMethod">Computation Method *</Label>
              <Select
                value={formData.computationMethod}
                onValueChange={(value) => handleChange("computationMethod", value)}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PERCENTAGE">Percentage</SelectItem>
                  <SelectItem value="FIXED_VALUE">Fixed Value</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="rate">
                Rate * {formData.computationMethod === "PERCENTAGE" ? "(%)" : "(₹)"}
              </Label>
              <Input
                id="rate"
                type="number"
                step="0.01"
                value={formData.rate}
                onChange={(e) => handleChange("rate", e.target.value)}
                placeholder="0.00"
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Applicable on Sales</Label>
                <p className="text-sm text-muted-foreground">Apply this tax on sales transactions</p>
              </div>
              <Switch
                checked={formData.applicableOnSales}
                onCheckedChange={(checked) => handleChange("applicableOnSales", checked)}
                disabled={loading}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Applicable on Purchase</Label>
                <p className="text-sm text-muted-foreground">Apply this tax on purchase transactions</p>
              </div>
              <Switch
                checked={formData.applicableOnPurchase}
                onCheckedChange={(checked) => handleChange("applicableOnPurchase", checked)}
                disabled={loading}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {tax ? "Update Tax" : "Create Tax"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}