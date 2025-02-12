import { cn } from "@/lib/utils";
import * as React from "react";

interface MaxWidthWrapperProps<T extends React.ElementType = "div"> {
  as?: T;
  children: React.ReactNode;
  className?: string;
}

export default function MaxWidthWrapper<T extends React.ElementType = "div">({
  children,
  className,
  as,
  ...props
}: MaxWidthWrapperProps<T> & React.ComponentPropsWithoutRef<T>) {
  const Component = as || "div";
  return (
    <Component
      {...props}
      className={cn("mx-auto w-full max-w-screen-2xl px-5", className)}
    >
      {children}
    </Component>
  );
}
