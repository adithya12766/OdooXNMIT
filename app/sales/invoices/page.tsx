@@ .. @@
 import { DashboardLayout } from "../../../components/layout/dashboard-layout"
 import { Button } from "../../../components/ui/button"
 import { DataTable } from "../../../components/ui/data-table"
 import { Badge } from "../../../components/ui/badge"
+import { CustomerInvoiceForm } from "../../../components/forms/customer-invoice-form"
 import { Plus, Edit, Trash2, CreditCard } from "lucide-react"
 import type { ColumnDef } from "@tanstack/react-table"
 import { apiClient } from "../../../lib/api"
@@ .. @@
 export default function CustomerInvoicesPage() {
   const [invoices, setInvoices] = useState<CustomerInvoice[]>([])
   const [loading, setLoading] = useState(true)
+  const [showForm, setShowForm] = useState(false)
+  const [editingInvoice, setEditingInvoice] = useState<CustomerInvoice | null>(null)

-const columns: ColumnDef<CustomerInvoice>[] = [
+  const columns: ColumnDef<CustomerInvoice>[] = [
   {
     accessorKey: "invoiceNumber",
     header: "Invoice Number",
@@ .. @@
     id: "actions",
     header: "Actions",
     cell: ({ row }) => {
+      const invoice = row.original
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
+              setEditingInvoice(invoice)
+              setShowForm(true)
+            }}
+          >
             <Edit className="h-4 w-4" />
           </Button>
-          <Button variant="ghost" size="icon">
+          <Button variant="ghost" size="icon" onClick={() => handleDelete(invoice.id)}>
             <Trash2 className="h-4 w-4" />
           </Button>
         </div>
@@ .. @@
     }
   }

+  const handleDelete = async (id: string) => {
+    if (confirm("Are you sure you want to delete this customer invoice?")) {
+      try {
+        await apiClient.deleteCustomerInvoice(id)
+        loadInvoices()
+      } catch (error) {
+        console.error("Failed to delete customer invoice:", error)
+      }
+    }
+  }
+
+  const handleFormSuccess = () => {
+    loadInvoices()
+    setEditingInvoice(null)
+  }
+
   return (
     <DashboardLayout
       title="Customer Invoices"
       headerActions={
-        <Button>
+        <Button onClick={() => setShowForm(true)}>
           <Plus className="mr-2 h-4 w-4" />
           New Customer Invoice
         </Button>
@@ .. @@
             searchPlaceholder="Search customer invoices..."
           />
         )}
+
+        <CustomerInvoiceForm
+          open={showForm}
+          onOpenChange={(open) => {
+            setShowForm(open)
+            if (!open) setEditingInvoice(null)
+          }}
+          customerInvoice={editingInvoice}
+          onSuccess={handleFormSuccess}
+        />
       </div>
     </DashboardLayout>
   )