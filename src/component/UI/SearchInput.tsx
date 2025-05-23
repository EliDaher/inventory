import React from "react";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const SearchInput: React.FC<SearchInputProps> = ({ value, onChange, placeholder }) => {

  const isArabic = /[\u0600-\u06FF]/.test(value);

  return (
    <div className="w-full">
      <input
        type="text"
        className={`${isArabic ? `font-cairo` : `font-inter`} text-right w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-800 dark:text-white dark:border-gray-600`}
        placeholder={placeholder || "ابحث"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

export default SearchInput;
