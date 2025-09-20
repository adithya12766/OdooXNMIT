"use client"

import React from "react"
import { useState, useEffect } from "react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog"
import { Alert, AlertDescription } from "../ui/alert"
import { Loader2 } from "lucide-react"
import { apiClient } from "../../lib/api"

interface AccountFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  account?: any
  onSuccess: () => void
}

export function AccountForm({ open, onOpenChange, account, onSuccess }: AccountFormProps) {
  const [formData, setFormData] = useState({
    name: account?.name || "",
    type: account?.type || "ASSET",
    code: account?.code || "",
    parentId: account?.parentId || "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [parentAccounts, setParentAccounts] = useState<any[]>([])

  useEffect(() => {
    if (open) {
      loadParentAccounts()
    }
  }, [open, formData.type])

  const loadParentAccounts = async () => {
    try {
      const response = await apiClient.getChartOfAccounts({ type: formData.type })
      setParentAccounts(response.data || [])
    } catch (error) {
      console.error("Failed to load parent accounts:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const accountData = {
        ...formData,
        parentId: formData.parentId || null,
      }

      if (account) {
        await apiClient.updateAccount(account.id, accountData)
      } else {
        await apiClient.createAccount(accountData)
      }
      onSuccess()
      onOpenChange(false)
      setFormData({
        name: "",
        type: "ASSET",
        code: "",
        parentId: "",
      })
    } catch (error: any) {
      setError(error.message || "Failed to save account")
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{account ? "Edit Account" : "New Account"}</DialogTitle>
          <DialogDescription>
            {account ? "Update account information" : "Add a new account to your chart of accounts"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Account Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="Enter account name"
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="code">Account Code</Label>
              <Input
                id="code"
                value={formData.code}
                onChange={(e) => handleChange("code", e.target.value)}
                placeholder="Enter account code"
                disabled={loading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Account Type *</Label>
            <Select
              value={formData.type}
              onValueChange={(value) => handleChange("type", value)}
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select account type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ASSET">Asset</SelectItem>
                <SelectItem value="LIABILITY">Liability</SelectItem>
                <SelectItem value="EXPENSE">Expense</SelectItem>
                <SelectItem value="INCOME">Income</SelectItem>
                <SelectItem value="EQUITY">Equity</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="parentId">Parent Account</Label>
            <Select
              value={formData.parentId}
              onValueChange={(value) => handleChange("parentId", value)}
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select parent account (optional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">No Parent</SelectItem>
                {parentAccounts.map((parentAccount) => (
                  <SelectItem key={parentAccount.id} value={parentAccount.id}>
                    {parentAccount.code ? `${parentAccount.code} - ` : ""}{parentAccount.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {account ? "Update Account" : "Create Account"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}