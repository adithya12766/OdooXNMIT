@@ .. @@
   async deleteCustomerInvoice(id: string) {
     return this.request<any>(`/customer-invoices/${id}`, {
       method: "DELETE",
     })
   }
+
+  // Additional API methods for the new forms
+  async createAccount(accountData: any) {
+    return this.request<any>("/chart-of-accounts", {
+      method: "POST",
+      body: JSON.stringify(accountData),
+    })
+  }
+
+  async updateAccount(id: string, accountData: any) {
+    return this.request<any>(`/chart-of-accounts/${id}`, {
+      method: "PUT",
+      body: JSON.stringify(accountData),
+    })
+  }
+
+  async deleteAccount(id: string) {
+    return this.request<any>(`/chart-of-accounts/${id}`, {
+      method: "DELETE",
+    })
+  }
+
+  async createTax(taxData: any) {
+    return this.request<any>("/taxes", {
+      method: "POST",
+      body: JSON.stringify(taxData),
+    })
+  }
+
+  async updateTax(id: string, taxData: any) {
+    return this.request<any>(`/taxes/${id}`, {
+      method: "PUT",
+      body: JSON.stringify(taxData),
+    })
+  }
+
+  async deleteTax(id: string) {
+    return this.request<any>(`/taxes/${id}`, {
+      method: "DELETE",
+    })
+  }
+
+  async createPurchaseOrder(orderData: any) {
+    return this.request<any>("/purchase-orders", {
+      method: "POST",
+      body: JSON.stringify(orderData),
+    })
+  }
+
+  async updatePurchaseOrder(id: string, orderData: any) {
+    return this.request<any>(`/purchase-orders/${id}`, {
+      method: "PUT",
+      body: JSON.stringify(orderData),
+    })
+  }
+
+  async deletePurchaseOrder(id: string) {
+    return this.request<any>(`/purchase-orders/${id}`, {
+      method: "DELETE",
+    })
+  }
+
+  async createVendorBill(billData: any) {
+    return this.request<any>("/vendor-bills", {
+      method: "POST",
+      body: JSON.stringify(billData),
+    })
+  }
+
+  async updateVendorBill(id: string, billData: any) {
+    return this.request<any>(`/vendor-bills/${id}`, {
+      method: "PUT",
+      body: JSON.stringify(billData),
+    })
+  }
+
+  async deleteVendorBill(id: string) {
+    return this.request<any>(`/vendor-bills/${id}`, {
+      method: "DELETE",
+    })
+  }
+
+  async createSalesOrder(orderData: any) {
+    return this.request<any>("/sales-orders", {
+      method: "POST",
+      body: JSON.stringify(orderData),
+    })
+  }
+
+  async updateSalesOrder(id: string, orderData: any) {
+    return this.request<any>(`/sales-orders/${id}`, {
+      method: "PUT",
+      body: JSON.stringify(orderData),
+    })
+  }
+
+  async deleteSalesOrder(id: string) {
+    return this.request<any>(`/sales-orders/${id}`, {
+      method: "DELETE",
+    })
+  }
+
+  async createCustomerInvoice(invoiceData: any) {
+    return this.request<any>("/customer-invoices", {
+      method: "POST",
+      body: JSON.stringify(invoiceData),
+    })
+  }
+
+  async updateCustomerInvoice(id: string, invoiceData: any) {
+    return this.request<any>(`/customer-invoices/${id}`, {
+      method: "PUT",
+      body: JSON.stringify(invoiceData),
+    })
+  }
+
+  async deleteCustomerInvoice(id: string) {
+    return this.request<any>(`/customer-invoices/${id}`, {
+      method: "DELETE",
+    })
+  }
 }