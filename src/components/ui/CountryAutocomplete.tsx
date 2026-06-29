"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";

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

// Hardcoded countries list for 100% reliability (no API calls!)
const HARDCODED_COUNTRIES: Country[] = [
  { name: { common: "United States", official: "United States of America" }, cca2: "US", flag: "🇺🇸" },
  { name: { common: "Canada", official: "Canada" }, cca2: "CA", flag: "🇨🇦" },
  { name: { common: "United Kingdom", official: "United Kingdom of Great Britain and Northern Ireland" }, cca2: "GB", flag: "🇬🇧" },
  { name: { common: "Australia", official: "Commonwealth of Australia" }, cca2: "AU", flag: "🇦🇺" },
  { name: { common: "Germany", official: "Federal Republic of Germany" }, cca2: "DE", flag: "🇩🇪" },
  { name: { common: "France", official: "French Republic" }, cca2: "FR", flag: "🇫🇷" },
  { name: { common: "India", official: "Republic of India" }, cca2: "IN", flag: "🇮🇳" },
  { name: { common: "Nigeria", official: "Federal Republic of Nigeria" }, cca2: "NG", flag: "🇳🇬" },
  { name: { common: "Brazil", official: "Federative Republic of Brazil" }, cca2: "BR", flag: "🇧🇷" },
  { name: { common: "Japan", official: "Japan" }, cca2: "JP", flag: "🇯🇵" },
  { name: { common: "Mexico", official: "United Mexican States" }, cca2: "MX", flag: "🇲🇽" },
  { name: { common: "South Africa", official: "Republic of South Africa" }, cca2: "ZA", flag: "🇿🇦" },
  { name: { common: "Kenya", official: "Republic of Kenya" }, cca2: "KE", flag: "🇰🇪" },
  { name: { common: "Egypt", official: "Arab Republic of Egypt" }, cca2: "EG", flag: "🇪🇬" },
  { name: { common: "China", official: "People's Republic of China" }, cca2: "CN", flag: "🇨🇳" },
  { name: { common: "South Korea", official: "Republic of Korea" }, cca2: "KR", flag: "🇰🇷" },
  { name: { common: "Indonesia", official: "Republic of Indonesia" }, cca2: "ID", flag: "🇮🇩" },
  { name: { common: "Pakistan", official: "Islamic Republic of Pakistan" }, cca2: "PK", flag: "🇵🇰" },
  { name: { common: "Bangladesh", official: "People's Republic of Bangladesh" }, cca2: "BD", flag: "🇧🇩" },
  { name: { common: "Rwanda", official: "Republic of Rwanda" }, cca2: "RW", flag: "🇷🇼" }
].sort((a, b) => a.name.common.localeCompare(b.name.common));

export function CountryAutocomplete({
  value,
  onChange,
  placeholder = "Select country",
  className = "",
  required = false,
}: CountryAutocompleteProps) {
  const [filteredCountries, setFilteredCountries] = useState<Country[]>(HARDCODED_COUNTRIES);
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(value);
  const dropdownRef = useRef<HTMLDivElement>(null);

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
          {filteredCountries.length === 0 ? (
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

