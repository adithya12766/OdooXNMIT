@@ .. @@
 import { DashboardLayout } from "../../../components/layout/dashboard-layout"
 import { Button } from "../../../components/ui/button"
 import { DataTable } from "../../../components/ui/data-table"
 import { Badge } from "../../../components/ui/badge"
+import { VendorBillForm } from "../../../components/forms/vendor-bill-form"
 import { Plus, Edit, Trash2, CreditCard } from "lucide-react"
 import type { ColumnDef } from "@tanstack/react-table"
 import { apiClient } from "../../../lib/api"
@@ .. @@
 export default function VendorBillsPage() {
   const [bills, setBills] = useState<VendorBill[]>([])
   const [loading, setLoading] = useState(true)
+  const [showForm, setShowForm] = useState(false)
+  const [editingBill, setEditingBill] = useState<VendorBill | null>(null)

-const columns: ColumnDef<VendorBill>[] = [
+  const columns: ColumnDef<VendorBill>[] = [
   {
     accessorKey: "billNumber",
     header: "Bill Number",
@@ .. @@
     id: "actions",
     header: "Actions",
     cell: ({ row }) => {
+      const bill = row.original
       const status = row.original.paymentStatus
       return (
         <div className="flex items-center space-x-2">
@@ -85,10 +89,18 @@
               <CreditCard className="h-4 w-4" />
             </Button>
           )}
-          <Button variant="ghost" size="icon">
+          <Button
+            variant="ghost"
+            size="icon"
+            onClick={() => {
+              setEditingBill(bill)
+              setShowForm(true)
+            }}
+          >
             <Edit className="h-4 w-4" />
           </Button>
-          <Button variant="ghost" size="icon">
+          <Button variant="ghost" size="icon" onClick={() => handleDelete(bill.id)}>
             <Trash2 className="h-4 w-4" />
           </Button>
         </div>
@@ .. @@
     }
   }

+  const handleDelete = async (id: string) => {
+    if (confirm("Are you sure you want to delete this vendor bill?")) {
+      try {
+        await apiClient.deleteVendorBill(id)
+        loadBills()
+      } catch (error) {
+        console.error("Failed to delete vendor bill:", error)
+      }
+    }
+  }
+
+  const handleFormSuccess = () => {
+    loadBills()
+    setEditingBill(null)
+  }
+
   return (
     <DashboardLayout
       title="Vendor Bills"
       headerActions={
-        <Button>
+        <Button onClick={() => setShowForm(true)}>
           <Plus className="mr-2 h-4 w-4" />
           New Vendor Bill
         </Button>
@@ .. @@
         ) : (
           <DataTable columns={columns} data={bills} searchKey="billNumber" searchPlaceholder="Search vendor bills..." />
         )}
+
+        <VendorBillForm
+          open={showForm}
+          onOpenChange={(open) => {
+            setShowForm(open)
+            if (!open) setEditingBill(null)
+          }}
+          vendorBill={editingBill}
+          onSuccess={handleFormSuccess}
+        />
       </div>
     </DashboardLayout>
   )