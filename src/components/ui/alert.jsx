import * as React from "react";

function Alert({ children, variant = "default", className, ...props }) {
  const base = "p-3 rounded-md border flex flex-col gap-1";
  const variants = {
    default: "bg-white border-border text-foreground",
    destructive: "bg-destructive/10 border-destructive text-destructive",
    success: "bg-green-50 border-green-200 text-green-800",
  };

  return (
    <div className={[base, variants[variant] || variants.default, className].filter(Boolean).join(" ")} {...props}>
      {children}
    </div>
  );
}

function AlertTitle({ children, className, ...props }) {
  return (
    <div className={["font-medium text-sm", className].filter(Boolean).join(" ")} {...props}>
      {children}
    </div>
  );
}

function AlertDescription({ children, className, ...props }) {
  return (
    <div className={["text-sm text-muted-foreground", className].filter(Boolean).join(" ")} {...props}>
      {children}
    </div>
  );
}

export { Alert, AlertTitle, AlertDescription };
