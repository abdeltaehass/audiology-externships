// app/externships/page.tsx
"use client";

import ProtectedRoute from "@/components/protectedRoute";

export default function ExternshipsPage() {
  return (
    <ProtectedRoute>
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <h1>Externships</h1>
        <p>This is a placeholder for the Externships page. Content coming soon!</p>
      </div>
    </ProtectedRoute>
  );
}
