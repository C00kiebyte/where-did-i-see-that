"use client";
import * as React from "react";
import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group";
import { cn } from "@/lib/utils";

export function ToggleGroup({
  className,
  variant: _variant,
  size: _size,
  ...props
}: React.ComponentProps<typeof ToggleGroupPrimitive.Root> & { variant?: string; size?: string }) {
  return (
    <ToggleGroupPrimitive.Root
      className={cn("inline-flex overflow-hidden rounded-md border border-[#D5DBE1] bg-white", className)}
      {...props}
    />
  );
}

export function ToggleGroupItem({ className, ...props }: React.ComponentProps<typeof ToggleGroupPrimitive.Item>) {
  return (
    <ToggleGroupPrimitive.Item
      className={cn(
        "h-8 px-3 text-sm transition-colors hover:bg-[#E5EAEE] focus-visible:outline-2 focus-visible:outline-[#0E7C7B] data-[state=on]:bg-[#16212E] data-[state=on]:text-white",
        className
      )}
      {...props}
    />
  );
}
