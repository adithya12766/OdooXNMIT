@@ .. @@
 "use client"
 import React from "react"
 import { useState, useEffect } from "react"
 import { DashboardLayout } from "../../../components/layout/dashboard-layout"
 import { Button } from "../../../components/ui/button"
 import { DataTable } from "../../../components/ui/data-table"
 import { Badge } from "../../../components/ui/badge"
+import { TaxForm } from "../../../components/forms/tax-form"
 import { Plus, Edit, Trash2 } from "lucide-react"
 import type { ColumnDef } from "@tanstack/react-table"
 import { apiClient } from "../../../lib/api"
@@ .. @@
 export default function TaxesPage() {
   const [taxes, setTaxes] = useState<Tax[]>([])
   const [loading, setLoading] = useState(true)
+  const [showForm, setShowForm] = useState(false)
+  const [editingTax, setEditingTax] = useState<Tax | null>(null)

-const columns: ColumnDef<Tax>[] = [
+  const columns: ColumnDef<Tax>[] = [
   {
     accessorKey: "name",
     header: "Tax Name",
@@ .. @@
     id: "actions",
     header: "Actions",
     cell: ({ row }) => {
+      const tax = row.original
       return (
         <div className="flex items-center space-x-2">
-          <Button variant="ghost" size="icon">
+          <Button
+            variant="ghost"
+            size="icon"
+            onClick={() => {
+              setEditingTax(tax)
+              setShowForm(true)
+            }}
+          >
             <Edit className="h-4 w-4" />
           </Button>
-          <Button variant="ghost" size="icon">
+          <Button variant="ghost" size="icon" onClick={() => handleDelete(tax.id)}>
             <Trash2 className="h-4 w-4" />
           </Button>
         </div>
@@ .. @@
     }
   }

+  const handleDelete = async (id: string) => {
+    if (confirm("Are you sure you want to delete this tax?")) {
+      try {
+        await apiClient.deleteTax(id)
+        loadTaxes()
+      } catch (error) {
+        console.error("Failed to delete tax:", error)
+      }
+    }
+  }
+
+  const handleFormSuccess = () => {
+    loadTaxes()
+    setEditingTax(null)
+  }
+
   return (
     <DashboardLayout
       title="Tax Master"
       headerActions={
-        <Button>
+        <Button onClick={() => setShowForm(true)}>
           <Plus className="mr-2 h-4 w-4" />
           New Tax
         </Button>
@@ .. @@
         ) : (
           <DataTable columns={columns} data={taxes} searchKey="name" searchPlaceholder="Search taxes..." />
         )}
+
+        <TaxForm
+          open={showForm}
+          onOpenChange={(open) => {
+            setShowForm(open)
+            if (!open) setEditingTax(null)
+          }}
+          tax={editingTax}
+          onSuccess={handleFormSuccess}
+        />
       </div>
     </DashboardLayout>
   )