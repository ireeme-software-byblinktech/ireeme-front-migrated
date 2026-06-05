import { cn } from "@/lib/utils";
import { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes, forwardRef } from "react";

// ─── Input ────────────────────────────────────────────────────
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  required?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, required, className, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");
    return (
      <div className="form-group">
        {label && (
          <label htmlFor={inputId} className={cn("form-label", required ? "required" : "")}>
            {label}
          </label>
        )}
        <div className="form-input-group">
          {icon && <span className="form-input-icon">{icon}</span>}
          <input
            ref={ref}
            id={inputId}
            className={cn("form-input", error ? "border-red-400" : "", className)}
            {...props}
          />
        </div>
        {error && <p className="form-error">{error}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";

// ─── Select ───────────────────────────────────────────────────
interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  required?: boolean;
  options: { value: string; label: string }[];
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, required, options, placeholder, className, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");
    return (
      <div className="form-group">
        {label && (
          <label htmlFor={inputId} className={cn("form-label", required ? "required" : "")}>
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={inputId}
          className={cn("form-select", error ? "border-red-400" : "", className)}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && <p className="form-error">{error}</p>}
      </div>
    );
  }
);
Select.displayName = "Select";

// ─── Textarea ─────────────────────────────────────────────────
interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  required?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, required, className, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");
    return (
      <div className="form-group">
        {label && (
          <label htmlFor={inputId} className={cn("form-label", required ? "required" : "")}>
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          className={cn("form-textarea", error ? "border-red-400" : "", className)}
          rows={4}
          {...props}
        />
        {error && <p className="form-error">{error}</p>}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";

// ─── SearchInput ──────────────────────────────────────────────
import { Search } from "lucide-react";

interface SearchInputProps extends InputHTMLAttributes<HTMLInputElement> {
  containerClassName?: string;
}

export function SearchInput({ containerClassName, className, ...props }: SearchInputProps) {
  return (
    <div className={cn("search-bar", containerClassName)}>
      <Search size={16} className="search-icon" />
      <input className={className} {...props} />
    </div>
  );
}

