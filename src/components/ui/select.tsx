// src/components/ui/select.tsx
import React, {
  ReactNode,
  ButtonHTMLAttributes,
  SelectHTMLAttributes,
  OptionHTMLAttributes,
} from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  children: ReactNode;
}

interface SelectContentProps {
  children: ReactNode;
}

interface SelectItemProps extends OptionHTMLAttributes<HTMLOptionElement> {
  value: string;
  children: ReactNode;
}

interface SelectTriggerProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

interface SelectValueProps {
  value: string;
}

export const Select = ({ children, ...props }: SelectProps) => (
  <select {...props}>{children}</select>
);

export const SelectContent = ({ children }: SelectContentProps) => (
  <div>{children}</div>
);

export const SelectItem = ({ value, children }: SelectItemProps) => (
  <option value={value}>{children}</option>
);

export const SelectTrigger = ({ children, ...props }: SelectTriggerProps) => (
  <button {...props}>{children}</button>
);

export const SelectValue = ({ value }: SelectValueProps) => (
  <span>{value}</span>
);
