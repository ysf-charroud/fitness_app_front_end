import { X } from "lucide-react";

const DeleteButton = ({ onDelete, className = "" }) => (
  <button
    type="button"
    onClick={onDelete}
    className={`rounded-full bg-[var(--color-destructive)] text-white flex items-center justify-center hover:bg-[var(--color-destructive)/90] transition-colors shadow-sm ${className}`}
  >
    <X className="w-4 h-4" />
  </button>
);

export default DeleteButton;
