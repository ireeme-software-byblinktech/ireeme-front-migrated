"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronDown, Search } from "lucide-react";
import { apiClient } from "@/lib/api/client";

interface Country {
  name: {
    common: string;
    official: string;
  };
  cca2: string;
  flag: string;
}

interface CountryAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  required?: boolean;
}

export function CountryAutocomplete({
  value,
  onChange,
  placeholder = "Select country",
  className = "",
  required = false,
}: CountryAutocompleteProps) {
  const [countries, setCountries] = useState<Country[]>([]);
  const [filteredCountries, setFilteredCountries] = useState<Country[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(value);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch countries on mount
  useEffect(() => {
    const fetchCountries = async () => {
      setLoading(true);
      try {
        const data: Country[] = await apiClient("/countries");
        const sorted = data.sort((a, b) =>
          a.name.common.localeCompare(b.name.common)
        );
        setCountries(sorted);
        setFilteredCountries(sorted);
      } catch (error) {
        console.error("Failed to fetch countries:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCountries();
  }, []);

  // Filter countries based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredCountries(countries);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = countries.filter(
      (country) =>
        country.name.common.toLowerCase().includes(query) ||
        country.name.official.toLowerCase().includes(query)
    );
    setFilteredCountries(filtered);
  }, [searchQuery, countries]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (country: Country) => {
    onChange(country.name.common);
    setSearchQuery(country.name.common);
    setIsOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchQuery(newValue);
    onChange(newValue);
    setIsOpen(true);
  };

  return (
    <div ref={dropdownRef} className="relative">
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className={`w-full h-14 px-4 pr-10 rounded-xl border border-gray-300 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-black/5 focus:border-black transition-all outline-none text-base ${className}`}
          required={required}
          autoComplete="off"
        />
        <ChevronDown
          className={`absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-xl max-h-[300px] overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center text-gray-500 text-sm">
              Loading countries...
            </div>
          ) : filteredCountries.length === 0 ? (
            <div className="p-4 text-center text-gray-500 text-sm">
              No countries found
            </div>
          ) : (
            <div className="py-2">
              {filteredCountries.map((country) => (
                <button
                  key={country.cca2}
                  type="button"
                  onClick={() => handleSelect(country)}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center gap-3 text-base"
                >
                  <span className="text-2xl">{country.flag}</span>
                  <span className="font-medium text-gray-900">
                    {country.name.common}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

