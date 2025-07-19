import { cn } from "@/lib/utils";

interface LoadingProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function Loading({ className, size = "md" }: LoadingProps) {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-12 w-12", 
    lg: "h-16 w-16"
  };

  return (
    <div className={cn("flex items-center justify-center", className)}>
      <img 
        src="https://i.ibb.co/pBPjSB1R/ani-logo.gif" 
        alt="Loading..." 
        className={cn("animate-pulse", sizeClasses[size])}
      />
    </div>
  );
}

export function LoadingScreen({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
      <Loading size="lg" />
      <p className="text-muted-foreground text-lg">{message}</p>
    </div>
  );
}
