"use client";

import * as React from "react";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface RichOption {
    value: string;
    label: string;
    color?: string; // Hex code or CSS color
}

interface RichSelectProps {
    options: RichOption[];
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    disabled?: boolean;
    className?: string;
    id?: string;
}

export function RichSelect({
    options,
    value,
    onChange,
    placeholder = "Select...",
    disabled = false,
    className,
    id
}: RichSelectProps) {
    const [isOpen, setIsOpen] = React.useState(false);
    const containerRef = React.useRef<HTMLDivElement>(null);

    const selectedOption = options.find((opt) => opt.value === value);

    // Close on click outside
    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (optionValue: string) => {
        onChange(optionValue);
        setIsOpen(false);
    };

    return (
        <div className={cn("relative", className)} ref={containerRef} id={id}>
            <button
                type="button"
                onClick={() => !disabled && setIsOpen(!isOpen)}
                disabled={disabled}
                className={cn(
                    "flex h-10 w-full items-center justify-between rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-950 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                    isOpen && "ring-2 ring-gray-950 ring-offset-2"
                )}
            >
                {selectedOption ? (
                    <div className="flex items-center gap-2">
                        {selectedOption.color && (
                            <span
                                className="h-4 w-4 rounded-full border border-gray-200"
                                style={{ backgroundColor: selectedOption.color }}
                            />
                        )}
                        <span>{selectedOption.label}</span>
                    </div>
                ) : (
                    <span className="text-gray-500">{placeholder}</span>
                )}
                <ChevronDown className="h-4 w-4 opacity-50" />
            </button>

            {isOpen && (
                <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border border-gray-200 bg-white shadow-md">
                    <div className="p-1">
                        {options.map((option) => (
                            <div
                                key={option.value}
                                onClick={() => handleSelect(option.value)}
                                className={cn(
                                    "flex cursor-pointer items-center justify-between rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-gray-100 hover:text-gray-900",
                                    value === option.value && "bg-gray-100"
                                )}
                            >
                                <div className="flex items-center gap-2">
                                    {option.color && (
                                        <span
                                            className="h-4 w-4 rounded-full border border-gray-200"
                                            style={{ backgroundColor: option.color }}
                                        />
                                    )}
                                    <span>{option.label}</span>
                                </div>
                                {value === option.value && <Check className="h-4 w-4 opacity-50" />}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
