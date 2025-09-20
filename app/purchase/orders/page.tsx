@@ .. @@
 import { DashboardLayout } from "../../../components/layout/dashboard-layout"
 import { Button } from "../../../components/ui/button"
 import { DataTable } from "../../../components/ui/data-table"
 import { Badge } from "../../../components/ui/badge"
+import { PurchaseOrderForm } from "../../../components/forms/purchase-order-form"
 import { Plus, Edit, Trash2, FileText } from "lucide-react"
 import type { ColumnDef } from "@tanstack/react-table"
 import { apiClient } from "../../../lib/api"
@@ .. @@
 export default function PurchaseOrdersPage() {
   const [orders, setOrders] = useState<PurchaseOrder[]>([])
   const [loading, setLoading] = useState(true)
+  const [showForm, setShowForm] = useState(false)
+  const [editingOrder, setEditingOrder] = useState<PurchaseOrder | null>(null)

-const columns: ColumnDef<PurchaseOrder>[] = [
+  const columns: ColumnDef<PurchaseOrder>[] = [
   {
     accessorKey: "poNumber",
     header: "PO Number",
@@ .. @@
     id: "actions",
     header: "Actions",
     cell: ({ row }) => {
+      const order = row.original
       return (
         <div className="flex items-center space-x-2">
           <Button variant="ghost" size="icon">
             <FileText className="h-4 w-4" />
           </Button>
-          <Button variant="ghost" size="icon">
+          <Button
+            variant="ghost"
+            size="icon"
+            onClick={() => {
+              setEditingOrder(order)
+              setShowForm(true)
+            }}
+          >
             <Edit className="h-4 w-4" />
           </Button>
-          <Button variant="ghost" size="icon">
+          <Button variant="ghost" size="icon" onClick={() => handleDelete(order.id)}>
             <Trash2 className="h-4 w-4" />
           </Button>
         </div>
@@ .. @@
     }
   }

+  const handleDelete = async (id: string) => {
+    if (confirm("Are you sure you want to delete this purchase order?")) {
+      try {
+        await apiClient.deletePurchaseOrder(id)
+        loadOrders()
+      } catch (error) {
+        console.error("Failed to delete purchase order:", error)
+      }
+    }
+  }
+
+  const handleFormSuccess = () => {
+    loadOrders()
+    setEditingOrder(null)
+  }
+
   return (
     <DashboardLayout
       title="Purchase Orders"
       headerActions={
-        <Button>
+        <Button onClick={() => setShowForm(true)}>
           <Plus className="mr-2 h-4 w-4" />
           New Purchase Order
         </Button>
@@ .. @@
             searchPlaceholder="Search purchase orders..."
           />
         )}
+
+        <PurchaseOrderForm
+          open={showForm}
+          onOpenChange={(open) => {
+            setShowForm(open)
+            if (!open) setEditingOrder(null)
+          }}
+          purchaseOrder={editingOrder}
+          onSuccess={handleFormSuccess}
+        />
       </div>
     </DashboardLayout>
   )