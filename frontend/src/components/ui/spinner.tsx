import { Loader2Icon } from "lucide-react";

import { cn } from "@/lib/utils";

function Spinner({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <Loader2Icon
      role="status"
      aria-label="Loading"
      className={cn(
        "animate-spin rounded-full border-2 border-gray-300 border-t-green-500",
        className
      )}
      {...props}
    />
  );
}

export { Spinner };
