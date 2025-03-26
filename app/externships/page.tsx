// EXTERNSHIPS PAGE
// This page is a protected route that displays a placeholder message for the 
// Externships section.It uses a <ProtectedRoute> component to ensure only 
// authenticated users can access this page. app/externships/page.tsx
"use client"; 

// Import the ProtectedRoute component to restrict access to authenticated users
import ProtectedRoute from "@/components/protectedRoute";

export default function ExternshipsPage() {
  return (
    // Wrap the content inside a protected route to ensure only logged-in users can access
    <ProtectedRoute>
      <div style={{ padding: "2rem", textAlign: "center" }}>
        {/* Page heading */}
        <h1>Externships</h1>

        {/* Placeholder message for future content */}
        <p>This is a placeholder for the Externships page. Content coming soon!</p>
      </div>
    </ProtectedRoute>
  );
}
