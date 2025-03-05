"use client";

import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

export function PostsError() {
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription className="flex items-center justify-between">
        <span>Failed to load externship data.</span>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => window.location.reload()}
        >
          Try Again
        </Button>
      </AlertDescription>
    </Alert>
  );
}
