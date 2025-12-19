"use client";

import { useState, useRef, useEffect } from "react";

interface Option {
  id: string;
  label: string;
  sublabel?: string;
}

interface SearchableSelectProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  required?: boolean;
  id?: string;
}

export function SearchableSelect({
  options,
  value,
  onChange,
  placeholder = "Search...",
  label,
  required = false,
  id,
}: SearchableSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  // Find selected option
  const selectedOption = options.find((o) => o.id === value);

  // Filter options based on search
  const filteredOptions = searchTerm
    ? options.filter(
        (o) =>
          o.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
          o.sublabel?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : options;

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchTerm("");
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Scroll highlighted option into view
  useEffect(() => {
    if (isOpen && listRef.current) {
      const highlightedEl = listRef.current.children[
        highlightedIndex
      ] as HTMLElement;
      if (highlightedEl) {
        highlightedEl.scrollIntoView({ block: "nearest" });
      }
    }
  }, [highlightedIndex, isOpen]);

  // Reset highlighted index when filtered options change
  useEffect(() => {
    setHighlightedIndex(0);
  }, [searchTerm]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === "Enter" || e.key === "ArrowDown" || e.key === " ") {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < filteredOptions.length - 1 ? prev + 1 : prev
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : 0));
        break;
      case "Enter":
        e.preventDefault();
        if (filteredOptions[highlightedIndex]) {
          onChange(filteredOptions[highlightedIndex].id);
          setIsOpen(false);
          setSearchTerm("");
        }
        break;
      case "Escape":
        setIsOpen(false);
        setSearchTerm("");
        break;
    }
  };

  const handleSelect = (optionId: string) => {
    onChange(optionId);
    setIsOpen(false);
    setSearchTerm("");
  };

  return (
    <div ref={containerRef} className="relative">
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-slate-700 mb-2"
        >
          {label}
        </label>
      )}

      {/* Selected value / Search input */}
      <div
        className={`relative w-full px-4 py-3 rounded-lg border bg-white text-slate-900 cursor-pointer transition-all ${
          isOpen
            ? "border-primary-500 ring-2 ring-primary-500"
            : "border-slate-300 hover:border-slate-400"
        }`}
        onClick={() => {
          setIsOpen(true);
          setTimeout(() => inputRef.current?.focus(), 0);
        }}
      >
        {isOpen ? (
          <input
            ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="w-full outline-none bg-transparent"
            autoComplete="off"
          />
        ) : (
          <div className="flex items-center justify-between">
            <span
              className={selectedOption ? "text-slate-900" : "text-slate-400"}
            >
              {selectedOption ? selectedOption.label : placeholder}
            </span>
            <svg
              className={`w-5 h-5 text-slate-400 transition-transform ${
                isOpen ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        )}

        {/* Search icon when open */}
        {isOpen && (
          <svg
            className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        )}
      </div>

      {/* Hidden input for form validation */}
      {required && (
        <input
          type="hidden"
          id={id}
          value={value}
          required
        />
      )}

      {/* Dropdown */}
      {isOpen && (
        <ul
          ref={listRef}
          className="absolute z-50 w-full mt-1 max-h-60 overflow-auto bg-white rounded-lg border border-slate-200 shadow-lg"
        >
          {filteredOptions.length === 0 ? (
            <li className="px-4 py-3 text-slate-500 text-center">
              No results found
            </li>
          ) : (
            filteredOptions.slice(0, 100).map((option, index) => (
              <li
                key={option.id}
                onClick={() => handleSelect(option.id)}
                onMouseEnter={() => setHighlightedIndex(index)}
                className={`px-4 py-2.5 cursor-pointer transition-colors ${
                  index === highlightedIndex
                    ? "bg-primary-50 text-primary-900"
                    : "hover:bg-slate-50"
                } ${value === option.id ? "bg-primary-100" : ""}`}
              >
                <div className="font-medium text-sm">{option.label}</div>
                {option.sublabel && (
                  <div className="text-xs text-slate-500 mt-0.5">
                    {option.sublabel}
                  </div>
                )}
              </li>
            ))
          )}
          {filteredOptions.length > 100 && (
            <li className="px-4 py-2 text-xs text-slate-500 text-center border-t">
              Showing 100 of {filteredOptions.length} results. Type to narrow
              down.
            </li>
          )}
        </ul>
      )}
    </div>
  );
}

