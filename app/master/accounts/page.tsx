@@ .. @@
 import React, { useState, useEffect } from "react"
 import { DashboardLayout } from "../../../components/layout/dashboard-layout"
 import { Button } from "../../../components/ui/button"
 import { DataTable } from "../../../components/ui/data-table"
 import { Badge } from "../../../components/ui/badge"
+import { AccountForm } from "../../../components/forms/account-form"
 import { Plus, Edit, Trash2 } from "lucide-react"
 import type { ColumnDef } from "@tanstack/react-table"
 import { apiClient } from "../../../lib/api"
@@ .. @@
 export default function ChartOfAccountsPage() {
   const [accounts, setAccounts] = useState<ChartOfAccount[]>([])
   const [loading, setLoading] = useState(true)
+  const [showForm, setShowForm] = useState(false)
+  const [editingAccount, setEditingAccount] = useState<ChartOfAccount | null>(null)

-const columns: ColumnDef<ChartOfAccount>[] = [
+  const columns: ColumnDef<ChartOfAccount>[] = [
   {
     accessorKey: "code",
     header: "Code",
@@ .. @@
     id: "actions",
     header: "Actions",
     cell: ({ row }) => {
+      const account = row.original
       return (
         <div className="flex items-center space-x-2">
-          <Button variant="ghost" size="icon">
+          <Button
+            variant="ghost"
+            size="icon"
+            onClick={() => {
+              setEditingAccount(account)
+              setShowForm(true)
+            }}
+          >
             <Edit className="h-4 w-4" />
           </Button>
-          <Button variant="ghost" size="icon">
+          <Button variant="ghost" size="icon" onClick={() => handleDelete(account.id)}>
             <Trash2 className="h-4 w-4" />
           </Button>
         </div>
@@ .. @@
     }
   }

+  const handleDelete = async (id: string) => {
+    if (confirm("Are you sure you want to delete this account?")) {
+      try {
+        await apiClient.deleteAccount(id)
+        loadAccounts()
+      } catch (error) {
+        console.error("Failed to delete account:", error)
+      }
+    }
+  }
+
+  const handleFormSuccess = () => {
+    loadAccounts()
+    setEditingAccount(null)
+  }
+
   return (
     <DashboardLayout
       title="Chart of Accounts"
       headerActions={
-        <Button>
+        <Button onClick={() => setShowForm(true)}>
           <Plus className="mr-2 h-4 w-4" />
           New Account
         </Button>
@@ .. @@
         ) : (
           <DataTable columns={columns} data={accounts} searchKey="name" searchPlaceholder="Search accounts..." />
         )}
+
+        <AccountForm
+          open={showForm}
+          onOpenChange={(open) => {
+            setShowForm(open)
+            if (!open) setEditingAccount(null)
+          }}
+          account={editingAccount}
+          onSuccess={handleFormSuccess}
+        />
       </div>
     </DashboardLayout>
   )