// MAX WIDTH WRAPPER
// A reusable layout utility component that constrains content to a centered, responsive max width.
// It optionally accepts a custom HTML element type via the `as` prop, defaults to a <div>,
// and combines utility classes with any additional className passed.

import { cn } from "@/lib/utils";
import * as React from "react";

// Props interface with generics for flexible tag rendering (e.g., <section>, <main>, etc.)
interface MaxWidthWrapperProps<T extends React.ElementType = "div"> {
  as?: T;                    // Optional tag type (e.g., "section", "main", etc.)
  children: React.ReactNode; // Child components to render inside the wrapper
  className?: string;        // Optional additional class names
}

export default function MaxWidthWrapper<T extends React.ElementType = "div">({
  children,
  className,
  as,
  ...props
}: MaxWidthWrapperProps<T> & React.ComponentPropsWithoutRef<T>) {
  // Determine the tag to render (default to <div>)
  const Component = as || "div";

  return (
    <Component
      {...props}
      className={cn(
        "mx-auto w-full max-w-screen-2xl px-5", // Default centering and max width
        className // Include any additional custom classes
      )}
    >
      {children}
    </Component>
  );
}
