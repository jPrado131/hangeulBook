import React, { useState, useEffect } from "react";

interface SearchableDropdownProps {
  options: Record<string, unknown[]>;
  placeholder?: string;
  onSelect: (value: string) => void;
  defaultValue?: string; // Add defaultValue prop
}

const SearchableDropdown: React.FC<SearchableDropdownProps> = ({
  options,
  placeholder = "Search or select an option...",
  onSelect,
  defaultValue = "", // Default to an empty string if not provided
}) => {
  const [searchTerm, setSearchTerm] = useState(defaultValue);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    if (defaultValue) {
      setSearchTerm(
        defaultValue.split("_")[1].replaceAll("-", " & ").replaceAll("_", " ") +
          ` (${defaultValue.split("_")[0].toUpperCase()}) (${options[defaultValue]?.length || 0})`
      );
    }
  }, [defaultValue, options]);

  const filteredOptions = Object.keys(options).filter((option) =>
    option.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (option: string) => {
    setSearchTerm(
      option.split("_")[1].replaceAll("-", " & ").replaceAll("_", " ") +
        ` (${option.split("_")[0].toUpperCase()}) (${options[option]?.length || 0})`
    );
    setIsDropdownOpen(false);
    onSelect(option);
  };

  const clearSearch = () => {
    setSearchTerm("");
    setIsDropdownOpen(false);
  };

  return (
    <div className="relative w-full">
      <div className="flex items-center">
        <input
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsDropdownOpen(true);
          }}
          onFocus={() => setIsDropdownOpen(true)}
          className="text-black px-4 py-2 rounded-md border border-gray-300 bg-white w-full capitalize"
        />
        {searchTerm && (
          <button
            onClick={clearSearch}
            className="ml-2 text-white hover:text-gray-200"
          >
            ✕
          </button>
        )}
      </div>
      {isDropdownOpen && (
        <ul className="absolute z-10 bg-white text-black border border-gray-300 rounded-md w-full max-h-48 overflow-y-auto mt-1">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option) => (
              <li
                key={option}
                onClick={() => handleSelect(option)}
                className="px-4 py-2 hover:bg-gray-200 cursor-pointer capitalize"
              >
                {option.split("_")[1].replaceAll("-", " & ").replaceAll("_", " ")}

                {option.split("_")[0] === "wi"
                  ? ` (WI) `
                  : option.split("_")[0] === "ii"
                  ? ` (II) `
                  : option.split("_")[0] === "qa"
                  ? ` (QA) `
                  : null}

                ({options[option]?.length || 0})
              </li>
            ))
          ) : (
            <li className="px-4 py-2 text-gray-500">No options found</li>
          )}
        </ul>
      )}
    </div>
  );
};

export default SearchableDropdown;
