import * as React from "react";
import { cn } from "@/lib/utils";

export function Input({ className, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      className={cn(
        "flex w-full rounded-md border border-[#D5DBE1] px-3 py-1 text-sm outline-none placeholder:text-[#7A8794] focus-visible:border-[#0E7C7B] focus-visible:ring-2 focus-visible:ring-[#0E7C7B]/30",
        className
      )}
      {...props}
    />
  );
}
