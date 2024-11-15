import * as React from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export interface CurrencyInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange"> {
  value: number;
  onChange: (value: number) => void;
  className?: string;
}

export function CurrencyInput({ 
  value,
  onChange, 
  className,
  ...props 
}: CurrencyInputProps) {
  const formatNumber = (num: number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/[^\d]/g, '');
    const numericValue = rawValue ? Number(rawValue) : 0;
    onChange(numericValue);
  };

  return (
    <Input
      type="text"
      value={value ? formatNumber(value) : ''}
      onChange={handleChange}
      className={cn("text-right", className)}
      {...props}
    />
  );
}