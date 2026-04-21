import { LockKeyhole } from "lucide-react";
import { Link } from "react-router-dom";

export function DemoActionButton({
  caption = "Create an account to use this feature.",
  className = "",
  label,
  to = "/register",
  variant = "primary",
}) {
  const variantClassName =
    variant === "secondary"
      ? "app-btn-secondary"
      : "app-btn-primary";

  return (
    <div className={className}>
      <Link
        className={`inline-flex h-11 items-center justify-center gap-2 rounded-2xl px-4 text-sm font-semibold transition ${variantClassName}`}
        to={to}
      >
        <LockKeyhole className="h-4 w-4" />
        {label}
      </Link>
      {caption ? <p className="mt-2 text-xs leading-5 text-slate-500">{caption}</p> : null}
    </div>
  );
}
