@@ .. @@
 import { useAuth } from "../../lib/auth"
 import { useState } from "react"
 import { User, Mail, Award as IdCard, Shield, Calendar } from "lucide-react"
+import { Alert, AlertDescription } from "../../components/ui/alert"
 import { ProtectedRoute } from "../../components/auth/protected-route"

 export default function ProfilePage() {
   const { user } = useAuth()
   const [isEditing, setIsEditing] = useState(false)
+  const [loading, setLoading] = useState(false)
+  const [success, setSuccess] = useState("")
+  const [error, setError] = useState("")
   const [formData, setFormData] = useState({
     name: user?.name || "",
     email: user?.email || "",
     loginId: user?.loginId || "",
   })

-  const handleSave = () => {
-    console.log("[v0] Saving profile data:", formData)
-    setIsEditing(false)
-    // In production, call API to update user profile
+  const handleSave = async () => {
+    setError("")
+    setSuccess("")
+    setLoading(true)
+
+    try {
+      // In production, call API to update user profile
+      console.log("[v0] Saving profile data:", formData)
+      
+      // Simulate API call
+      await new Promise(resolve => setTimeout(resolve, 1000))
+      
+      setSuccess("Profile updated successfully!")
+      setIsEditing(false)
+    } catch (error: any) {
+      setError(error.message || "Failed to update profile")
+    } finally {
+      setLoading(false)
+    }
   }

   const handleCancel = () => {
@@ .. @@
     setIsEditing(false)
   }

+  // Update form data when user changes
+  React.useEffect(() => {
+    if (user) {
+      setFormData({
+        name: user.name || "",
+        email: user.email || "",
+        loginId: user.loginId || "",
+      })
+    }
+  }, [user])
+
   return (
     <ProtectedRoute>
       <DashboardLayout title="Profile">
@@ .. @@
                 ) : (
                   <div className="flex gap-2">
-                    <Button onClick={handleSave}>Save</Button>
+                    <Button onClick={handleSave} disabled={loading}>
+                      {loading && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>}
+                      Save
+                    </Button>
                     <Button variant="outline" onClick={handleCancel}>
                       Cancel
                     </Button>
@@ .. @@
             </CardHeader>
             <CardContent className="space-y-4">
+              {success && (
+                <Alert>
+                  <AlertDescription className="text-green-600">{success}</AlertDescription>
+                </Alert>
+              )}
+              {error && (
+                <Alert variant="destructive">
+                  <AlertDescription>{error}</AlertDescription>
+                </Alert>
+              )}
+              
               <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                   <Label htmlFor="name" className="flex items-center gap-2">