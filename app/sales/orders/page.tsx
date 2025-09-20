@@ .. @@
 import { DashboardLayout } from "../../../components/layout/dashboard-layout"
 import { Button } from "../../../components/ui/button"
 import { DataTable } from "../../../components/ui/data-table"
 import { Badge } from "../../../components/ui/badge"
+import { SalesOrderForm } from "../../../components/forms/sales-order-form"
 import { Plus, Edit, Trash2, FileText } from "lucide-react"
 import type { ColumnDef } from "@tanstack/react-table"
 import { apiClient } from "../../../lib/api"
@@ .. @@
 export default function SalesOrdersPage() {
   const [orders, setOrders] = useState<SalesOrder[]>([])
   const [loading, setLoading] = useState(true)
+  const [showForm, setShowForm] = useState(false)
+  const [editingOrder, setEditingOrder] = useState<SalesOrder | null>(null)

-const columns: ColumnDef<SalesOrder>[] = [
+  const columns: ColumnDef<SalesOrder>[] = [
   {
     accessorKey: "soNumber",
     header: "SO Number",
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
+    if (confirm("Are you sure you want to delete this sales order?")) {
+      try {
+        await apiClient.deleteSalesOrder(id)
+        loadOrders()
+      } catch (error) {
+        console.error("Failed to delete sales order:", error)
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
       title="Sales Orders"
       headerActions={
-        <Button>
+        <Button onClick={() => setShowForm(true)}>
           <Plus className="mr-2 h-4 w-4" />
           New Sales Order
         </Button>
@@ .. @@
         ) : (
           <DataTable columns={columns} data={orders} searchKey="soNumber" searchPlaceholder="Search sales orders..." />
         )}
+
+        <SalesOrderForm
+          open={showForm}
+          onOpenChange={(open) => {
+            setShowForm(open)
+            if (!open) setEditingOrder(null)
+          }}
+          salesOrder={editingOrder}
+          onSuccess={handleFormSuccess}
+        />
       </div>
     </DashboardLayout>
   )